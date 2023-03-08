import { NextFunction, Request, Response, Router } from 'express';
import Post from 'src/models/post.model';

const router = Router();

router.post('/api/post/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const {title, content} = req.body;

  if(!id){
    const error = new Error('post id is required') as CustomError;
    error.status = 400;
    return next(error);
  };

  let updatedPost;

  try {
    updatedPost = await Post.findOneAndUpdate(
      {_id: id}, 
      {$set: {title, content}}, 
      {new: true}
    );
  } catch (err) {
    const error = new Error('post cannot be updated') as CustomError;
    error.status = 400;
    return next(error);
  };

  res.status(200).json(updatedPost)

});

export { router as updatePostRouter }