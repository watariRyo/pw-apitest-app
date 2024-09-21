import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json';

const uiUrl = 'https://conduit.bondaracademy.com/';

test('Like counter increase', async ({ page }) => {
  await page.goto(uiUrl);
  await page.getByText('Global Feed').click();
  const firstLikeButton = page
    .locator('app-article-preview')
    .first()
    .locator('button');

  await firstLikeButton.click();
  await expect(firstLikeButton).toContainText('1');
});
