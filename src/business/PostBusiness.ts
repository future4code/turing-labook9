import { LikesDatabase } from '../data/LikesDatabase';
import { PostDatabase } from '../data/PostDatabase';
import { SearchPostDTO } from '../model/Post';
import { Authenticator } from '../services/Authenticator';

export class PostBusiness {
  public async searchPost(searchData: SearchPostDTO) {
    const validOrderByValues = ['post_createdAt'];
    const validOrderTypeValues = ['ASC', 'DESC'];

    if (!validOrderByValues.includes(searchData.orderBy)) {
      throw new Error('Valor para "orderBy" deve ser "createdAt"');
    }

    if (!validOrderTypeValues.includes(searchData.orderType)) {
      throw new Error('Valores para "orderType" devem ser "ASC" ou "DESC"');
    }

    if (searchData.page < 0) {
      throw new Error('Número da página deve ser maior que zero');
    }

    const result = await new PostDatabase().searchPost(searchData);

    if (!result.length) {
      throw new Error('Nenhum post encontrada');
    }

    return result;
  }
  public async like(token: string, postToLike: string) {
    const authenticator = new Authenticator();
    const authenticationData = authenticator.verify(token);
    const userId = authenticationData.id;

    if (!postToLike) {
      throw new Error('Insira um id válido');
    }

    const postDataBase = new PostDatabase();
    const post = await postDataBase.getPostById(postToLike);

    if (!post) {
      throw new Error('Post não existe');
    }

    const likesDatabase = new LikesDatabase();
    await likesDatabase.like(userId, postToLike);
  }

  public async dislike(token: string, postToDislike: string) {
    const authenticator = new Authenticator();
    const authenticationData = authenticator.verify(token);
    const userId = authenticationData.id;

    if (!postToDislike) {
      throw new Error('Insira um id válido');
    }

    const checkFollow = await new LikesDatabase().checkLike(
      userId,
      postToDislike,
    );
    if (!checkFollow) {
      throw new Error('Você não está seguindo esta pessoa.');
    }

    const likesDatabase = new LikesDatabase();
    await likesDatabase.dislike(userId, postToDislike);
  }
}
