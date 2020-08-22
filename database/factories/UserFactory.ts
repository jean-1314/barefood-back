import Factory from '@ioc:Adonis/Lucid/Factory';
import User from 'App/Models/User';
import RecipeFactory from 'Database/factories/RecipeFactory';
import CommentFactory from 'Database/factories/CommentFactory';

export default Factory
  .define(User, ({ faker }) => {
    return {
      uid: faker.random.uuid(),
      email: `${faker.name.lastName().toLowerCase()}_${faker.internet.email()}`,
      password: faker.internet.password(),
      name: faker.name.findName(),
      avatar: faker.internet.avatar(),
      rememberMeToken: faker.random.uuid(),
    };
  })
  .relation('recipes', () => RecipeFactory)
  .relation('favoriteRecipes', () => RecipeFactory)
  .relation('comments', () => CommentFactory)
  .build();
