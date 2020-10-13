import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Database from '@ioc:Adonis/Lucid/Database';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Mail from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
import SignupValidator from 'App/Validators/Auth/SignupValidator';
import ForgotPasswordValidator from 'App/Validators/Auth/ForgotPasswordValidator';
import ResetPasswordValidator from 'App/Validators/Auth/ResetPasswordValidator';
import UnprocessableEntityException from 'App/Exceptions/UnprocessableEntityException';
import { ReturnedUser } from 'Contracts/Controllers/AuthControllerContracts';
import { ReturnedStatus } from 'Contracts/Controllers/Shared';

export default class AuthController {
  public async signup ({ request }: HttpContextContract): Promise<ReturnedStatus> {
    const userDetails = await request.validate(SignupValidator);

    const user = new User();
    user.email = userDetails.email;
    user.password = userDetails.password;
    user.name = userDetails.name;
    user.uid = uuidv4();
    await user.save();
    await Mail.send((message) => {
      message
        .from('info@example.com')
        .to(user.email)
        .subject('Welcome Onboard!')
        .text(`Welcome onboard, ${user.name}!`);
    });

    return { status: 'ok' };
  }

  public async login ({ auth, request }: HttpContextContract): Promise<string> {
    const email = request.input('email');
    const password = request.input('password');
    const rememberUser = !request.input('remember_me');
    let message = '';
    try {
      await auth.attempt(email, password, rememberUser);
      message = 'login successful';
    } catch (e) {
      message = e.message.includes('E_INVALID_AUTH')
        ? 'Invalid e-mail or password'
        : e.message || e;
    }
    return message;
  }

  public async logout ({ auth }: HttpContextContract): Promise<string> {
    let message = '';
    try {
      await auth.logout();
      message = 'logout successful';
    } catch (e) {
      message = e.message || e;
    }
    return message;
  }

  public async forgot ({ request }: HttpContextContract): Promise<ReturnedStatus> {
    const userDetails = await request.validate(ForgotPasswordValidator);

    const user = await Database
      .from('users')
      .select('*')
      .where('email', userDetails.email)
      .first();

    if (user) {
      const token = await crypto.randomBytes(64).toString('base64');
      const url = `${Env.get('FRONTEND_URL')}/reset?token=${token}`;
      const date = new Date();
      const expireDate = await date.setHours(date.getHours() + 1);

      try {
        await Database.rawQuery(
          `insert into forgot_password ( user_id, token, expiration, used )
          values ( ?, ?, ?, ? )
          on conflict ( user_id ) do update
          set token = ?, expiration = ?, used = ?, updated_at = ?`,
          [user.id, token, new Date(expireDate), false, token, new Date(expireDate), false, new Date()]);

        await Mail.send((message) => {
          message
            .from('info@example.com')
            .to(user.email)
            .subject('Password reset token')
            .html(`<p>Please open the link: <a href="${url}">${url}</a></p>`);
        });
      } catch (err) {
        return err;
      }
      return { status: 'ok' };
    } else {
      // If user is not found, still returning ok status to prevent bots from fiddling with e-mails
      return { status: 'ok' };
    }
  }

  public async reset ({ auth, request }: HttpContextContract): Promise<ReturnedStatus> {
    const passwordDetails = await request.validate(ResetPasswordValidator);

    const passwordOne = passwordDetails.passwordOne;
    const passwordTwo = passwordDetails.passwordTwo;
    const token = passwordDetails.token;

    if (passwordOne !== passwordTwo) {
      throw new UnprocessableEntityException('Passwords do not match', 422, 'E_UNPROCESSABLE_ENTITY_EXCEPTION');
    }

    const userToken = await Database
      .from('forgot_password')
      .select('*')
      .where('token', token)
      .first();

    if (!userToken) {
      throw new UnprocessableEntityException(
        'Token does not exist or expired',
        422,
        'E_UNPROCESSABLE_ENTITY_EXCEPTION'
      );
    }

    if ((new Date(userToken.expiration) < new Date()) || userToken.used) {
      throw new UnprocessableEntityException(
        'Token does not exist or expired',
        422,
        'E_UNPROCESSABLE_ENTITY_EXCEPTION'
      );
    }

    await Database
      .from('forgot_password')
      .update({
        used: true,
      })
      .where('user_id', userToken.user_id);

    const user = await User.findByOrFail('id', userToken.user_id);
    user.password = passwordOne;
    await user.save();
    await auth.logout();
    return { status: 'ok' };
  }

  public async me ({ auth }: HttpContextContract): Promise<ReturnedUser> {
    const user = await auth.authenticate();
    const { uid, email, name, avatar } = user;
    return { uid, email, name, avatar };
  }
}
