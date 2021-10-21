import { Db } from 'mongodb';
import { IPost, PostProjection } from '../../../models/posts/post';
import { getUsersForPosts } from '../../../models/users/user';

export const getPosts = async (
  _parent,
  _args: {
    isReplyTo?: string;
    _id?: string;
    skip?: number;
    userId?: string;
  },
  _context: { db: Db },
  _info,
): Promise<Omit<IPost, 'deletedAt'>[]> => {
  console.log('posts', _context);
  const databasePosts = await _context.db
    .collection<IPost>('posts')
    .find({ ..._args, isDeleted: undefined }, PostProjection)
    .sort({ created: -1 })
    .toArray();
  const posts: IPost[] = [];
  await getUsersForPosts(_context.db, databasePosts, posts);
  console.log('posts', { databasePosts, posts });
  return posts;
};
