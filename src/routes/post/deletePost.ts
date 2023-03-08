import { NextFunction, Request, Response, Router } from 'express';
import Post from '../../models/post.model';

const router = Router();

router.delete('/api/post/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if(!id){
    const error = new Error('post id is required') as CustomError;
    error.status = 400;
    return next(error);
  };

  try {
    await Post.findOneAndRemove({_id: id})
  } catch (err) {
    next(new Error('Error occured when deleting the post'))
  };

  res.status(200).json({success: true});
})

export { router as deletePostRouter }