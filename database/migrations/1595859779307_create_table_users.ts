import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uid').unique().notNullable()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.string('name').notNullable()
      table.string('avatar')
      table.timestamps(true)
      table.dateTime('deleted_at')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
