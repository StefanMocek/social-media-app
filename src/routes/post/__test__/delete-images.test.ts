import request from 'supertest';
import {app} from '../../../app';

describe('POST /api/post/:id/delete/images', () => {
  it('should delete images from the post', async () => {
    // Create a new post with images
    const post = await request(app)
      .post('/api/posts')
      .set('Cookie', await global.signup())
      .send({
        title: 'Test post',
        content: 'Test content',
        images: [
          {src: 'image1'},
          {src: 'image2'},
        ]
      })
      .expect(201);

    // Delete one image from the post
    const response = await request(app)
      .post(`/api/post/${post.body.id}/delete/images`)
      .set('Cookie', await global.signup())
      .send({
        imagesIds: [post.body.images[0]._id]
      })
      .expect(200);

    expect(response.body.images.length).toEqual(1);
  });

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
});
