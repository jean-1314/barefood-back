import Factory from '@ioc:Adonis/Lucid/Factory';
import Category from 'App/Models/Category';
import RecipeFactory from 'Database/factories/RecipeFactory';

export default Factory
  .define(Category, ({ faker }) => {
    return {
      name: faker.lorem.word(),
    };
  })
  .relation('recipes', () => RecipeFactory)
  .build();
