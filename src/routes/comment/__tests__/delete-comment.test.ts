import request from 'supertest';
import { app } from '../../../app';
import Post, {PostDoc} from '../../../models/post.model';
import Comment from '../../../models/comment.model';

describe('DELETE /api/comment/:commentId/:postId', () => {
  it('should return 400 if no commentId or postId is provided', async () => {
    const cookie = await global.signup();

    const res = await request(app)
      .delete('/api/comment')
      .set('Cookie', cookie)
      .send({})
      .expect(400);

    expect(res.body[0].message).toEqual('post and comment ids are required');
  });

  it('should return 401 if user is not authenticated', async () => {
    const res = await request(app)
      .delete('/api/comment/123/456')
      .send({})
      .expect(401);

    expect(res.body[0].message).toEqual('not authorized');
  });

  it('should remove the comment with the given ID and update the post comments array', async () => {
    const cookie = await global.signup();

    const post = Post.build({
      title: 'Test Post',
      content: 'This is a test post.',
      images: [{ src: 'https://test.com/image.jpg' }],
    });
    await post.save();

    const comment = Comment.build({
      userName: 'Test User',
      content: 'This is a test comment.',
    });
    await comment.save();

    post.comments = [comment.id];
    await post.save();

    const res = await request(app)
      .delete(`/api/comment/${comment.id}/${post.id}`)
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    expect(res.body.comments).toHaveLength(0);

    const updatedPost = await Post.findById(post.id) as PostDoc;
    expect(updatedPost.comments).toHaveLength(0);

    const deletedComment = await Comment.findById(comment.id);
    expect(deletedComment).toBeNull();
  });

  it('should return 500 if an error occurs during the comment removal process', async () => {
    const cookie = await global.signup();

    const post = Post.build({
      title: 'Test Post',
      content: 'This is a test post.',
      images: [{ src: 'https://test.com/image.jpg' }],
    });
    await post.save();

    const comment = Comment.build({
      userName: 'Test User',
      content: 'This is a test comment.',
    });
    await comment.save();

    post.comments = [comment.id];
    await post.save();

    jest.spyOn(Comment, 'findOneAndRemove').mockImplementationOnce(() => {
      throw new Error('Test Error');
    });

    const res = await request(app)
      .delete(`/api/comment/${comment.id}/${post.id}`)
      .set('Cookie', cookie)
      .send({})
      .expect(500);

    expect(res.body[0].message).toEqual('comment occured when deleting the comment');
  });
});
