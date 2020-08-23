import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import Comment from 'App/Models/Comment';
import Category from 'App/Models/Category';

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public image: string

  @column()
  public steps: string[]

  @column()
  public ingredients: string

  @column()
  public info: string

  @column()
  public isHidden: boolean

  @column()
  public authorId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'authorId',
  })
  public user: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'recipe_favorite_user',
  })
  public userFavorites: ManyToMany<typeof User>

  @manyToMany(() => Comment)
  public comments: ManyToMany<typeof Comment>

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>
}
