import express from 'express';
import PostsController from '../controller/PostsController';

export const postsRouter = express.Router();

const postsController = new PostsController();

postsRouter.post('/createPost', postsController.createPost);

postsRouter.get('/feed', postsController.getFeed);
postsRouter.get('/getPostByType', postsController.getPostsByType);
postsRouter.get('/search', postsController.searchPost);

postsRouter.post('/like', postsController.like);
postsRouter.post('/dislike', postsController.dislike);
