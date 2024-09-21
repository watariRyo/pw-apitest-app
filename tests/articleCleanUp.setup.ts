import { expect, test as setup } from '@playwright/test';

const baseUrl = 'https://conduit-api.bondaracademy.com/api/';

setup('delete article', async ({ request }) => {
  const deleteArticleRequestResponse = await request.delete(
    `${baseUrl}articles/${process.env['SLUGID']}`
  );

  expect(deleteArticleRequestResponse.status()).toEqual(204);
});
