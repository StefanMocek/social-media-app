import { NextFunction, Request, Response, Router } from 'express';
import Comment from '../../models/comment.model';
import Post from '../../models/post.model';
import { BadRequestError } from '../../../common';

const router = Router();

router.post('/api/comment/:postId', async (req: Request, res: Response, next: NextFunction) => {
  const {userName, content} = req.body;
  const {postId} = req.params

  if(!content){
    return next(new BadRequestError('title and content are required'));
  };

  const newComment = new Comment({
    userName: userName ? userName : 'anonymous', 
    content
  });

  await newComment.save();

  let updatedPost;

  try {
    updatedPost = await Post.findOneAndUpdate(
      {_id: postId},
      { $push: {comments: newComment}},
      { new: true}
    )
  } catch (err) {
    return next(new Error('cannot add this comment to this post'))
  };

  res.status(201).json(updatedPost)
});

export { router as newCommentRouter }