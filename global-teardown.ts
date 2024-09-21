import { expect, request } from '@playwright/test';

const articleUrl = 'https://conduit-api.bondaracademy.com/api/articles/';

async function globalTeardown() {
  const context = await request.newContext();
  const deleteArticleRequestResponse = await context.delete(
    `${articleUrl}${process.env.SLUGID}`,
    {
      headers: {
        Authorization: `Token ${process.env['ACCESS_TOKEN']}`,
      },
    }
  );

  expect(deleteArticleRequestResponse.status()).toEqual(204);
}

export default globalTeardown;
