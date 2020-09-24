import { BaseDatabase } from './BaseDatabase';

export class LikesDatabase extends BaseDatabase {
  private static TABLE_NAME = 'likes';

  public async like(userId: string, postToLikeId: string): Promise<void> {
    await this.getConnection()
      .insert({
        user_like_id: userId,
        post_to_like_id: postToLikeId,
      })
      .into(LikesDatabase.TABLE_NAME);
  }
  public async dislike(userId: string, postToDislikeId: string): Promise<void> {
    await this.getConnection().del().from(LikesDatabase.TABLE_NAME).where({
      user_like_id: userId,
      post_to_like_id: postToDislikeId,
    });
  }

  public async checkLike(
    userId: string,
    postToDislikeId: string,
  ): Promise<any> {
    const result = await this.getConnection()
      .select('*')
      .from(LikesDatabase.TABLE_NAME)
      .where({
        user_like_id: userId,
        post_to_like_id: postToDislikeId,
      });
    return result[0];
  }
}
