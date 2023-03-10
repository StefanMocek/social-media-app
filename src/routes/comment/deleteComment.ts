import { NextFunction, Request, Response, Router } from 'express';
import Comment from '../../models/comment.model';
import Post from '../../models/post.model';
import { BadRequestError } from '../../../common';

const router = Router();

router.delete('/api/comment/:commentId/:postId', async (req: Request, res: Response, next: NextFunction) => {
  const { commentId, postId } = req.params;

  if(!commentId || !postId){
    return next(new BadRequestError('post and comment ids are required')); 
  };

  let post;

  try {
    await Comment.findOneAndRemove({_id: commentId});
    post = await Post.findOneAndUpdate(
      {_id: commentId},
      {$pull: {comments: commentId}},
      {new: true}
    )
  } catch (err) {
    next(new Error('comment occured when deleting the comment'))
  };

  res.status(200).json(post);
})

export { router as deleteCommentRouter }