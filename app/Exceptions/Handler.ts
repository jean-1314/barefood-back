/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger';
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger);
  }

  public async handle (error: Error, ctx: HttpContextContract) {
    console.log(error);
    // if (error.code === 'E_VALIDATION_FAILURE') {
    //   return ctx.response.status(422).send(error.messages)
    // }
    return super.handle(error, ctx);
  }
}
