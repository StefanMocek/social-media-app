import request from 'supertest';
import { app } from '../../../app';

describe('POST /api/comment/:postId', () => {
  it('returns 201 with updated post object when valid request is made and user is logged in', async () => {
    // Arrange
    const cookie = await global.signup(); // logs in user and gets cookie

    const createPostResponse = await request(app)
      .post('/api/post')
      .set('Cookie', cookie)
      .send({
        title: 'Test Post',
        content: 'This is a test post',
        images: [{ src: 'test.jpg' }]
      });
    const postId = createPostResponse.body._id;

    // Act
    const response = await request(app)
      .post(`/api/comment/${postId}`)
      .set('Cookie', cookie)
      .send({
        userName: 'Test User',
        content: 'This is a test comment'
      });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('title', 'Test Post');
    expect(response.body).toHaveProperty('content', 'This is a test post');
    expect(response.body).toHaveProperty('images', [{ src: 'test.jpg' }]);
    expect(response.body.comments).toHaveLength(1);
    expect(response.body.comments[0]).toHaveProperty('userName', 'Test User');
    expect(response.body.comments[0]).toHaveProperty('content', 'This is a test comment');
  });

  it('returns 400 with error message when request is missing required content field', async () => {
    // Arrange
    const cookie = await global.signup(); // logs in user and gets cookie

    const createPostResponse = await request(app)
      .post('/api/post')
      .set('Cookie', cookie)
      .send({
        title: 'Test Post',
        content: 'This is a test post',
        images: [{ src: 'test.jpg' }]
      });
    const postId = createPostResponse.body._id;

    // Act
    const response = await request(app)
      .post(`/api/comment/${postId}`)
      .set('Cookie', cookie)
      .send({
        userName: 'Test User'
      });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0]).toHaveProperty('message', 'title and content are required');
  });

  it('returns 400 with error message when there is no post with provided id', async () => {
    // Arrange
    const cookie = await global.signup(); // logs in user and gets cookie

    // Act
    const response = await request(app)
      .post(`/api/comment/12345`)
      .set('Cookie', cookie)
      .send({
        userName: 'Test User'
      });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0]).toHaveProperty('message', 'title and content are required');
  });

  it('returns 401 when user is not logged in', async () => {
    // Arrange
    const createPostResponse = await request(app)
      .post('/api/post')
      .send({
        title: 'Test Post',
        content: 'This is a test post',
        images: [{ src: 'test.jpg' }]
      });
    const postId = createPostResponse.body._id;

    // Act
    const response = await request(app)
      .post(`/api/comment/${postId}`)
      .send({
        userName: 'Test User',
        content: 'This is a test comment'
      });

    // Assert
    expect(response.status).toBe(401);
  })
})