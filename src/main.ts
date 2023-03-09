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
  newCommentRouter,
  deleteCommentRouter
} from './routes';
import {currentUser, requireAuth} from '../common';

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

app.use(requireAuth, newPostRouter);
app.use(getPostRouter);
app.use(getAllPostsRouter);
app.use(requireAuth, updatePostRouter);
app.use(requireAuth, deletePostRouter);

app.use(requireAuth, newCommentRouter);
app.use(requireAuth, deleteCommentRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const error = new Error('not Found') as CustomError;
  error.status = 404;
  next(error);
})

declare global {
  interface CustomError extends Error {
    status?: number
  }
};

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (error.status) {
    return res.status(error.status).json({message: error.message})
  };

  res.status(500).json({message: 'Something went wrong'})
})

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