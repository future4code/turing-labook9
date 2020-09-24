import { BaseDatabase } from './BaseDatabase';
import { Post, SearchPostDTO } from '../model/Post';

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

  public async getPostById(id: string): Promise<Post> {
    const result = await this.getConnection()
      .select('post_id')
      .from(PostDatabase.TABLE_NAME)
      .where({ post_id: id });
    return result[0];
  }

  public async searchPost(searchData: SearchPostDTO): Promise<Post[]> {
    try {
      const resultsPerPage: number = 5;
      const offset: number = resultsPerPage * (searchData.page - 1);

      const result = await this.getConnection().raw(`
            SELECT * FROM ${PostDatabase.TABLE_NAME}  
            ORDER BY ${searchData.orderBy} ${searchData.orderType} 
            LIMIT ${resultsPerPage}
            OFFSET ${offset};  
        `);

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage);
    }
  }
}
