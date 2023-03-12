import * as dotenv from 'dotenv';
dotenv.config();

import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieSession from 'cookie-session';
import {
  newPostRouter,
  getPostRouter,
  getAllPostsRouter,
  updatePostRouter,
  deletePostRouter,

  addImagesRouter,
  deleteImagesRouter,

  newCommentRouter,
  deleteCommentRouter,

  signinRouter,
  signupRouter,
  signOutRouter
} from './routes';
import {currentUser, errorHandler, NotFoundError, requireAuth} from '../common';

const app = express();

app.set('trust proxy', true);

app.use(cors({
  optionsSuccessStatus: 200
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: false
}))

app.use(currentUser);

app.use(signinRouter);
app.use(signupRouter);
app.use(signOutRouter);
app.use(currentUser);

app.use(requireAuth, newPostRouter);
app.use(getPostRouter);
app.use(getAllPostsRouter);
app.use(requireAuth, updatePostRouter);
app.use(requireAuth, deletePostRouter);
app.use(requireAuth, addImagesRouter);
app.use(requireAuth, deleteImagesRouter);

app.use(requireAuth, newCommentRouter);
app.use(requireAuth, deleteCommentRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
})

app.use(errorHandler)

const PORT = process.env.PORT || 8080;

const start = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is require')
  };
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is require')
  };

  try {
    await mongoose.connect(process.env.MONGO_URL)
  } catch (error) {
    throw new Error('database connection error')
  }

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

start();