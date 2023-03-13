import request from 'supertest';
import {app} from '../../../app';

jest.setTimeout(50000);

describe('Signup Route', () => {
  it('returns 201 on successfull signup', async () => {
    return request(app)
      .post('/signup')
      .send({
        email: "testemail@email.com",
        password: "abc123"
      })
      .expect(201)
  });

  it('sets cookies after successfully signup', async () => {
    const res = request(app)
      .post('/signup')
      .send({
        email: "testemail@email.com",
        password: "abc123"
      })
      .expect(201)

    expect(res.get('Set-Cookie')).toBeDefined()
  })
})