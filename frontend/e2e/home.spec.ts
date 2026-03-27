import { expect, test } from '@playwright/test';

test('home page renders and links work', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: /build your next product fast/i })
  ).toBeVisible();

  await page.getByRole('link', { name: /view docs/i }).click();
  await expect(page).toHaveURL(/\/docs$/);
});
