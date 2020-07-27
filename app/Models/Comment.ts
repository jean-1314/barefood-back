import { DateTime } from 'luxon'
import {BaseModel, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User';
import Recipe from 'App/Models/Recipe';

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uid: string

  @column()
  public text: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>

  @manyToMany(() => Recipe)
  public recipes: ManyToMany<typeof Recipe>
}
