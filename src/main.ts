import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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