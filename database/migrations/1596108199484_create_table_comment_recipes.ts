import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CommentRecipes extends BaseSchema {
  protected tableName = 'comment_recipe'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('comment_id');
      table.integer('recipe_id');
      table.timestamps(true);
      table.dateTime('deleted_at');
      table.foreign('comment_id').references('id').inTable('comments');
      table.foreign('recipe_id').references('id').inTable('recipes');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
