import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Recipes extends BaseSchema {
  protected tableName = 'recipes'

  public async up (): Promise<void> {
    this.schema.table(this.tableName, (table) => {
      table.integer('author_id').notNullable();
      table.foreign('author_id').references('id').inTable('users');
    });
  }

  public async down (): Promise<void> {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['author_id']);
      table.dropColumn('author_id');
    });
  }
}
