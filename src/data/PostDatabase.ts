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

  public async getRecipeById(recipeId: string): Promise<Post> {
    const result = await this.getConnection()
      .select('*')
      .from(PostDatabase.TABLE_NAME)
      .where({ recipe_id: recipeId });

    const myRecipe = new Post(
      result[0].recipe_id,
      result[0].title,
      result[0].description,
      result[0].user_id,
      result[0].createdAt,
    );

    return myRecipe;
  }
}
