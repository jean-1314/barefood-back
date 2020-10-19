import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Recipe from 'App/Models/Recipe';
import NotFoundException from 'App/Exceptions/NotFoundException';

export default class FavoritesController {
  public async index ({ request, auth }: HttpContextContract) {
    const { page } = request.get();

    const throwNotFound = () => {
      throw new NotFoundException(
        'Recipe not found',
        404,
        'E_NOT_FOUND_EXCEPTION'
      );
    };

    const user = auth.user || throwNotFound();

    return await Recipe
      .query()
      .from('recipes')
      .select(['recipes.id', 'name', 'image', 'slug', 'is_hidden', 'author_id', 'f.recipe_id', 'f.user_id'])
      .joinRaw('left join recipe_favorite_user f on recipes.id = f.recipe_id')
      .where('user_id', user.id)
      .orderBy('recipes.updated_at', 'desc')
      .paginate(page || 1, 20);
  }
}
