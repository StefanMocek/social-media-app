import { NextFunction, Request, Response, Router } from 'express';
import Comment from '../../models/comment.model';
import Post from '../../models/post.model';


const router = Router();

router.post('/api/comment/:postId', async (req: Request, res: Response, next: NextFunction) => {
  const {userName, content} = req.body;
  const {postId} = req.params

  if(!content){
    const error = new Error('title and content are required') as CustomError;
    error.status = 400;
    return next(error);
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
    const error = new Error('cannot add this comment to this post') as CustomError;
    error.status = 400;
    return next(error);
  };

  res.status(201).json(updatedPost)
});

export { router as newCommentRouter }