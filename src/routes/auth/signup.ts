import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
import { BadRequestError } from '../../../common';

const router = Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});

  if(user){
    return next(new BadRequestError('user with the same email already exist'))
  };

  const newUser = new User({
    email,
    password
  });

  const token = jwt.sign({email, userId: newUser._id}, process.env.JWT_KEY!, { expiresIn: '10h' });

  req.session = {jwt: token};

  await newUser.save();

  res.status(201).json(newUser)
})

export { router as signupRouter }