import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Recipes extends BaseSchema {
  protected tableName = 'recipes'

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('slug').notNullable();
      table.string('image');
      table.specificType('ingredients', 'text[]').notNullable();
      table.specificType('steps', 'text[]').notNullable();
      table.json('info');
      table.boolean('is_hidden');
      table.timestamps(true);
      table.dateTime('deleted_at');
      table.index(['name'], 'name');
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
