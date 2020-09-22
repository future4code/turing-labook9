import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { IdGenerator } from '../services/IdGenerator';
import { PostDatabase } from '../data/PostDatabase';
import dayjs from 'dayjs';

export const createPost = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization as string;
    const authenticator = new Authenticator();
    const authenticationData = authenticator.verify(token);
    const userId = authenticationData.id;

    const idGenerator = new IdGenerator();
    const PostId = idGenerator.generateId();

    const createdAt = dayjs(req.body.description.date).format('YYYY-MM-DD');

    const postData = {
      photo: req.body.photo,
      description: req.body.description,
      type: req.body.description.type,
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
