import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model';
import { authenticationService, BadRequestError } from '../../../common';

const router = Router();

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if(!user) {
    return next(new BadRequestError('wrong credentials'))
  };

  const isEqual = await authenticationService.pwdCompare(user.password, password);

  if(!isEqual) {
    return next(new BadRequestError('wrong credentials'));
  };

  const token = jwt.sign({email, userId: user._id}, process.env.JWT_KEY!, { expiresIn: '10h' });

  req.session = {jwt: token};

  res.status(200).send(user);
})

export { router as signinRouter }