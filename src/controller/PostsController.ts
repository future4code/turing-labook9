import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { IdGenerator } from '../services/IdGenerator';
import { PostDatabase } from '../data/PostDatabase';
import { FeedDatabase } from '../data/FeedDatabase';
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
}
