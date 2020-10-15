import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Application from '@ioc:Adonis/Core/Application';
import User from 'App/Models/User';
import validateQueryParams from 'App/Validators/utils/validateQueryParams';
import UserValidator from 'App/Validators/UserValidator';
import ForbiddenException from 'App/Exceptions/ForbiddenException';
import { ReturnedStatus } from 'Contracts/Controllers/Shared';
import { latinize } from '../../../utils/string';

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

  public async update ({ request, params, auth }: HttpContextContract): Promise<ReturnedStatus> {
    const paramsArray = [{ name: 'id', table: 'users', column: 'id' }];

    const paramsData = {
      id: params.id,
    };

    await validateQueryParams(paramsArray, paramsData);

    const userData = await request.validate(UserValidator);
    const user = await User.findOrFail(paramsData.id);
    const currentUser = await auth.user;

    if (currentUser?.id !== user.id) {
      throw new ForbiddenException(
        'Not allowed',
        403,
        'E_FORBIDDEN_EXCEPTION'
      );
    }

    if (userData.name) {
      user.name = userData.name;
    }

    if (userData.avatar) {
      const name = `${new Date().getTime()}-${latinize(user.name)}.${userData.avatar.extname}`;
      await userData.avatar.move(Application.publicPath('storage/avatars'), { name });
      user.avatar = `/storage/avatars/${name}`;
    }

    await user.save();

    return { status: 'ok' };
  }
}
