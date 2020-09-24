import express from 'express';
import LikesController from '../controller/LikesController';

export const likesRouter = express.Router();

const likesController = new LikesController();

likesRouter.post('/like', likesController.like);
likesRouter.post('/dislike', likesController.dislike);
