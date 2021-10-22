import { FindOptions, ObjectId } from 'mongodb';
import { IPostWithReplies } from '../../types/IPost';
import { IPost } from '../posts/post';
import { SHA256 } from 'crypto-js';
import { ineffectuaDb } from '../../utils/mongodb';

export interface IUser {
  _id: string;
  name?: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  locked?: boolean;
  isConfirmed: boolean;
  lastActiveAt: Date;
  confirmedAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
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

export const serealizeUser = (user: IUserProjection | false): string => {
  if (user === false) {
    return JSON.stringify(user);
  }
  const userObject = {};
  Object.keys(user).forEach(key => {
    const value = user[key];
    switch (typeof value) {
      case 'object':
        if ('getTime' in value) {
          userObject[key] = value.getTime();
        } else {
          userObject[key] = value;
        }
        break;
      default:
        userObject[key] = value;
    }
  });
  return JSON.stringify(userObject);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export const deserealizeUser = (userString: string): IUserProjection => {
  const userObject = JSON.parse(userString);
  const keys = Object.keys(userObject);
  const dateKeys = [
    'isConfirmed',
    'lastActiveAt',
    'confirmedAt',
    'updatedAt',
    'createdAt',
  ];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = userObject[key];
    if (
      dateKeys.includes(key) &&
      (typeof value === 'number' ||
        (typeof value === 'string' && isNumeric(value)))
    ) {
      userObject[key] = new Date(
        typeof value === 'string' ? parseInt(value, 10) : value,
      );
    }
  }
  return userObject;
};

export const UserProjection = UserProjectionRecord as FindOptions<IUser>;

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

export interface ICreateUserUser {
  email: IUser['email'];
  password: string;
  username: IUser['username'];
  name?: IUser['name'];
}

export const createOrGetExistingUser = async (
  user: ICreateUserUser,
): Promise<IUserProjection> => {
  const passwordEncoded = SHA256(user.password).toString();
  const db = await ineffectuaDb();
  const existingUser: IUserProjection | false = await db
    .collection<IUserProjection>('users')
    .findOne(
      {
        email: user.email,
        password: passwordEncoded,
      },
      UserProjection,
    );
  if (existingUser) {
    return existingUser;
  }
  const createdAt = new Date(Date.now());
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

export const getExistingUser = async (
  user: ICreateUserUser,
): Promise<IUserProjection | false> => {
  const db = await ineffectuaDb();
  const passwordEncoded = SHA256(user.password).toString();
  const existingUser: IUserProjection | false = await db
    .collection<IUserProjection>('users')
    .findOne(
      {
        email: user.email,
        password: passwordEncoded,
      },
      UserProjection,
    );
  if (existingUser) {
    return existingUser;
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
