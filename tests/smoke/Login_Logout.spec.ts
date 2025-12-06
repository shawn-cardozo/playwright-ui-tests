import { test, expect } from '@playwright/test';
import { users, env } from '../../utils/testdata';

test('Login and Logout', async ({ page }) => {
  await page.goto(env.baseURL);

  // Validate login page title
  await expect(page).toHaveTitle(/Swag Labs/);

  // Enter credentials
  await page.getByPlaceholder('Username', { exact: true }).fill(users.validUser.username);
  await page.getByPlaceholder('Password', { exact: true }).fill(users.validUser.password);

  // Click Login button
  await page.getByRole('button', { name: 'Login' }).click();

  // Ensure login succeeded
  await expect(page).toHaveTitle(/Swag Labs/);

  // Open hamburger menu
  await page.locator('#react-burger-menu-btn').click();

  // Verify side menu appears
  await expect(page.locator('.bm-menu-wrap')).toBeVisible();

  // Click Logout
  await page.getByRole('link', { name: 'Logout' }).click();

  // Validate returned to login page
  await expect(page).toHaveTitle(/Swag Labs/);
});
