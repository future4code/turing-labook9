import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { IdGenerator } from '../services/IdGenerator';
import { PostDatabase } from '../data/PostDatabase';
import { FeedDatabase } from '../data/FeedDatabase';
import { SearchPostDTO } from '../model/Post';
import { PostBusiness } from '../business/PostBusiness';

import dayjs from 'dayjs';

export default class PostsController {
  public createPost = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const authenticator = new Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      const idGenerator = new IdGenerator();
      const PostId = idGenerator.generateId();

      const createdAt = dayjs(req.body.date).format('YYYY-MM-DD');

      const postData = {
        photo: req.body.photo,
        description: req.body.description,
        type: req.body.type,
      };

      const postDatabase = new PostDatabase();
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
    await BaseDatabase.destroyConnection();
  };

  public getFeed = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const authenticator = new Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      const feedDatabase = new FeedDatabase();
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
    await BaseDatabase.destroyConnection();
  };

  public getPostsByType = async (req: Request, res: Response) => {
    try {
      const feedDatabase = new FeedDatabase();
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
    await BaseDatabase.destroyConnection();
  };

  public searchPost = async (req: Request, res: Response) => {
    try {
      const searchData: SearchPostDTO = {
        orderBy: (req.query.orderBy as string) || 'post_createdAt',
        orderType: (req.query.orderType as string) || 'ASC',
        page: Number(req.query.page) || 1,
      };

      const result = await new PostBusiness().searchPost(searchData);

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  public like = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const postToLike = req.body.postToLike;

      const postBusiness = new PostBusiness();
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
    await BaseDatabase.destroyConnection();
  };

  public dislike = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const postToDislike = req.body.postToDislike;

      const postBusiness = new PostBusiness();
      await postBusiness.dislike(token, postToDislike);

      res.status(200).send({
        message: 'Você "deslaikeou" o post com sucesso',
      });
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await BaseDatabase.destroyConnection();
  };
}
