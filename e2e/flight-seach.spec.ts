import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('flight search a11y', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/flights/flight-search');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
