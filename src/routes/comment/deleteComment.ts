import { NextFunction, Request, Response, Router } from 'express';
import Comment from '../../models/comment.model';
import Post from '../../models/post.model';

const router = Router();

router.delete('/api/comment/:commentId/:postId', async (req: Request, res: Response, next: NextFunction) => {
  const { commentId, postId } = req.params;

  if(!commentId || !postId){
    const error = new Error('post and comment ids are required') as CustomError;
    error.status = 400;
    return next(error);
  };

  try {
    await Comment.findOneAndRemove({_id: commentId});
    await Post.findOneAndUpdate(
      {_id: commentId},
      {$pull: {comments: commentId}}
    )
  } catch (err) {
    next(new Error('comment occured when deleting the comment'))
  };

  res.status(200).json({success: true});
})

export { router as deleteCommentRouter }