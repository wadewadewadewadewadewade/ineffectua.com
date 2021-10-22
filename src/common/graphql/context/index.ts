import { ContextFunction } from 'apollo-server-micro/node_modules/apollo-server-core';
import Cryptr from 'cryptr';
import { NextApiRequest } from 'next';
import { IUserProjection } from '../../models/users/user';
import { ineffectuaDb } from '../../utils/mongodb';

if (!process.env.ENCRYPTION_TOKEN) {
  throw new Error('Please add your Encryption Token to .env.local');
}

function isAuthenticated(req: NextApiRequest) {
  // I use a cookie called 'session'
  const { session } = req?.cookies;

  // Cryptr requires a minimum length of 32 for any signing
  if (!session || session.length < 32) {
    return false;
  }

  const secret = process.env.ENCRYPTION_TOKEN;
  const cryptr = new Cryptr(secret);
  const user = cryptr.decrypt(session);
  return user ? (JSON.parse(user) as IUserProjection) : false;
}

export const context: ContextFunction = ctx => {
  return {
    // expose the cookie helper in the GraphQL context object
    cookie: ctx.res.cookie,
    // allow queries and mutations to look for an `isMe` boolean in the context object
    user: isAuthenticated(ctx.req),
    db: ineffectuaDb,
  };
};

export default context;
