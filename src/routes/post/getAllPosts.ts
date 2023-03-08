import { NextFunction, Request, Response, Router } from 'express';
import Post from 'src/models/post.model';

const router = Router();

router.get('/api/post', async (req: Request, res: Response, next: NextFunction) => {
  const posts = await Post.find()
  res.status(200).json(posts);
})

export { router as getAllPostsRouter }