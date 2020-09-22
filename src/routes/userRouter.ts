import express from 'express';
import { signUp } from '../endpoints/signUp';
import { login } from '../endpoints/login';
import { followUser } from '../endpoints/followUser';
import { unFollowUser } from '../endpoints/unFollowUser';

export const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter.post('/follow', followUser);
userRouter.post('/unfollow', unFollowUser);
