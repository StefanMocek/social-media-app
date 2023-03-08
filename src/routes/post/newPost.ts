import { NextFunction, Request, Response, Router } from 'express';
import Post from '../../models/post.model';

const router = Router();

router.post('/api/post', async (req: Request, res: Response, next: NextFunction) => {
  const {title, content} = req.body;

  if(!title || !content){
    const error = new Error('title and content are required') as CustomError;
    error.status = 400;
    return next(error);
  };

  const newPost = new Post({
    title, 
    content
  });

  await newPost.save();

  res.status(201).json(newPost)
});

export { router as newPostRouter }