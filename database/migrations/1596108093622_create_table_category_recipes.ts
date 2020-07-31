import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreateTableCategoryRecipes extends BaseSchema {
  protected tableName = 'category_recipe'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('category_id');
      table.integer('recipe_id');
      table.timestamps(true);
      table.dateTime('deleted_at');
      table.foreign('category_id').references('id').inTable('categories');
      table.foreign('recipe_id').references('id').inTable('recipes');
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
