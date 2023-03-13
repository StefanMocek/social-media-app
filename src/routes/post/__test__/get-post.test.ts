import request from 'supertest';
import { app } from '../../../app';
import Post from '../../../models/post.model';

describe('POST /api/post/:id', () => {
  it('should return a post with the given id', async () => {
    // Create a post and save its id
    const post = await Post.build({
      title: 'Test Post',
      content: 'This is a test post.',
      images: [{ src: 'test.jpg' }],
    }).save();

    // Send a GET request to the router with the post id
    const response = await request(app).get(`/api/post/${post._id}`);

    // Assert that the response is successful and returns the correct post
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Post');
    expect(response.body.content).toBe('This is a test post.');
    expect(response.body.images[0].src).toBe('test.jpg');
  });

  it('should return an error if post is not found', async () => {
    // Send a GET request to the router with an invalid post id
    const response = await request(app).get('/api/post/123');

    // Assert that the response returns an error
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('cannot find the post');
  });
});