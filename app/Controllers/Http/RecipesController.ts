import Database from '@ioc:Adonis/Lucid/Database';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class RecipesController {
  public async index ({ request }: HttpContextContract) {
    const { q } = request.get();
    if (q) {
      return Database.query()
        .select(['uid', 'name', 'slug', 'image'])
        .from('recipes')
        .whereRaw('name LIKE ?', [`%${q}%`])
        .andWhere('is_hidden', false)
        .limit(5);
    }
    return await Database.query().select('*').from('recipes').paginate(1, 20);
  }
}
