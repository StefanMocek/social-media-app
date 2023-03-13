import request from 'supertest';
import { app } from '../../../app';
import Post from '../../../models/post.model';


describe('POST /api/post', () => {
  it('responds with 200 and an empty array if no posts exist', async () => {
    const response = await request(app).get('/api/post');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('responds with 200 and an array of posts if posts exist', async () => {
    const post = await Post.build({
      title: 'Test Post',
      content: 'This is a test post',
      images: [{ src: 'https://example.com/image.jpg' }]
    }).save();

    const response = await request(app).get('/api/post');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        _id: post._id.toString(),
        title: 'Test Post',
        content: 'This is a test post',
        images: [{ src: 'https://example.com/image.jpg' }],
        comments: []
      }
    ]);
  });
});