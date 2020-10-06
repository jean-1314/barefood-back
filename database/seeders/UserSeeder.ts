import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import UserFactory from '../factories/UserFactory';

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run (): Promise<void> {
    await UserFactory
      .with('recipes', 2,
        (recipe) => {
          recipe.with('categories', 1);
          recipe.with('userFavorites', 2);
          recipe.with('comments', 2, (comment) => {
            comment.with('user', 1);
          });
        }
      )
      .createMany(3);
  }
}
