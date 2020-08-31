import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Recipe from 'App/Models/Recipe';

export default class RecipesController {
  public async index ({ request }: HttpContextContract) {
    const { page, filter, sort } = request.get();
    // eslint-disable-next-line init-declarations
    let direction: 'asc' | 'desc' | undefined;
    let sortBy = '';
    if (sort) {
      direction = sort.startsWith('-') ? 'desc' : 'asc';
      sortBy = sort.startsWith('-') ? sort.slice(1) : sort;
    }
    return await Recipe
      .query()
      .from('recipes')
      .select(['recipes.id', 'uid', 'name', 'slug', 'image'])
      .join('category_recipe', 'recipes.id', 'category_recipe.recipe_id')
      .where((builder) => {
        if (filter) {
          builder.where('category_recipe.recipe_id', '=', filter);
        }
      })
      .andWhere('is_hidden', false)
      .orderBy(sortBy || 'updated_at', direction || 'desc')
      .preload('categories')
      .paginate(page, 20);
  }

  public async search ({ request }: HttpContextContract) {
    const { q } = request.get();
    return Recipe.query()
      .select(['uid', 'name', 'slug', 'image'])
      .from('recipes')
      .whereRaw('name ILIKE ?', [`${q}%`])
      .andWhere('is_hidden', false)
      .limit(5);
  }
}
