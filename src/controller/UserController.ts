import { Request, Response } from 'express';
import { BaseDatabase } from '../data/BaseDatabase';
import { Authenticator } from '../services/Authenticator';
import { UserBusiness } from '../business/UserBusiness';
import { SignupInputDTO } from '../model/User';
import { UsersRelationDatabase } from '../data/UsersRelationDatabase';
import { UserDatabase } from '../data/UserDatabase';

export default class UserController {
  public login = async (req: Request, res: Response) => {
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

  public signUp = async (req: Request, res: Response) => {
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

  public followUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const userToFollowId = req.body.userToFollowId;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      if (!userToFollowId) {
        throw new Error('Insira um id válido');
      }

      const userDataBase = new UserDatabase();
      const user = await userDataBase.getUserById(userToFollowId);

      if (!user) {
        throw new Error('Usuário não existe');
      }

      const usersRelationDatabase = new UsersRelationDatabase();
      await usersRelationDatabase.followUser(userId, userToFollowId);

      res.status(200).send({
        message: 'Usuário seguido com sucesso',
      });
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await BaseDatabase.destroyConnection();
  };

  public unFollowUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const userToUnFollowId = req.body.userToUnFollowId;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      if (!userToUnFollowId) {
        throw new Error('Insira um id válido');
      }

      const checkFollow = await new UsersRelationDatabase().checkFollow(
        userId,
        userToUnFollowId,
      );
      if (!checkFollow) {
        throw new Error('Você não está seguindo esta pessoa.');
      }

      const usersRelationDatabase = new UsersRelationDatabase();
      await usersRelationDatabase.unFollowUser(userId, userToUnFollowId);

      res.status(200).send({
        message: 'Você deixou de seguir o usuário com sucesso',
      });
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await BaseDatabase.destroyConnection();
  };
}
