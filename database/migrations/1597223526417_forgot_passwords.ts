import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ForgotPasswords extends BaseSchema {
  protected tableName = 'forgot_password'

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id').unique();
      table.string('token');
      table.timestamp('expiration').notNullable();
      table.boolean('used').notNullable();
      table.timestamps(true, true);
      table.foreign('user_id').references('id').inTable('users');
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
