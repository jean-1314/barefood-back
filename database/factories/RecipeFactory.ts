import Factory from '@ioc:Adonis/Lucid/Factory';
import Recipe from 'App/Models/Recipe';
import UserFactory from 'Database/factories/UserFactory';
import CategoryFactory from 'Database/factories/CategoryFactory';
import CommentFactory from 'Database/factories/CommentFactory';
import { getRandomInt } from '../../utils/math';
import { slugify } from '../../utils/string';

export default Factory
  .define(Recipe, ({ faker }) => {
    const fakeName = faker.lorem.words(getRandomInt(1, 20));

    return {
      uid: faker.random.uuid(),
      name: fakeName,
      slug: slugify(fakeName),
      image: faker.image.food(),
      ingredients: [
        faker.lorem.words(getRandomInt(5, 20)),
        faker.lorem.words(getRandomInt(5, 20)),
        faker.lorem.words(getRandomInt(5, 20)),
      ],
      steps: Array(getRandomInt(1, 10)).fill(faker.lorem.paragraph(3)),
      info: {
        portions: getRandomInt(1, 8),
        time: getRandomInt(5, 24),
      },
      is_hidden: faker.random.boolean(),
    };
  })
  .relation('user', () => UserFactory)
  .relation('userFavorites', () => UserFactory)
  .relation('categories', () => CategoryFactory)
  .relation('comments', () => CommentFactory)
  .build();
