import { Db, MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';

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
