import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { rules, schema, validator } from '@ioc:Adonis/Core/Validator';
import NotFoundException from 'App/Exceptions/NotFoundException';

export default class UsersController {
  public async show ({ params, auth }: HttpContextContract) {
    const paramsValidationSchema = schema.create({
      id: schema.number([
        rules.exists({
          table: 'users',
          column: 'id',
        }),
      ]),
    });

    const paramsData = {
      id: params.id,
    };

    try {
      await validator.validate({
        schema: paramsValidationSchema,
        data: paramsData,
      });
    } catch (e) {
      throw new NotFoundException(
        `Not found: ${e}`,
        404,
        'E_NOT_FOUND_EXCEPTION'
      );
    }

    const user = await User
      .query()
      .from('users')
      .select('id', 'name', 'email', 'avatar')
      .where('id', params.id)
      .first();

    const currentUser = await auth?.user;

    return currentUser?.id === user?.id
      ? user
      : { id: user?.id, name: user?.name, avatar: user?.avatar };
  }
}
