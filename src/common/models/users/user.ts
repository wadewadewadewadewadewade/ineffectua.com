import { Db, FindOptions } from 'mongodb';
import { IPostWithReplies } from '../../types/IPost';
import { IPost } from '../posts/post';
import { SHA256 } from 'crypto-js';

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  image: string;
  locked: boolean;
  isConfirmed: boolean;
  lastActiveAt: string;
  confirmedAt: string;
  updatedAt: string;
  createdAt: string;
}

export type IUserProjection = Omit<
  IUser,
  'confirmedAt' | 'updatedAt' | 'createdAt' | 'password'
>;

export const UserProjectionRecord: Record<keyof IUser, 0 | 1> = {
  _id: 1,
  name: 1,
  username: 1,
  email: 1,
  password: 0,
  image: 1,
  locked: 1,
  isConfirmed: 1,
  lastActiveAt: 1,
  confirmedAt: 0,
  updatedAt: 0,
  createdAt: 0,
};

export const UserProjection = UserProjectionRecord as FindOptions<IUser>;

export const getUser = async (
  db: Db,
  _id?: IUser['_id'],
): Promise<IUserProjection | false> => {
  if (_id) {
    const user = await db
      .collection<IUser>('users')
      .findOne({ _id }, UserProjection);
    return user;
  }
  return false;
};

export interface ICreateUserUser {
  email: IUser['email'];
  password: string;
  username?: IUser['username'];
  name?: IUser['name'];
}

export const createOrGetExistingUser = async (
  db: Db,
  user: ICreateUserUser,
): Promise<IUserProjection> => {
  const passwordEncoded = SHA256(user.password).toString();
  const existingUser: IUserProjection | false = await db
    .collection<IUserProjection>('users').findOne({
      email: user.email,
      password: passwordEncoded
    }, UserProjection);
  if (existingUser) {
    return existingUser;
  }
  const createdAt = new Date(Date.now()).toUTCString();
  const result = await db
    .collection<Partial<Omit<IUser, '_id'>>>('users')
    .insertOne({
      email: user.email,
      password: passwordEncoded,
      username: user.username,
      name: user.name,
      createdAt,
      lastActiveAt: createdAt,
    });
  return {
    image: undefined,
    isConfirmed: false,
    locked: false,
    email: user.email,
    username: user.username,
    name: user.name,
    _id: result.insertedId.toString(),
    lastActiveAt: createdAt,
  };
};

export const getUsersForPosts = (
  db: Db,
  databasePosts: IPost[],
  posts: IPostWithReplies[],
): Promise<void[]> =>
  Promise.all(
    databasePosts.map(
      dbPost =>
        new Promise<void>((response, reject) => {
          try {
            getUser(db, dbPost.author._id).then(r => {
              if (r === false) {
                reject(r);
              } else {
                posts.push({
                  ...dbPost,
                  author: { _id: r._id, name: r.name, image: r.image },
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
