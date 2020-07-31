import Factory from '@ioc:Adonis/Lucid/Factory';
import Comment from 'App/Models/Comment'
import RecipeFactory from 'Database/factories/RecipeFactory';
import UserFactory from 'Database/factories/UserFactory';

export default Factory
  .define(Comment, ({ faker }) => {
    return {
      uid: faker.random.uuid(),
      text: faker.lorem.text(),
    }
  })
  .relation('recipes', () => RecipeFactory)
  .relation('users', () => UserFactory)
  .build();
