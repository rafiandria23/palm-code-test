import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect h1 to contain substring.
  expect(await page.locator('h1').innerText()).toContain('Welcome');
});
