import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Categories extends BaseSchema {
  protected tableName = 'categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uid').unique().notNullable()
      table.string('name').notNullable()
      table.timestamps(true)
      table.dateTime('deleted_at')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
