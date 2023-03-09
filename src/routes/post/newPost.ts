import { NextFunction, Request, Response, Router } from 'express';
import Post from '../../models/post.model';
import { BadRequestError } from '../../../common';

const router = Router();

router.post('/api/post', async (req: Request, res: Response, next: NextFunction) => {
  const {title, content} = req.body;

  if(!title || !content){
    return next(new BadRequestError('title and content are required')) ;
  };

  const newPost = new Post({
    title, 
    content
  });

  await newPost.save();

  res.status(201).json(newPost)
});

export { router as newPostRouter }