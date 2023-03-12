import {NextFunction, Request, Response, Router} from 'express';
import {body} from 'express-validator';
import Post from '../../models/post.model';
import {BadRequestError, validationRequest} from '../../../common';

const router = Router();

router.post(
  '/api/post/:id',
  [body('title')
    .not().isEmpty()
    .withMessage('Title is required'),

  body('content')
    .not().isEmpty()
    .withMessage('Content is required'),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    
    const {id} = req.params;
    const {title, content} = req.body;

    if (!id) {
      return next(new BadRequestError('post id is required'));
    };

    let updatedPost;

    try {
      updatedPost = await Post.findOneAndUpdate(
        {_id: id},
        {$set: {title, content}},
        {new: true}
      );
    } catch (err) {
      return next(new BadRequestError('post cannot be updated'));
    };

    res.status(200).json(updatedPost);
  });

export {router as updatePostRouter};
