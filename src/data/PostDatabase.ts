import { BaseDatabase } from './BaseDatabase';
import { Post } from '../model/Post';

export class PostDatabase extends BaseDatabase {
  private static TABLE_NAME = 'posts';

  public async createPost(
    PostId: string,
    photo: string,
    description: string,
    createdAt: string,
    type: string,
    userId: string,
  ): Promise<void> {
    await this.getConnection()
      .insert({
        post_id: PostId,
        post_photo: photo,
        post_description: description,
        post_createdAt: createdAt,
        post_type: type,
        post_userId: userId,
      })
      .into(PostDatabase.TABLE_NAME);
  }

  public async getPostsByType(postType: string): Promise<any> {
    const result = await this.getConnection()
      .select('*')
      .from(PostDatabase.TABLE_NAME)
      .where({ post_type: postType });
    return Post.toPostModel(result[0]);
  }
}
