import { v4 as uuidv4 } from 'uuid';
import sanitizeHtml from 'sanitize-html';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Comment from 'App/Models/Comment';
import NotFoundException from 'App/Exceptions/NotFoundException';
import { ResultComment, ResultUser } from 'Contracts/Controllers/CommentsControllerContracts';
import { ReturnedStatus } from 'Contracts/Controllers/Shared';

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

  public async store ({ request, params, auth }: HttpContextContract): Promise<ReturnedStatus> {
    if (!params.recipe_id) {
      throw new NotFoundException(
        'Recipe not found',
        404,
        'E_NOT_FOUND_EXCEPTION'
      );
    }

    const validationSchema = schema.create({
      text: schema.string({ trim: true }, [
        rules.required(),
        rules.maxLength(500),
        rules.minLength(1),
      ]),
    });

    const commentDetails = await request.validate({
      schema: validationSchema,
      messages: {
        'text.required': 'Comment not entered',
        'text.maxLength': 'Comment exceeds maximum length of 500 characters',
        'text.minLength': 'Comment is below minimum length of 1 character',
      },
    });

    const comment = new Comment();
    comment.uid = uuidv4();
    comment.text = sanitizeHtml(commentDetails.text);
    comment.parentId = request.input('parent_id') || null;
    comment.recipeId = params.recipe_id;
    comment.userId = auth.user?.id || 1;

    await comment.save();

    return { status: 'ok' };
  }
}
