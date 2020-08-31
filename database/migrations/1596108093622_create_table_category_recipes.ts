import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateTableCategoryRecipes extends BaseSchema {
  protected tableName = 'category_recipe'

  public async up (): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('category_id');
      table.integer('recipe_id');
      table.foreign('category_id').references('id').inTable('categories');
      table.foreign('recipe_id').references('id').inTable('recipes');
    });
  }

  public async down (): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}
