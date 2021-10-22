import { Db } from 'mongodb';
import { IPost, PostProjection } from '../../../models/posts/post';
import { getUsersForPosts, IUserProjection } from '../../../models/users/user';

export const getPosts = async (
  _parent,
  _args: {
    isReplyTo?: string;
    _id?: string;
    skip?: number;
    userId?: string;
  },
  _context: { user?: IUserProjection; db: () => Promise<Db> },
): Promise<Omit<IPost, 'deletedAt'>[]> => {
  const db = await _context.db();
  const databasePosts = await db
    .collection<IPost>('posts')
    .find({ ..._args, isDeleted: undefined }, PostProjection)
    .sort({ created: -1 })
    .toArray();
  const posts: IPost[] = [];
  await getUsersForPosts(db, databasePosts, posts);
  return posts;
};
