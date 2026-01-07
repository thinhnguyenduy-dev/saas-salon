import { test, expect } from '@playwright/test';

test('homepage has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/BeautyBook/);
  
  // Expect the main heading to be visible
  await expect(page.locator('h1').first()).toBeVisible();
});
