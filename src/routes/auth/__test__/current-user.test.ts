import request from 'supertest';
import {app} from '../../../app';

it('should return current user property', async () => {
  const cookie = await global.signup()

  const res = await request(app)
    .get('/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200)

  expect(res.body.currentUser.email).toEqual("email@email.com")
})
