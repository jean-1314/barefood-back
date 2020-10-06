import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Comment from 'App/Models/Comment';
import { ResultComment, ResultUser } from 'Contracts/Controllers/CommentsControllerContracts';

export default class CommentsController {
  public async index ({ request, params }: HttpContextContract) {
    const { page } = request.get();

    const comments = await Comment
      .query()
      .from('comments')
      .select([
        'comments.id',
        'uid',
        'text',
        'comments.parent_id',
        'created_at',
        'updated_at',
        'deleted_at',
        'user_id',
        'recipe_id',
        'p.parent_text',
      ])
      .joinRaw(`
        left join (
          select c2.id, c3.text as parent_text
          from comments as c2
          left join comments as c3 on c2.parent_id = c3.id
          where c2.parent_id is not null
        ) as p on p.id = comments.id
      `)
      .where('comments.recipe_id', params.recipe_id)
      .preload('user')
      .orderBy('updated_at', 'desc')
      .paginate(page || 1, 20);

    const serial = comments.toJSON();
    const { data, meta } = serial;

    const result = data.map((comment) => {
      const { user } = comment;
      const userData = user.toObject();

      const resultUser: ResultUser = {
        id: userData.id,
        uid: userData.uid,
        name: userData.name,
        avatar: userData.avatar,
      };

      const resultComment: ResultComment = {
        id: comment.id,
        uid: comment.uid,
        text: comment.text,
        updated_at: comment.updatedAt,
        parent_text: comment.$extras.parent_text,
      };

      return { ...resultComment, user: resultUser };
    });

    return { data: result, meta };
  }
}
