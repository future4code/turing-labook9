import { BaseDatabase } from './BaseDatabase';
import { User } from '../model/User';

export class UserDatabase extends BaseDatabase {
  private static TABLE_NAME: string = 'users_labook';

  public async registerUser(
    id: string,
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          name,
          email,
          password,
        })
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserByEmail(email: string): Promise<User> {
    try {
      const result = await this.getConnection()
        .select('*')
        .from(UserDatabase.TABLE_NAME)
        .where({ email });

      return User.convertToUserModel(result[0]);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getUserById(id: string): Promise<User> {
    const result = await this.getConnection()
      .select('id', 'name', 'email')
      .from(UserDatabase.TABLE_NAME)
      .where({ id });
    return result[0];
  }
}
