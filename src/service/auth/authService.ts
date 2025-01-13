import { chromium, Cookie } from "playwright";
import { db } from "../../db/db";
import { Users } from "../../db/schema/userSchema";
import { AuthData } from "../../types/authTypes";

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

  return {
    isu_id: String(isuId?.trim()),
    access_token: authTokenCookie?.value,
    refresh_token: refreshTokenCookie?.value,
    password: password,
  };
};

export const writeAuthDataToDB = async (authData: AuthData) => {
  try {
    await db
      .insert(Users)
      .values(authData)
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
