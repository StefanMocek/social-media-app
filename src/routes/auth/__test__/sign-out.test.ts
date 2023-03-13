import request from 'supertest';
import {app} from '../../../app';

describe('Signout Router', () => {
  it('clears the session cookie', async () => {
    // sign up first to get a cookie
    const cookie = await global.signup();

    // call the signout route with the cookie
    const response = await request(app)
      .post('/signout')
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    // check if the session cookie has been cleared
    expect(response.get('Set-Cookie')).toEqual([
      'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    ]);
  });

  it('responds with an empty object', async () => {
    // sign up first to get a cookie
    const cookie = await global.signup();

    // call the signout route with the cookie
    const response = await request(app)
      .post('/signout')
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    // check if the response body is empty
    expect(response.body).toEqual({});
  });
});