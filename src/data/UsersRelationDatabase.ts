import { User } from '../model/User';
import { BaseDatabase } from './BaseDatabase';

export class UsersRelationDatabase extends BaseDatabase {
  private static TABLE_NAME = 'users_relation';

  public async followUser(
    userId: string,
    userToFollowId: string,
  ): Promise<void> {
    await this.getConnection()
      .insert([
        {
          follower_id: userId,
          user_to_follow_id: userToFollowId,
        },
        {
          follower_id: userToFollowId,
          user_to_follow_id: userId,
        },
      ])
      .into(UsersRelationDatabase.TABLE_NAME);
  }
  public async unFollowUser(
    userId: string,
    userToUnFollowId: string,
  ): Promise<void> {
    await this.getConnection()
      .del()
      .from(UsersRelationDatabase.TABLE_NAME)
      .where({
        follower_id: userId,
        user_to_follow_id: userToUnFollowId,
      })
      .or.where({
        follower_id: userToUnFollowId,
        user_to_follow_id: userId,
      });
  }

  public async checkFollow(
    follower_id: string,
    userToUnfollowId: string,
  ): Promise<User> {
    const result = await this.getConnection()
      .select('*')
      .from(UsersRelationDatabase.TABLE_NAME)
      .where({
        follower_id,
        user_to_follow_id: userToUnfollowId,
      });
    return result[0];
  }
}
