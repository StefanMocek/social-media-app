import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
import { BadRequestError, validationRequest } from '../../../common';
import {body} from 'express-validator';

const router = Router();

router.post('/signup', 
  [ body('email')
    .not().isEmpty()
    .isEmail()
    .withMessage('Valid email is required'),
  
    body('password')
      .not().isEmpty()
      .isLength({min: 6})
      .withMessage('Valid password is required'),
  ],
  validationRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user){
      return next(new BadRequestError('user with the same email already exist'))
    };

    const newUser = User.build({
      email,
      password
    });

    const token = jwt.sign({email, userId: newUser._id}, process.env.JWT_KEY!, { expiresIn: '10h' });

    req.session = {jwt: token};

    await newUser.save();

    res.status(201).json(newUser)
})

export { router as signupRouter }