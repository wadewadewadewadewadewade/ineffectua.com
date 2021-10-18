import { UserProjection } from './../models/users/user';
import { AnyError, Db, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { SHA256 } from 'crypto-js';
import { IUserProjection } from '../models/users/user';

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

interface VerifyFunction {
  (
    username: string,
    password: string,
    done: (
      error: AnyError | null,
      user?: IUserProjection,
      options?: IVerifyOptions,
    ) => void,
  ): void;
}

export const validateUser: VerifyFunction = async (email, password, done) => {
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
