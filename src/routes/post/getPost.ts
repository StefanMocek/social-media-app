import { NextFunction, Request, Response, Router } from 'express';
import Post from '../../models/post.model';

const router = Router();

router.get('/api/post/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  let post;

  try {
    post = await Post.findOne({_id: id}).populate('comments')
  } catch (err) {
    const error = new Error('cannot find the post') as CustomError;
    error.status = 400;
    return next(error);
  };

  res.status(200).json(post);
})

export { router as getPostRouter }