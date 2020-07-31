import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Recipes extends BaseSchema {
  protected tableName = 'recipes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uid').unique().notNullable()
      table.string('name').notNullable()
      table.string('image')
      table.json('ingredients')
      table.specificType('steps', 'text[]').notNullable()
      table.json('info')
      table.boolean('is_hidden')
      table.timestamps(true)
      table.dateTime('deleted_at')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
