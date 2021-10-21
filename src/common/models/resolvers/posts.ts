import { Config } from 'apollo-server-micro';
import { Db } from 'mongodb';
import { IPost, PostProjection } from '../posts/post';
import { getUsersForPosts } from '../users/user';

export const resolvers: Config['resolvers'] = {
  Query: {
    async posts(
      _parent,
      _args: { isReplyTo?: string; _id?: string },
      _context: { db: Db },
      _info,
    ): Promise<Omit<IPost, 'deleted'>[]> {
      const databasePosts = await _context.db
        .collection<IPost>('posts')
        .find({ ..._args, isDeleted: undefined }, PostProjection)
        .sort({ created: -1 })
        .toArray();
      const posts: IPost[] = [];
      await getUsersForPosts(_context.db, databasePosts, posts);
      return posts;
    },
  },
};
