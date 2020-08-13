import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';
import { v4 as uuidv4 } from 'uuid';
import Database from '@ioc:Adonis/Lucid/Database';
import crypto from 'crypto';

export default class AuthController {

  public async signup({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.required(),
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.required(),
        rules.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
      ]),
      name: schema.string({ trim: true }, [
        rules.required(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
      messages: {
        'name.required': 'User name required',
        'email.email': 'E-mail not valid',
        'email.unique': 'User already exists'
      }
    });

    const user = new User();
    user.email = userDetails.email;
    user.password = userDetails.password;
    user.name = userDetails.name;
    user.uid = uuidv4();
    await user.save()

    return user.serialize();
  }

  public async login({ auth, request }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');
    let message = '';
    try {
      await auth.attempt(email, password);
      message = 'login successful';
    } catch (e) {
      message = e.message.includes('E_INVALID_AUTH')
        ? 'Invalid e-mail or password'
        : e.message || e;
    } finally {
      return message;
    }
  }

  public async logout({ auth }: HttpContextContract): Promise<any> {
    let message = '';
    try {
      await auth.logout();
      message = 'logout successful';
    } catch (e) {
      message = e.message || e;
    } finally {
      return message;
    }
  }

  public async forgot({ request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.exists({ table: 'users', column: 'email' }),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
      messages: {
        'email.email': 'E-mail not valid',
        'email.exists': 'User does not exist'
      }
    });

    const user = await Database
      .from('users')
      .select('*')
      .where('email', userDetails.email)
      .first();

    const token = await crypto.randomBytes(64).toString('base64');

    const date = new Date();
    const expireDate = await date.setHours(date.getHours() + 1);

    try {
      await Database.rawQuery(
        `insert into forgot_password ( user_id, token, expiration, used )
          values ( ?, ?, ?, ? )
          on conflict ( user_id ) do update
          set token = ?, updated_at = ?`,
        [user.id, token, new Date(expireDate), false, token, new Date()]);
    } catch(err) {
      return err;
    } finally {
      return { status: 'ok' };
    }
  }

  public async reset({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      token: schema.string({ trim: true }, [
        rules.required(),
      ]),
      passwordOne: schema.string({ trim: true }, [
        rules.required(),
        rules.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
      ]),
      passwordTwo: schema.string({ trim: true }, [
        rules.required(),
        rules.regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
      ]),
    });

    const passwordDetails = await request.validate({
      schema: validationSchema
    });

    const passwordOne = passwordDetails.passwordOne;
    const passwordTwo = passwordDetails.passwordTwo;
    const token = passwordDetails.token;

    if (passwordOne !== passwordTwo) {
      response.unprocessableEntity({ message: 'Passwords do not match'});
      return;
    }

    const userToken = await Database
      .from('forgot_password')
      .select('*')
      .where('token', token)
      .first();

    if (!userToken) {
      response.unprocessableEntity({ message: 'Token does not exist or expired'});
      return;
    }

    if ((new Date(userToken.expiration) < new Date()) || userToken.used) {
      response.unprocessableEntity({ message: 'token does not exist or expired'});
      return;
    }

    await Database
      .from('forgot_password')
      .update({
        used: true
      })
      .where('user_id', userToken.user_id);

    const user = await User.findByOrFail('id', userToken.user_id);
    user.password = passwordOne;
    await user.save();

    return { status: 'ok' };
  }

  public async me({ auth }: HttpContextContract) {
    const user = await auth.authenticate();
    return user;
  }
}
