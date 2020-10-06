import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class Comments extends BaseSchema {
  protected tableName = 'comments'

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.uuid('uid').unique().notNullable();
      table.string('text', 1000).notNullable();
      table.integer('parent_id');
      table.timestamps(true);
      table.dateTime('deleted_at');
      table.index(['updated_at'], 'updated_at');
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
