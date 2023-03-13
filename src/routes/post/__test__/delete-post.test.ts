import request from 'supertest';
import { app } from '../../../app';

describe('POST /api/post/:id', () => {
  it('returns 400 if post id is not provided', async () => {
    const response = await request(app)
      .delete('/api/post/')
      .set('Cookie', await global.signup())
      .send({})
      .expect(400);

    expect(response.body.errors[0].message).toEqual('post id is required');
  });

  it('returns 401 if user is not logged in', async () => {
    const response = await request(app)
      .delete('/api/post/123')
      .send({})
      .expect(401);
  });

  it('returns 404 if post is not found', async () => {
    const response = await request(app)
      .delete('/api/post/123')
      .set('Cookie', await global.signup())
      .send({})
      .expect(404);

    expect(response.body.errors[0].message).toEqual('Error occured when deleting the post');
  });

  it('returns 200 if post is successfully deleted', async () => {
    const createPostResponse = await request(app)
      .post('/api/post')
      .set('Cookie', await global.signup())
      .send({
        title: 'Test Post',
        content: 'Test Content',
        images: [{ src: 'test-image.png' }],
      })
      .expect(201);

    const postId = createPostResponse.body.id;

    await request(app)
      .delete(`/api/post/${postId}`)
      .set('Cookie', await global.signup())
      .send({})
      .expect(200);
  });
});