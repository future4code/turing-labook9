import { Request, Response } from 'express';
import * as UserControllerModule from '../modules/UserControllerModule';

export default class UserController {
  public login = async (req: Request, res: Response) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const userBusiness = new UserControllerModule.UserBusiness();
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
      await UserControllerModule.BaseDatabase.destroyConnection();
    }
  };

  public signUp = async (req: Request, res: Response) => {
    try {
      const input: UserControllerModule.SignupInputDTO = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      };

      const userBusiness = new UserControllerModule.UserBusiness();
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
    await UserControllerModule.BaseDatabase.destroyConnection();
  };

  public followUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const userToFollowId = req.body.userToFollowId;

      const authenticator = new UserControllerModule.Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      if (!userToFollowId) {
        throw new Error('Insira um id válido');
      }

      const userDataBase = new UserControllerModule.UserDatabase();
      const user = await userDataBase.getUserById(userToFollowId);

      if (!user) {
        throw new Error('Usuário não existe');
      }

      const usersRelationDatabase = new UserControllerModule.UsersRelationDatabase();
      await usersRelationDatabase.followUser(userId, userToFollowId);

      res.status(200).send({
        message: 'Usuário seguido com sucesso',
      });
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await UserControllerModule.BaseDatabase.destroyConnection();
  };

  public unFollowUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization as string;
      const userToUnFollowId = req.body.userToUnFollowId;

      const authenticator = new UserControllerModule.Authenticator();
      const authenticationData = authenticator.verify(token);
      const userId = authenticationData.id;

      if (!userToUnFollowId) {
        throw new Error('Insira um id válido');
      }

      const checkFollow = await new UserControllerModule.UsersRelationDatabase().checkFollow(
        userId,
        userToUnFollowId,
      );
      if (!checkFollow) {
        throw new Error('Você não está seguindo esta pessoa.');
      }

      const usersRelationDatabase = new UserControllerModule.UsersRelationDatabase();
      await usersRelationDatabase.unFollowUser(userId, userToUnFollowId);

      res.status(200).send({
        message: 'Você deixou de seguir o usuário com sucesso',
      });
    } catch (e) {
      res.status(400).send({
        message: e.message,
      });
    }
    await UserControllerModule.BaseDatabase.destroyConnection();
  };
}
