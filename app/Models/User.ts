import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  BaseModel,
  column,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  beforeSave,
} from '@ioc:Adonis/Lucid/Orm';
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

  @column()
  public rememberMeToken : string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @hasMany(() => Recipe, { foreignKey: 'authorId' })
  public recipes: HasMany<typeof Recipe>

  @manyToMany(() => Recipe, {
    pivotTable: 'recipe_favorite_user',
  })
  public favoriteRecipes: ManyToMany<typeof Recipe>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
