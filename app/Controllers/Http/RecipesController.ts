// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';

export default class RecipesController {
  public async index() {
    const recipes = await Database.query().select('*').from('recipes').paginate(1, 20);
    return recipes;
  }
}
