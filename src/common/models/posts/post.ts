import { FindOptions, ObjectId } from 'mongodb';
import { IUser } from '../users/user';

const PostProjectionRecord: Record<keyof IPost, 0 | 1> = {
  _id: 1,
  author: 1,
  inReplyTo: 1,
  created: 1,
  deleted: 0,
  body: 1,
};

export interface IPost {
  _id: string;
  author: Pick<IUser, '_id' | 'name' | 'image'>;
  inReplyTo?: string;
  created: string;
  deleted?: string;
  body: string;
}

export type IPostForDatabase = Omit<IPost, '_id'>;

export const PostProjection = PostProjectionRecord as FindOptions<IPost>;
