import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Recipe from 'App/Models/Recipe';
import NotFoundException from 'App/Exceptions/NotFoundException';

const throwNotFound = () => {
  throw new NotFoundException(
    'Recipe not found',
    404,
    'E_NOT_FOUND_EXCEPTION'
  );
};

export default class FavoritesController {
  public async index ({ request, auth }: HttpContextContract) {
    const { page } = request.get();

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

  public async store ({ request, auth }: HttpContextContract) {
    const currentUser = auth.user;
    const { recipeId } = request.all();

    if (!recipeId) {
      throwNotFound();
    }

    await Database
      .rawQuery(`
        insert into recipe_favorite_user (recipe_id, user_id)
        values ( ?, ? )
        on conflict (recipe_id, user_id) do nothing`, [recipeId, currentUser?.id]);

    return { status: 'ok' };
  }

  public async destroy ({ params, auth }: HttpContextContract) {
    const currentUser = auth.user;
    const { id } = params;

    if (!id) {
      throwNotFound();
    }

    await Database
      .rawQuery(`
        delete from recipe_favorite_user
        where recipe_id = ${id}
        and user_id = ${currentUser?.id}`);

    return { status: 'ok' };
  }
}
