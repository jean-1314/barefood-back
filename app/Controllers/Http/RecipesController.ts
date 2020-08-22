import Database from '@ioc:Adonis/Lucid/Database';

export default class RecipesController {
  public async index () {
    return await Database.query().select('*').from('recipes').paginate(1, 20);
  }
}
