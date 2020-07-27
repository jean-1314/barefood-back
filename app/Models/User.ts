import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Recipe from 'App/Models/Recipe';
import Comment from 'App/Models/Comment';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public name: string

  @column()
  public avatar: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @hasMany(() => Recipe, { foreignKey: 'authorId'})
  public recipes: HasMany<typeof Recipe>

  @manyToMany(() => Recipe, {
    pivotTable: 'users_favorite_recipes',
  })
  public favoriteRecipes: ManyToMany<typeof Recipe>

  @manyToMany(() => Comment)
  public comments: ManyToMany<typeof Comment>
}
