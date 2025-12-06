import { test, expect } from '@playwright/test';
import { users, env } from '../../utils/testdata';

test('Login and Logout', async ({ page }) => {
  await page.goto(env.baseURL);

  await expect(page).toHaveTitle(/Swag Labs/);

  // Login
  await page.getByPlaceholder('Username', { exact: true }).fill(users.validUser.username);
  await page.getByPlaceholder('Password', { exact: true }).fill(users.validUser.password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveTitle(/Swag Labs/);

  // Cart should be empty
  await expect(page.locator('.shopping_cart_badge')).toBeHidden();

  // Add Jacket
  await page.locator('[name="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Add Bike Light
  await page.locator('[name="add-to-cart-sauce-labs-bike-light"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // Go to cart
  await page.locator('#shopping_cart_container').click();
  await expect(page).toHaveURL(`${env.baseURL}/cart.html`);

  // Validate cart items
  await expect(page.getByRole('link', { name: 'Sauce Labs Fleece Jacket' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sauce Labs Bike Light' })).toBeVisible();

  // Checkout
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(`${env.baseURL}/checkout-step-one.html`);

  // User Info
  await page.getByPlaceholder('First Name').fill('First User1');
  await page.getByPlaceholder('Last Name').fill('Last User1');
  await page.getByPlaceholder('Zip/Postal Code').fill('11111');

  await page.getByRole('button', { name: 'Continue' }).click();

  // Step Two
  await expect(page).toHaveURL(`${env.baseURL}/checkout-step-two.html`);
  await expect(page.getByText('Checkout: Overview')).toBeVisible();

  await expect(page.getByRole('link', { name: 'Sauce Labs Fleece Jacket' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sauce Labs Bike Light' })).toBeVisible();

  // Payment Info
  await expect(page.locator('[data-test="payment-info-value"]')).toBeVisible();

  // Finish checkout
  await page.getByRole('button', { name: 'Finish' }).click();

  // Complete page
  await expect(page.getByText('Checkout: Complete!')).toBeVisible();
  await expect(page.getByAltText('Pony Express')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  await expect(page.getByText('Your order has been dispatched')).toBeVisible();

  // Back Home
  await page.getByRole('button', { name: 'Back Home' }).click();
  await expect(page).toHaveTitle(/Swag Labs/);

  // Open menu → Logout
  await page.locator('#react-burger-menu-btn').click();
  await expect(page.locator('.bm-menu-wrap')).toBeVisible();

  await page.getByRole('link', { name: 'Logout' }).click();

  // Validate returned to login page
  await expect(page).toHaveTitle(/Swag Labs/);
});
