import { Config } from 'apollo-server-micro';
import { ContextFunction } from 'apollo-server-micro/node_modules/apollo-server-core';
import { UserProjection } from './../models/users/user';
import { AnyError, Db, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { SHA256 } from 'crypto-js';
import { IUserProjection } from '../models/users/user';
import { Request } from 'express';
import Cryptr from 'cryptr';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}
if (!process.env.MONGODB_DB) {
  throw new Error('Please add your Mongo DB to .env.local');
}

const client = new MongoClient(process.env.MONGODB_URI) as MongoClient & {
  isConnected: boolean;
};

export interface INextApiRequestWithDB extends NextApiRequest {
  dbClient: MongoClient;
  db: Db;
}

async function database(
  req: INextApiRequestWithDB,
  res: NextApiResponse,
  next: NextHandler,
) {
  if (!client.isConnected) await client.connect();
  req.dbClient = client;
  req.db = client.db(process.env.MONGODB_DB);
  return next();
}

const middleware = nextConnect<INextApiRequestWithDB, NextApiResponse>();

middleware.use(database);

export default middleware;

interface IVerifyOptions {
  message: string;
}

interface VerifyFunctionWithRequest {
  (
    req: Request | undefined,
    username: string,
    password: string,
    done: (
      error: AnyError,
      user?: Partial<IUserProjection>,
      options?: IVerifyOptions,
    ) => void,
  ): void;
}

export const validateUser: VerifyFunctionWithRequest = async (
  req,
  email,
  password,
  done,
) => {
  if (!client.isConnected) await client.connect();
  const user = await client
    .db(process.env.MONGODB_DB)
    .collection<IUserProjection & { password: string }>('users')
    .findOne({ email }, UserProjection);
  if (!user) {
    return done(null, undefined);
  }
  if (user.password !== SHA256(password).toString()) {
    return done(null, undefined);
  }
  return done(null, user);
};

const dbObject: { db: Db | undefined } = { db: undefined };

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

const context: ContextFunction = ctx => {
  return {
    // expose the cookie helper in the GraphQL context object
    cookie: ctx.res.cookie,
    // allow queries and mutations to look for an `isMe` boolean in the context object
    user: isAuthenticated(ctx.req),
  };
};

export const apolloServerMongoDB = (
  typeDefs: Config['typeDefs'],
  resolvers: Config['resolvers'],
): Config => ({
  typeDefs,
  resolvers,
  context: async ctx => {
    if (!dbObject.db) {
      if (!client.isConnected) await client.connect();
      dbObject.db = client.db(process.env.MONGODB_DB);
    }
    return { ...dbObject, ...context(ctx) };
  },
});
