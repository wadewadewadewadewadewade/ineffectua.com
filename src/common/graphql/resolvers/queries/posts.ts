import { IPost, PostProjection } from '../../../models/posts/post';
import { getUsersForPosts, IUserProjection } from '../../../models/users/user';
import { ineffectuaDb } from '../../../utils/mongodb';

export const getPosts = async (
  _parent,
  _args: {
    isReplyTo?: string;
    _id?: string;
    skip?: number;
    userId?: string;
  },
  _context: { user?: IUserProjection },
): Promise<Omit<IPost, 'deletedAt'>[]> => {
  const db = await ineffectuaDb();
  const databasePosts = await db
    .collection<IPost>('posts')
    .find({ ..._args, isDeleted: undefined }, PostProjection)
    .sort({ created: -1 })
    .toArray();
  const posts: IPost[] = [];
  await getUsersForPosts(databasePosts, posts);
  return posts;
};
