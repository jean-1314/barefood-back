import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import validateQueryParams from 'App/Validators/utils/validateQueryParams';

export default class UsersController {
  public async show ({ params, auth }: HttpContextContract) {
    const paramsArray = [{ name: 'id', table: 'users', column: 'id' }];

    const paramsData = {
      id: params.id,
    };

    await validateQueryParams(paramsArray, paramsData);

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
