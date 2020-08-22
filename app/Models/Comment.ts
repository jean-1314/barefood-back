import { DateTime } from 'luxon';
import { BaseModel, belongsTo, column, ManyToMany, manyToMany, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import Recipe from 'App/Models/Recipe';

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public text: string

  @column()
  public parentId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Recipe)
  public recipes: ManyToMany<typeof Recipe>
}
