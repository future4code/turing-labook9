import { PostDatabase } from '../data/PostDatabase';
import { SearchPostDTO } from '../model/Post';

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
}
