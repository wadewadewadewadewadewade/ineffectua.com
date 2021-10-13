import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { IPostForDatabase, PostForWebsite } from '../models/posts/post';
import { IUser } from '../models/users/user';
import { IPostWithReplies } from '../types/IPost';

if (!process.env.USERFRONT_JWT_PUBLIC_KEY) {
  throw new Error('Please add your Userfront JWT public key to .env.local');
}
if (!process.env.USERFRONT_MODE) {
  throw new Error('Please add your Userfront mode key to .env.local');
}
if (!process.env.USERFRONT_API_KEY) {
  throw new Error('Please add your Userfront API key to .env.local');
}

const headers: HeadersInit = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Authorization: Bearer uf_${process.env.USERFRONT_MODE}_admin_${process.env.USERFRONT_API_KEY}`
}

export const getUser = async (userId: IUser['userId']): Promise<IUser | string> => {
  const response = await fetch(`https://api.userfront.com/v0/users/${userId}`, { headers });
  if (response.ok) {
    return await response.json();
  }
  return response.statusText;
}

export const createUser = async (user: Pick<IUser, 'email' | 'username'> & { password: string } & Partial<Pick<IUser, 'name'>>): Promise<IUser | string> => {
  const response = await fetch(`https://api.userfront.com/v0/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify(user)
  });
  if (response.ok) {
    return await response.json();
  }
  return response.statusText;
}

export const markUserActive = async (userId: Pick<IUser, 'userId'>): Promise<void> => {
  await fetch(`https://api.userfront.com/v0/users/${userId}/active`, {
    method: 'POST',
    headers,
    body: JSON.stringify({})
  });
}


export const getUsersForPosts = (databasePosts: IPostForDatabase[], posts: IPostWithReplies[]): Promise<void[]> =>
  Promise.all(databasePosts.map(dbPost =>
    new Promise<void>(
      (response,reject) => {
        try {
          getUser(dbPost.authorId).then(r => {
            if (typeof r == 'string') {
              reject(r)
            } else {
              posts.push(PostForWebsite(dbPost, r));
              response();
            }
          });
        } catch (ex) {
          reject(ex);
        }
      }
    )
  ))

export const checkHeaderIsVerified = (headers: NextApiRequest['headers']): IUser['userId'] | false => {
  if ('authorization' in headers) {
    const accessToken = headers.authorization.replace("Bearer ", "");
    if (!!accessToken || accessToken.length < 1) {
      return false;
    } else {
      const verifiedPayload = jwt.verify(
        accessToken,
        process.env.USERFRONT_JWT_PUBLIC_KEY,
        { algorithms: ["RS256"] }
      );
      if (typeof verifiedPayload === 'string') {
        return false;
      }
      return verifiedPayload.userId;
    }
  }
}

export interface INextApiRequestWithUser extends NextApiRequest {
  user?: IUser
}

async function database(
  req: INextApiRequestWithUser,
  res: NextApiResponse,
  next: NextHandler
) {
  const userId = checkHeaderIsVerified(req.headers);
  if (userId && !req.user) {
    const user = await getUser(userId);
    if (typeof user !== 'string') {
      req.user = user;
    }
  }
  return next();
}

const middleware = nextConnect<INextApiRequestWithUser, NextApiResponse>();

middleware.use(database);

export default middleware;