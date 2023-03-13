import request from 'supertest';
import {app} from '../../../app';

describe('POST /api/post', () => {
  it('returns 401 if user is not logged in', async () => {
    const response = await request(app)
      .post('/api/post')
      .send({
        title: 'Test Post',
        content: 'Test content'
      });

    expect(response.status).toBe(401);
  });

  it('returns 400 if title is missing', async () => {
    const user = await global.signup();

    const response = await request(app)
      .post('/api/post')
      .set('Cookie', user)
      .send({
        content: 'Test content'
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual({
      message: 'Title is required',
      field: 'title'
    });
  });

  it('returns 400 if content is missing', async () => {
    const user = await global.signup();

    const response = await request(app)
      .post('/api/post')
      .set('Cookie', user)
      .send({
        title: 'Test Post'
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContainEqual({
      message: 'Content is required',
      field: 'content'
    });
  });

  it('returns 201 and creates a new post with images', async () => {
    const user = await global.signup();

    const response = await request(app)
      .post('/api/post')
      .set('Cookie', user)
      .field('title', 'Test Post')
      .field('content', 'Test content')
      .attach('images', 'test.jpg');

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Post');
    expect(response.body.content).toBe('Test content');
    expect(response.body.images[0].src).toContain('data:image/jpeg;base64,');
  });
});