import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import UserFactory from '../factories/UserFactory';

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true;

  public async run () {
    await UserFactory
      .with('recipes', 2,
        (recipe) =>{
          recipe.with('categories', 1);
          recipe.with('userFavorites', 2);
          recipe.with('comments', 2);
        }
      )
      .with('comments', 3)
      .createMany(3)
  }
}
