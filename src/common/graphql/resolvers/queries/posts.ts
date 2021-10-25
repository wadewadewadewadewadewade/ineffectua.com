import { ObjectId } from 'mongodb';
import { IPost, PostProjection } from '../../../models/posts/post';
import {
  IUser,
  IUserProjection,
  UserProjection,
} from '../../../models/users/user';
import { IPostWithReplies } from '../../../types/IPost';
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
    .find({ ..._args, deletedAt: { $exists: false } }, PostProjection)
    .sort({ createdAt: -1 })
    .toArray();
  const posts: IPost[] = [];
  await getUsersForPosts(databasePosts, posts);
  return posts;
};

export const getUser = async (
  _id?: IUser['_id'],
): Promise<IUserProjection | false> => {
  if (_id) {
    const db = await ineffectuaDb();
    const user = await db
      .collection<IUser>('users')
      .findOne({ _id: new ObjectId(_id) }, UserProjection);
    return user;
  }
  return false;
};

export const getUsersForPosts = async (
  databasePosts: IPost[],
  posts: IPostWithReplies[],
): Promise<void[]> =>
  Promise.all(
    databasePosts.map(
      dbPost =>
        new Promise<void>((response, reject) => {
          try {
            getUser(dbPost.author._id).then(r => {
              if (r === false) {
                reject(r);
              } else {
                posts.push({
                  ...dbPost,
                  author: { _id: r._id, username: r.username, image: r.image },
                });
                response();
              }
            });
          } catch (ex) {
            reject(ex);
          }
        }),
    ),
  );
