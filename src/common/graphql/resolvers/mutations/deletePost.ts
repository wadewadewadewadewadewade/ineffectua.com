import { IUserProjection } from '../../../models/users/user';
import { IPost } from '../../../models/posts/post';
import { ineffectuaDb } from '../../../utils/mongodb';
import { ObjectId } from 'mongodb';

export interface IDeletePost {
  _id: string;
}

export type TDeletePostResponse = true | string;

export async function deletePost(
  _,
  _data: IDeletePost,
  _context: { user: IUserProjection },
): Promise<TDeletePostResponse> {
  const { user } = _context;
  const { _id } = _data;
  if (user) {
    const db = await ineffectuaDb();
    const deletedAt = new Date(Date.now());
    try {
      const result = await db
        .collection<Omit<IPost, '_id'>>('posts')
        .updateOne(
          { _id: new ObjectId(_id), author: { _id: user._id } },
          { $set: { deletedAt } },
        );
      const originalPostDeleted = result.modifiedCount === 1;
      // don't delete replies - they won't show up without this post anyway
      if (originalPostDeleted) {
        return true;
      }
      return 'Either no posts exists with that ID, or you are not the author of that post.';
    } catch (ex) {
      return ex;
    }
  }
  return 'Please authenticate before posting';
}
