import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class LinkCommentToUsers extends BaseSchema {
  protected tableName = 'comments'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('user_id').notNullable();
      table.foreign('user_id').references('id').inTable('users');
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['user_id']);
      table.dropColumn('user_id');
    })
  }
}
