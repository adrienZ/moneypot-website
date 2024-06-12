import { test, expect } from "@playwright/test";
import { testUser } from "./helpers/tests-seed";

test("Auth", async ({ page }) => {
  await page.goto("/login");
  const email = page.getByLabel("email");
  await email.fill(testUser.email);

  const password = page.getByLabel("password");
  await password.fill("loulou");

  await page.getByText("Submit").click();

  await page.waitForURL("/");
  await page.waitForLoadState();

  await page.getByAltText("Avatar").click();
  await page.waitForURL("/settings");

  expect(page.url()).toBe("http://localhost:3000/settings");
  await page.waitForLoadState("networkidle");

  const signOutTrigger = page.getByRole("button", { name: "Sign out" });
  expect(signOutTrigger).toHaveCount(1);

  await signOutTrigger.click();
  await page.waitForURL("/login");
  await page.waitForLoadState();

  expect(await page.getByAltText("Avatar")).toHaveCount(0);
});
