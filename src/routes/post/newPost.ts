import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response, Router } from 'express';
import {body} from 'express-validator';
import Post from '../../models/post.model';
import User from '../../models/user.model';
import { BadRequestError, uploadImages, validationRequest} from '../../../common';

const router = Router();

router.post('/api/post',
  uploadImages, 
  [ body('title')
  .not().isEmpty()
  .withMessage('Title is required'),

  body('content')
    .not().isEmpty()
    .withMessage('Content is required'),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    
    const {title, content} = req.body;

    if(!req.files) {
      return next(new BadRequestError('images are required'));
    };

    let images: Array<Express.Multer.File>;

    if(typeof req.files === 'object') {
      images = Object.values(req.files)
    } else {
      images = req.files ? [...req.files] : []
    }

    const newPost = Post.build({
      title, 
      content,
      images : images.map((file: Express.Multer.File) => {
        let srcObj = { src : `data:${file.mimetype};base64,${fs.readFileSync(path.join('upload/' + file.filename)).toString('base64')}`};
        fs.unlink(path.join('upload/' + file.filename), () => {})
        return srcObj
      })
    });

    await newPost.save();

    await User.findOneAndUpdate(
      {_id: req.currentUser!.userId},
      {$push: {posts: newPost._id}}  
    )

    res.status(201).json(newPost)
});

export { router as newPostRouter }