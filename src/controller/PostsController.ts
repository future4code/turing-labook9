import { Request, Response } from 'express';
import * as PostControllerModule from '../modules/PostControllerModule';

import dayjs from 'dayjs';

export default class PostsController {
  public createPost = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const authenticator = new PostControllerModule.Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      const idGenerator = new PostControllerModule.IdGenerator();
      const PostId = idGenerator.generateId();

      const createdAt = dayjs(req.body.date).format('YYYY-MM-DD');

      const postData = {
        photo: req.body.photo,
        description: req.body.description,
        type: req.body.type,
      };

      const postDatabase = new PostControllerModule.PostDatabase();
      await postDatabase.createPost(
        PostId,
        postData.photo,
        postData.description,
        createdAt,
        postData.type,
        userId,
      );
      res.status(200).send({
        message: 'Post criado com sucesso',
      });
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await PostControllerModule.BaseDatabase.destroyConnection();
  };

  public getFeed = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const authenticator = new PostControllerModule.Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      const feedDatabase = new PostControllerModule.FeedDatabase();
      const feed = await feedDatabase.getFeed(userId);
      const mappedFeed = feed.map((item: any) => ({
        id: item.post_id,
        photo: item.post_photo,
        description: item.post_description,
        createdAt: dayjs(item.post_createdAt).format('DD/MM/YYYY'),
        type: item.post_type,
        userId: item.post_userId,
      }));
      res.status(200).send(mappedFeed);
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await PostControllerModule.BaseDatabase.destroyConnection();
  };

  public getPostsByType = async (req: Request, res: Response) => {
    try {
      const feedDatabase = new PostControllerModule.FeedDatabase();
      const feed = await feedDatabase.getPostsByType(req.body.type);
      const mappedFeed = feed.map((item: any) => ({
        id: item.post_id,
        photo: item.post_photo,
        description: item.post_description,
        createdAt: dayjs(item.post_createdAt).format('DD/MM/YYYY'),
        type: item.post_type,
        userId: item.post_userId,
      }));
      res.status(200).send(mappedFeed);
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await PostControllerModule.BaseDatabase.destroyConnection();
  };

  public searchPost = async (req: Request, res: Response) => {
    try {
      const searchData: PostControllerModule.SearchPostDTO = {
        orderBy: (req.query.orderBy as string) || 'post_createdAt',
        orderType: (req.query.orderType as string) || 'ASC',
        page: Number(req.query.page) || 1,
      };

      const result = await new PostControllerModule.PostBusiness().searchPost(
        searchData,
      );

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  public like = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const postToLike = req.body.postToLike;

      const postBusiness = new PostControllerModule.PostBusiness();
      await postBusiness.like(token, postToLike);

      res.status(200).send({
        message: `Você deu "LIKE" no post de ID:${postToLike}`,
      });
    } catch (e) {
      if (e.sqlMessage.includes('ER_DUP_ENTRY')) {
        res.status(400).send({
          message: 'Você já curtiu esse post',
        });
      }
      res.status(400).send({
        message: e.message || e.sqlMessage,
      });
    }
    await PostControllerModule.BaseDatabase.destroyConnection();
  };

  public dislike = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const postToDislike = req.body.postToDislike;

      const postBusiness = new PostControllerModule.PostBusiness();
      await postBusiness.dislike(token, postToDislike);

      res.status(200).send({
        message: 'Você "deslaikeou" o post com sucesso',
      });
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await PostControllerModule.BaseDatabase.destroyConnection();
  };
}
