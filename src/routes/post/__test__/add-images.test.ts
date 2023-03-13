import request from 'supertest';
import { app } from '../../../app';

describe('POST /api/post/:id/add/images', () => {
  it('returns a 401 status when not logged in', async () => {
    const response = await request(app)
      .post('/api/post/1/add/images')
      .attach('image', './test.jpg');
    expect(response.status).toBe(401);
  });

  it('returns a 404 status when the post is not found', async () => {
    const response = await request(app)
      .post('/api/post/1/add/images')
      .set('Cookie', await global.signup())
      .attach('image', './test.jpg');
    expect(response.status).toBe(404);
  });

  it('returns a 400 status when no images are provided', async () => {
    const response = await request(app)
      .post('/api/post/1/add/images')
      .set('Cookie', await global.signup())
    expect(response.status).toBe(400);
  });

  it('adds images to a post', async () => {
    const agent = request.agent(app);

    // create a post
    const postResponse = await agent
      .post('/api/post')
      .set('Cookie', await global.signup())
      .send({
        title: 'Test Post',
        content: 'This is a test post',
      });
    const postId = postResponse.body.id;

    // add images to the post
    const response = await agent
      .post(`/api/post/${postId}/add/images`)
      .set('Cookie', await global.signup())
      .attach('image', './test.jpg')
      .attach('image', './test2.jpg');
    expect(response.status).toBe(200);
    expect(response.body.images.length).toBe(2);
  });
});
