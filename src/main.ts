import * as dotenv from 'dotenv';
dotenv.config();

import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import {
  newPostRouter,
  getPostRouter,
  getAllPostsRouter,
  updatePostRouter,
  deletePostRouter,
  newCommentRouter,
  deleteCommentRouter
} from './routes';

const app = express();

app.use(cors({
  optionsSuccessStatus: 200
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(newPostRouter);
app.use(getPostRouter);
app.use(getAllPostsRouter);
app.use(updatePostRouter);
app.use(deletePostRouter);

app.use(newCommentRouter);
app.use(deleteCommentRouter);

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
  }
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