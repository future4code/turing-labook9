import express from 'express';
import { createPost } from '../endpoints/createPost';

export const postsRouter = express.Router();

postsRouter.post('/createPost', createPost);
