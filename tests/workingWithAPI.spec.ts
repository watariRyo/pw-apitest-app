import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json';

const baseUrl = 'https://conduit-api.bondaracademy.com/api/';

test.beforeEach(async ({ page }) => {
  await page.route(`${baseUrl}tags`, async (route) => {
    await route.fulfill({
      body: JSON.stringify(tags),
    });
  });
  await page.goto('https://conduit.bondaracademy.com/');
});

test('has title', async ({ page }) => {
  await page.route(`${baseUrl}articles*`, async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = 'This is a test title';
    responseBody.articles[0].description = 'This is a mock description';

    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  await page.getByText('Global Feed').click();

  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await page.waitForTimeout(500); // APIのmockを検知させる待機時間
  await expect(page.locator('app-article-list h1').first()).toContainText(
    'This is a test title'
  );
  await expect(page.locator('app-article-list p').first()).toContainText(
    'This is a mock description'
  );
});

test('delete article', async ({ page, request }) => {
  const articleResponse = await request.post(`${baseUrl}articles/`, {
    data: {
      article: {
        title: 'New Test Article Title',
        description: 'New Test Description',
        body: 'New Test Body',
        tagList: [],
      },
    },
  });
  expect(articleResponse.status()).toEqual(201);

  await page.getByText('Global Feed').click();
  await page.getByText('New Test Article Title').click();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.getByText('Global Feed').click();

  await expect(page.locator('app-article-list h1').first()).not.toContainText(
    'New Test Article Title'
  );
});

test('create article', async ({ page, request }) => {
  await page.getByText('New Article').click();
  await page
    .getByRole('textbox', { name: 'Article Title' })
    .fill('Playwright test');
  await page
    .getByRole('textbox', { name: "What's this article about?" })
    .fill('About the Playwright');
  await page
    .getByRole('textbox', { name: 'Write your article (in markdown)' })
    .fill('we like to use playwright for automation');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  const articleResponse = await page.waitForResponse(`${baseUrl}articles/`);
  const articleResponseBody = await articleResponse.json();
  const slugId = articleResponseBody.article.slug;

  await expect(page.locator('.article-page h1')).toContainText(
    'Playwright test'
  );
  await page.getByText('Home').click();
  await page.getByText('Global Feed').click();
  await expect(page.locator('app-article-list h1').first()).toContainText(
    'Playwright test'
  );

  const deleteArticleRequestResponse = await request.delete(
    `${baseUrl}articles/${slugId}`
  );

  expect(deleteArticleRequestResponse.status()).toEqual(204);
});
