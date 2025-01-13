import { chromium, Cookie } from "playwright";

export const authUser = async (username: string, password: string) => {
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
  return {
    isu_id: String(isuId?.trim()),
    auth_token: authTokenCookie?.value,
    refresh_token: refreshTokenCookie?.value,
  };
};
