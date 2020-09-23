import { IdGenerator } from '../services/IdGenerator';
import { HashManager } from '../services/HashManager';
import { UserDatabase } from '../data/UserDatabase';
import { Authenticator } from '../services/Authenticator';
import { SignupInputDTO } from '../model/User';

export class UserBusiness {
  public async signUp(input: SignupInputDTO): Promise<string> {
    if (!input.name || !input.email || !input.password) {
      throw new Error(
        'Insira todas as informações necessárias para o cadastro',
      );
    }

    if (input.password.length < 6) {
      throw new Error('A senha deve conter no mínimo seis caracteres');
    }
    const idGenerator = new IdGenerator();
    const id = idGenerator.generateId();

    const hashManager = new HashManager();
    const hashPassword = await hashManager.hash(input.password);

    const userDataBase = new UserDatabase();
    await userDataBase.registerUser(id, input.name, input.email, hashPassword);

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({ id });

    return token;
  }

  public async login(email: string, password: string): Promise<string> {
    const userDataBase = new UserDatabase();
    const user = await userDataBase.getUserByEmail(email);

    const hashManager = new HashManager();
    const isPasswordCorrect = await hashManager.compare(
      password,
      user.getPassword(),
    );

    if (!isPasswordCorrect) {
      throw new Error('Usuário ou senha errados');
    }

    const authenticator = new Authenticator();
    const token = authenticator.generateToken({
      id: user.getId(),
    });

    return token;
  }
}
