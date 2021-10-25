import { IUserProjection } from '../../../models/users/user';
import { IPost } from '../../../models/posts/post';
import { ineffectuaDb } from '../../../utils/mongodb';

export interface IAddPost {
  body: string;
  inReplyTo?: IPost['_id'];
}

export type TAddPostResponse = IPost | string;

export async function addPost(
  _,
  _data: IAddPost,
  _context: { user: IUserProjection },
): Promise<TAddPostResponse> {
  const { user } = _context;
  if (user) {
    const { inReplyTo, body } = _data;
    const author: IPost['author'] = { _id: user._id };
    const db = await ineffectuaDb();
    const createdAt = new Date(Date.now());
    const data: Omit<IPost, '_id'> = {
      author,
      createdAt,
      inReplyTo,
      body,
    };
    try {
      const result = await db
        .collection<Omit<IPost, '_id'>>('posts')
        .insertOne(data);
      return { ...data, _id: result.insertedId.toString() };
    } catch (ex) {
      return ex;
    }
  }
  return 'Please authenticate before posting';
}
