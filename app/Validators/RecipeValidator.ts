import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class RecipeValidator {
  constructor (private ctx: HttpContextContract) {
  }

  /**
   * Defining a schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(255),
      rules.minLength(1),
    ]),
    image: schema.file.optional({
      size: '100kb',
      extnames: ['jpg', 'jpeg'],
    }),
    steps: schema.array([
      rules.required(),
      rules.minLength(1),
    ]).members(
      schema.string()
    ),
    ingredients: schema.array([
      rules.required(),
      rules.minLength(1),
    ]).members(
      schema.string()
    ),
    info: schema.object().members({
      portions: schema.number.optional(),
      time: schema.string.optional(),
    }),
    isHidden: schema.boolean([
      rules.required(),
    ]),
    categories: schema.array([
      rules.required(),
      rules.minLength(1),
    ]).members(
      schema.number()
    ),
  });

  /**
   * The `schema` first gets compiled to a reusable function and then that compiled
   * function validates the data at runtime.
   *
   * Since, compiling the schema is an expensive operation, you must always cache it by
   * defining a unique cache key. The simplest way is to use the current request route
   * key, which is a combination of the route pattern and HTTP method.
   */
  public cacheKey = this.ctx.routeKey;

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
  */
  public messages = {
    'name.required': 'Name not entered',
    'name.maxLength': 'Name exceeds maximum length of 255 characters',
    'name.minLength': 'Name is below minimum length of 1 character',
    'image.size': 'Image exceeds maximum size of 100kb',
    'image.extnames': 'Wrong image extname',
    'steps.required': 'Steps not entered',
    'steps.minLength': 'Steps length is below minimum length of 1 character',
    'ingredients.required': 'Ingredients not entered',
    'ingredients.minLength': 'Ingredients length is below minimum length of 1 character',
    'isHidden.required': 'isHidden not entered',
    'categories.required': 'Categories not entered',
    'categories.minLength': 'Categories length is below minimum length of 1 character',
  };
}
