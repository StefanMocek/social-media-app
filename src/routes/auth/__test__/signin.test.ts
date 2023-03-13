import request from 'supertest';
import { app } from '../../../app';

describe('Signin Route', () => {
  it('should return 400 if email does not exist', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('should return 400 if password is incorrect', async () => {
    // Create a user
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    // Attempt to signin with incorrect password
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'wrongpassword',
      })
      .expect(400);
  });

  it('should respond with a cookie when given valid credentials', async () => {
    // Create a user
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    // Signin with valid credentials
    const signinResponse = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);

    // Ensure a cookie is present
    expect(signinResponse.get('Set-Cookie')).toBeDefined();
  });
});