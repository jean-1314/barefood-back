import Env from '@ioc:Adonis/Core/Env';

Env.rules({
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  NODE_ENV: Env.schema.string(),
  APP_KEY: Env.schema.string(),
  FRONTEND_URL: Env.schema.string(),

  DB_CONNECTION: Env.schema.string(),
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string(),
  DB_NAME: Env.schema.string(),

  SESSION_DRIVER: Env.schema.string(),

  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.number(),
  MAILTRAP_USER: Env.schema.string(),
  MAILTRAP_PASSWORD: Env.schema.string(),
});
