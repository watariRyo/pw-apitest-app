import { expect, request } from '@playwright/test';
import user from './.auth/user.json';
import fs from 'fs';

const authFile = '.auth/user.json';
const loginUrl = 'https://conduit-api.bondaracademy.com/api/users/login';
const articleUrl = 'https://conduit-api.bondaracademy.com/api/articles/';

async function globalSetup() {
  const context = await request.newContext();
  const responseToken = await context.post(loginUrl, {
    data: {
      user: {
        email: 'rwtest@test.com',
        password: 'Welcome1',
      },
    },
  });

  const responseBody = await responseToken.json();
  const accessToken = responseBody.user.token;

  user.origins[0].localStorage[0].value = accessToken;
  fs.writeFileSync(authFile, JSON.stringify(user));

  process.env['ACCESS_TOKEN'] = accessToken;

  const articleResponse = await context.post(`${articleUrl}`, {
    data: {
      article: {
        title: 'Global Test Article Title',
        description: 'New Test Description',
        body: 'New Test Body',
        tagList: [],
      },
    },
    headers: {
      Authorization: `Token ${process.env['ACCESS_TOKEN']}`,
    },
  });
  expect(articleResponse.status()).toEqual(201);
  console.log(`my act ${process.env['ACCESS_TOKEN']}`);
  const response = await articleResponse.json();
  const slugId = response.article.slug;
  process.env['SLUGID'] = slugId;
}

export default globalSetup;
