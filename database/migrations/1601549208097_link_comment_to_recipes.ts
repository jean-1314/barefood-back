import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class LinkCommentToRecipes extends BaseSchema {
  protected tableName = 'comments';

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.integer('recipe_id').notNullable();
      table.foreign('recipe_id').references('id').inTable('recipes');
    });
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['recipe_id']);
      table.dropColumn('recipe_id');
    });
  }
}
