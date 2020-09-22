import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { UserBusiness } from '../business/UserBusiness';
import { SignupInputDTO } from '../model/User';

export const signUp = async (req: Request, res: Response) => {
  try {
    const input: SignupInputDTO = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const userBusiness = new UserBusiness();
    const token = await userBusiness.signUp(input);

    res.status(200).send({
      message: `Usuário(a) ${req.body.name} logado(a) com sucesso`,
      token,
    });
  } catch (e) {
    res.status(400).send({
      message: e.message,
    });
  }
  await BaseDatabase.destroyConnection();
};
