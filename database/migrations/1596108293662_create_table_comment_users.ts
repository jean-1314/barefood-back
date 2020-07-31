import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CommentUsers extends BaseSchema {
  protected tableName = 'comment_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('comment_id');
      table.integer('user_id');
      table.timestamps();
      table.dateTime('deleted_at');
      table.foreign('comment_id').references('id').inTable('comments');
      table.foreign('user_id').references('id').inTable('users');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
