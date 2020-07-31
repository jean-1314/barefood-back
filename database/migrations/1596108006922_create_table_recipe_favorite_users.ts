import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateTableRecipeFavoriteUsers extends BaseSchema {
  protected tableName = 'recipe_favorite_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('user_id');
      table.integer('recipe_id');
      table.timestamps(true);
      table.dateTime('deleted_at');
      table.foreign('user_id').references('id').inTable('users');
      table.foreign('recipe_id').references('id').inTable('recipes');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
