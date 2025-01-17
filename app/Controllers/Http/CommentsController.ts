import sanitizeHtml from 'sanitize-html';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Comment from 'App/Models/Comment';
import CommentValidator from 'App/Validators/CommentValidator';
import { ResultComment } from 'Contracts/Controllers/CommentsControllerContracts';
import { ResultUser } from 'Contracts/Controllers/UsersControllerContracts';
import { ReturnedStatus } from 'Contracts/Controllers/Shared';
import ForbiddenException from 'App/Exceptions/ForbiddenException';
import validateQueryParams from 'App/Validators/utils/validateQueryParams';

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
        name: userData.name,
        avatar: userData.avatar,
      };

      const resultComment: ResultComment = {
        id: comment.id,
        text: comment.text,
        updated_at: comment.updatedAt,
        parent_text: comment.$extras.parent_text,
      };

      return { ...resultComment, user: resultUser };
    });

    return { data: result, meta };
  }

  public async store ({ request, params, auth }: HttpContextContract): Promise<ReturnedStatus> {
    const paramsArray = [{ name: 'recipeId', table: 'recipes', column: 'id' }];

    const paramsData = {
      recipeId: params.recipe_id,
    };

    await validateQueryParams(paramsArray, paramsData);

    const commentDetails = await request.validate(CommentValidator);

    const comment = new Comment();
    comment.text = sanitizeHtml(commentDetails.text);
    comment.parentId = request.input('parent_id') || null;
    comment.recipeId = paramsData.recipeId;
    comment.userId = auth.user?.id || 1;

    await comment.save();

    return { status: 'ok' };
  }

  public async update ({ request, params, auth }: HttpContextContract): Promise<ReturnedStatus> {
    const paramsArray = [
      { name: 'recipeId', table: 'recipes', column: 'id' },
      { name: 'id', table: 'comments', column: 'id' },
    ];

    const paramsData = {
      recipeId: params.recipe_id,
      id: params.id,
    };

    await validateQueryParams(paramsArray, paramsData);

    const commentDetails = await request.validate(CommentValidator);
    const comment = await Comment.findOrFail(paramsData.id);
    const currentUser = await auth.authenticate();

    if (currentUser.id !== comment.userId) {
      throw new ForbiddenException(
        'Not allowed',
        403,
        'E_FORBIDDEN_EXCEPTION'
      );
    }

    comment.text = sanitizeHtml(commentDetails.text);
    await comment.save();

    return { status: 'ok' };
  }
}
