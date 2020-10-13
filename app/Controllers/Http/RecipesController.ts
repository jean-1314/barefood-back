import { v4 as uuidv4 } from 'uuid';
import sanitizeHtml from 'sanitize-html';
import Application from '@ioc:Adonis/Core/Application';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Recipe from 'App/Models/Recipe';
import NotFoundException from 'App/Exceptions/NotFoundException';
import RecipeValidator from 'App/Validators/RecipeValidator';
import { ReturnedStatus } from 'Contracts/Controllers/Shared';
import { slugify } from '../../../utils/string';

export default class RecipesController {
  public async index ({ request }: HttpContextContract) {
    const { page, filter, sort } = request.get();

    let direction: 'asc' | 'desc' | undefined;
    let sortBy: 'favorites' | 'updated_at';

    if (sort) {
      direction = sort.startsWith('-') ? 'desc' : 'asc';
      sortBy = sort.startsWith('-') ? sort.slice(1) : sort;
    } else {
      sortBy = 'updated_at';
    }

    return await Recipe
      .query()
      .from('recipes')
      .select(['recipes.id', 'uid', 'name', 'slug', 'image'])
      .join('category_recipe', 'recipes.id', 'category_recipe.recipe_id')
      .where((builder) => {
        if (filter) {
          builder.where('category_recipe.category_id', '=', filter);
        }
        if (sortBy === 'favorites') {
          builder.joinRaw(`left join (
            select recipe_id, count(recipe_id) as cnt from recipe_favorite_user
            group by recipe_id
          ) as f on r.id = f.recipe_id`);
        }
      })
      .andWhere('is_hidden', false)
      .orderBy(sortBy === 'favorites' ? 'updated_at' : sortBy, direction || 'desc')
      .preload('categories')
      .paginate(page, 20);
  }

  public async show ({ params, auth }: HttpContextContract) {
    let isAuthor = false;
    const isAuthenticated = auth.isAuthenticated;

    const recipe = await Recipe
      .query()
      .from('recipes')
      .select('id', 'uid', 'name', 'slug', 'image', 'ingredients', 'steps', 'info', 'is_hidden', 'author_id')
      .where('id', params.id)
      .first();

    if (isAuthenticated) {
      const currentUser = await auth.authenticate();
      isAuthor = currentUser.id === recipe?.authorId;
    }

    if (!recipe || !params.id || (recipe?.isHidden && !isAuthor)) {
      throw new NotFoundException(
        'Recipe not found',
        404,
        'E_NOT_FOUND_EXCEPTION'
      );
    }

    await recipe?.preload('categories');
    await recipe?.preload('user');

    const { uid, name, slug, image, ingredients, steps, info, isHidden, user, categories } = recipe;
    return {
      uid,
      name,
      slug,
      image,
      ingredients,
      steps,
      info,
      isHidden,
      categories,
      user: { uid: user.uid, name: user.name, avatar: user.avatar },
    };
  }

  public async search ({ request }: HttpContextContract) {
    const { q } = request.get();
    return Recipe.query()
      .select(['uid', 'name', 'slug', 'image'])
      .from('recipes')
      .whereRaw('to_tsvector(name) @@ plainto_tsquery(?)', [`${q}%`])
      .andWhere('is_hidden', false)
      .limit(5);
  }

  public async store ({ request, auth }: HttpContextContract): Promise<ReturnedStatus> {
    const recipeData = await request.validate(RecipeValidator);

    const recipe = new Recipe();

    recipe.uid = uuidv4();
    recipe.name = recipeData.name;
    recipe.slug = slugify(recipeData.name);
    recipe.steps = recipeData.steps.map(step => sanitizeHtml(step));
    recipe.ingredients = recipeData.ingredients.map(ingredient => sanitizeHtml(ingredient));
    recipe.info = recipeData.info;
    recipe.isHidden = recipeData.isHidden;
    recipe.authorId = auth.user?.id || 1;

    if (recipeData.image) {
      const name = `${new Date().getTime()}-${recipe.slug}.${recipeData.image.extname}`;
      await recipeData.image.move(Application.publicPath('storage/recipe_images'), { name });
      recipe.image = `/storage/recipe_images/${name}`;
    }

    await recipe.save();

    recipeData.categories.forEach((category) => {
      recipe.related('categories').attach([category]);
    });

    return { status: 'ok' };
  }
}
