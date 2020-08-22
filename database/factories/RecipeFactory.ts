import Factory from '@ioc:Adonis/Lucid/Factory';
import Recipe from 'App/Models/Recipe';
import UserFactory from 'Database/factories/UserFactory';
import CategoryFactory from 'Database/factories/CategoryFactory';
import CommentFactory from 'Database/factories/CommentFactory';
import { getRandomInt } from '../../utils/math';

export default Factory
  .define(Recipe, ({ faker }) => {
    return {
      uid: faker.random.uuid(),
      name: faker.lorem.words(getRandomInt(1, 20)),
      image: faker.image.food(),
      ingredients: JSON.stringify({
        [faker.lorem.word()]: faker.lorem.words(getRandomInt(1, 5)),
        [faker.lorem.word()]: faker.lorem.words(getRandomInt(1, 5)),
        [faker.lorem.word()]: faker.lorem.words(getRandomInt(1, 5)),
      }),
      steps: Array(getRandomInt(1, 10)).fill(faker.lorem.paragraph(3)),
      info: JSON.stringify({
        portions: getRandomInt(1, 8),
        time: getRandomInt(5, 24),
      }),
      is_hidden: faker.random.boolean(),
    };
  })
  .relation('user', () => UserFactory)
  .relation('userFavorites', () => UserFactory)
  .relation('categories', () => CategoryFactory)
  .relation('comments', () => CommentFactory)
  .build();
