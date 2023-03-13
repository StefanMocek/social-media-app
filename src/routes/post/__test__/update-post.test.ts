import request from 'supertest';
import {app} from '../../../app';
import Post from '../../../models/post.model';

describe('post routes', () => {
  it('returns 400 if post id is not provided', async () => {
    const response = await request(app)
      .post('/api/post/')
      .set('Cookie', await global.signup())
      .send({
        title: 'Post Title',
        content: 'Post Content'
      })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('post id is required');
  });

  it('returns 400 if title is not provided', async () => {
    const response = await request(app)
      .post('/api/post/1234')
      .set('Cookie', await global.signup())
      .send({
        content: 'Post Content'
      })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('Title is required');
  });

  it('returns 400 if content is not provided', async () => {
    const response = await request(app)
      .post('/api/post/1234')
      .set('Cookie', await global.signup())
      .send({
        title: 'Post Title'
      })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('Content is required');
  });

  it('returns 400 if post is not found', async () => {
    const response = await request(app)
      .post('/api/post/1234')
      .set('Cookie', await global.signup())
      .send({
        title: 'Post Title',
        content: 'Post Content'
      })
      .expect(400);

    expect(response.body.errors[0].message).toEqual('post cannot be updated');
  });

  it('returns 200 and the updated post', async () => {
    const title = 'Post Title';
    const content = 'Post Content';

    const user = await global.signup();
    const post = Post.build({ title, content, images: [] });
    await post.save();

    const response = await request(app)
      .post(`/api/post/${post.id}`)
      .set('Cookie', user)
      .send({ title: 'New Title', content: 'New Content' })
      .expect(200);

    expect(response.body.title).toEqual('New Title');
    expect(response.body.content).toEqual('New Content');
  });
});