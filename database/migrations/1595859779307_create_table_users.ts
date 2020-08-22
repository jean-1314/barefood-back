import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('name').notNullable();
      table.string('avatar');
      table.string('remember_me_token').nullable();
      table.timestamps(true);
      table.dateTime('deleted_at');
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
