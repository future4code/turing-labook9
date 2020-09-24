import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { LikesBusiness } from '../business/LikesBusiness';

export default class LikesController {
  public like = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const postToLike = req.body.postToLike;

      const likesBusiness = new LikesBusiness();
      await likesBusiness.like(token, postToLike);

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

      const likesBusiness = new LikesBusiness();
      await likesBusiness.dislike(token, postToDislike);

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
