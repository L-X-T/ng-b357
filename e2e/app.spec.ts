import { expect, test } from '@playwright/test';

test.describe('playwright self test', () => {
  test('homepage title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Home/);
  });
});
