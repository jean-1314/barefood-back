import sanitizeHtml from 'sanitize-html';
import Application from '@ioc:Adonis/Core/Application';
import { slugify } from '../../../utils/string';

export default async (recipe, recipeData) => {
  recipe.name = recipeData.name;
  recipe.slug = slugify(recipeData.name);
  recipe.steps = recipeData.steps.map(step => sanitizeHtml(step));
  recipe.ingredients = recipeData.ingredients.map(ingredient => sanitizeHtml(ingredient));
  recipe.info = recipeData.info;
  recipe.isHidden = recipeData.isHidden;

  if (recipeData.image) {
    const name = `${new Date().getTime()}-${recipe.slug}.${recipeData.image.extname}`;
    await recipeData.image.move(Application.publicPath('storage/recipe_images'), { name });
    recipe.image = `/storage/recipe_images/${name}`;
  }
};
