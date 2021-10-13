import { NextApiRequest, NextApiResponse } from 'next';
import { IUser } from '../models/users/user';
import { IPostWithReplies } from '../types/IPost';
import { withApiAuthRequired, getSession, UserProfile } from '@auth0/nextjs-auth0';
import { INextApiRequestWithDB } from './mongodb';
import { Db } from 'mongodb';
import { IPost } from '../models/posts/post';
import nextConnect, { NextHandler } from 'next-connect';

if (!process.env.AUTH0_SECRET) {
  throw new Error('Please add your Auth0 secret to .env.local');
}
if (!process.env.AUTH0_BASE_URL) {
  throw new Error('Please add your Auth0 issuer base URL to .env.local');
}
if (!process.env.AUTH0_CLIENT_ID) {
  throw new Error('Please add your Auth client ID to .env.local');
}
if (!process.env.AUTH0_CLIENT_SECRET) {
  throw new Error('Please add your Auth client secret to .env.local');
}

export const getUser = async (db: Db, _id?: IUser['_id'], authUser?: UserProfile): Promise<IUser | undefined> => {
  if (_id && !authUser) {
    const user = await db
      .collection<IUser>("users")
      .findOne({ _id });
    return user;
  }
  if (authUser && !_id) {
    const user: IUser | undefined = await db
      .collection<IUser>("users")
      .findOne({ org_id: authUser.org_id });
    if (user) {
      return user;
    } else {
      const newUser = await createUser(db, authUser);
      return newUser;
    }
  }
  return undefined;
}

export const createUser = async (db: Db, user: UserProfile): Promise<IUser> => {
  const result = await db
    .collection<UserProfile>("users")
    .insertOne(user);
  return {...user, _id: result.insertedId.toString()};
}

export const getUsersForPosts = (db: Db, databasePosts: IPost[], posts: IPostWithReplies[]): Promise<void[]> =>
  Promise.all(databasePosts.map(dbPost =>
    new Promise<void>(
      (response,reject) => {
        try {
          getUser(db, dbPost.author._id).then(r => {
            if (typeof r == 'string') {
              reject(r)
            } else {
              posts.push({...dbPost, author: { _id: r._id, name: r.name, picture: r.picture }});
              response();
            }
          });
        } catch (ex) {
          reject(ex);
        }
      }
    )
  ))

  
async function auth0WithoutRedirectHandler(
  req: INextApiRequestWithDB & INextApiRequestWithUserOptional,
  res: NextApiResponse,
  next: NextHandler
) {
  const response = await fetch('http://localhost:3000/api/users');
  if (response.ok) {
    req.user = await response.json();
  } else {
    req.user = false;
  }
  return next();
}

export const auth0WithoutRedirect = nextConnect<INextApiRequestWithDB & INextApiRequestWithUserOptional, NextApiResponse>().use(auth0WithoutRedirectHandler);

export interface INextApiRequestWithUser extends NextApiRequest {
  user: IUser;
}

export interface INextApiRequestWithUserOptional extends NextApiRequest {
  user: IUser | false;
}

const middleware = withApiAuthRequired(async function myApiRoute(req: INextApiRequestWithDB & INextApiRequestWithUser, res) {
  const auth0User: UserProfile = getSession(req, res).user;
  const user = await getUser(undefined, auth0User.org_id);
  req.user = user;
});

export default middleware;