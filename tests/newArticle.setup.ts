import { expect, test as setup } from '@playwright/test';

const baseUrl = 'https://conduit-api.bondaracademy.com/api/';

setup('create article page', async ({ page, request }) => {
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
  const response = await articleResponse.json();
  const slugId = response.article.slug;
  process.env['SLUGID'] = slugId;
});
