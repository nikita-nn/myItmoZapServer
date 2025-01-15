import {chromium, Cookie} from "playwright";
import {db} from "../../db/db";
import {Users} from "../../db/schema/userSchema";
import {AuthData} from "../../types/authTypes";
import {urlData} from "../../settings";
import {eq} from "drizzle-orm";

export const authUser = async (
  username: string,
  password: string,
): Promise<AuthData | null> => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://my.itmo.ru");
  await page.waitForSelector("div.login-pf-signup");
  await page.locator("#username").fill(username);
  await page.locator("#password").fill(password);
  await page.locator("#kc-login").click();
  if (await page.locator("#input-error").isVisible()) {
    await context.close();
    await browser.close();
    return null;
  }
  await page.waitForURL("https://my.itmo.ru");
  const cookies = await context.cookies();
  const authTokenCookie = cookies.find(
    (cookie: Cookie) => cookie.name === "auth._id_token.itmoId",
  );
  const refreshTokenCookie = cookies.find(
    (cookie: Cookie) => cookie.name === "auth._refresh_token.itmoId",
  );
  const isuId = await page.locator(".navbar-user-id").first().textContent();
  await context.close();
  await browser.close();

  if (!authTokenCookie?.value || !refreshTokenCookie?.value) {
    return null;
  }
  const data = {
    isu_id: String(isuId?.trim()),
    access_token: authTokenCookie?.value,
    refresh_token: refreshTokenCookie?.value,
    password: password,
  };
  await writeAuthDataToDB(data);
  return data;
};

export const writeAuthDataToDB = async (authData: AuthData) => {
  try {
    await db
      .insert(Users)
      .values({...authData , accessTokenIssued: new Date(), refreshTokenIssued: new Date()})
      .onConflictDoUpdate({
        target: Users.isu_id,
        set: {
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          password: authData.password,
        },
      });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const refreshAccessToken = async (isu_id: string) => {
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.isu_id, isu_id))
    .then((users) => users[0]);


  if (!user) {
    return;
  }
  const accessTokenIssued = new Date(user.accessTokenIssued);
  const now = new Date();

  const differenceMs = now.getTime() - accessTokenIssued.getTime();

  const isMoreThan30Minutes = differenceMs > 30 * 60 * 1000;

  if (!isMoreThan30Minutes) {
    return user.access_token
  }

  const data = new URLSearchParams({
    client_id: "student-personal-cabinet",
    grant_type: "refresh_token",
    refresh_token: user.refresh_token,
  });

  const response = await fetch(urlData.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: data,
  });

  const result = await response.json();

  if (response.ok) {
    await db
      .update(Users)
      .set({ access_token: result.access_token, accessTokenIssued: new Date() })
      .where(eq(Users.isu_id, String(isu_id)));
    return result.access_token;
  } else {
    const result = await authUser(user.isu_id, user.password);

    if (!result) {
      return null;
    }

    await db.update(Users).set({access_token: result.access_token, refresh_token: result.refresh_token, accessTokenIssued: new Date() , refreshTokenIssued: new Date()}).where(eq(Users.isu_id, String(isu_id)));
    return result.access_token;
  }
};

export const checkUser = async (isuId: string) =>{
  return await db.select().from(Users).where(eq(Users.isu_id, isuId)).then((users) => users[0]);
}
