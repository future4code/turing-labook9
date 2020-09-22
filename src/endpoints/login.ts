import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { UserBusiness } from '../business/UserBusiness';

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userBusiness = new UserBusiness();
    const token = await userBusiness.login(email, password);

    res.status(200).send({
      message: `Usuário(a) ${email} logado(a) com sucesso`,
      token,
    });
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  } finally {
    await BaseDatabase.destroyConnection();
  }
};
