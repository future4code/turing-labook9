import { BaseDatabase } from './BaseDatabase';

export class FeedDatabase extends BaseDatabase {
  public async getFeed(userId: string): Promise<any> {
    const result = await this.getConnection().raw(`
      SELECT posts.post_id, post_photo, post_description, post_createdAt, post_type, post_userId
      FROM posts
      JOIN users_relation
      ON users_relation.user_to_follow_id = posts.post_userId 
      AND users_relation.follower_id = '${userId}'
      JOIN users_labook
      ON posts.post_userId = users_labook.id
      ORDER BY post_createdAt ASC
      ;
    `);
    return result[0];
  }

  public async getPostsByType(postType: string): Promise<any> {
    const result = await this.getConnection().raw(`
      SELECT posts.post_id, post_photo, post_description, post_createdAt, post_type, post_userId
      FROM posts
      WHERE posts.post_type = '${postType}'
      ORDER BY post_createdAt DESC;
    `);
    return result[0];
  }
}
