import { FindOptions } from 'mongodb';
import { IUser } from '../users/user';

const PostProjectionRecord: Record<keyof IPost, 0 | 1> = {
  _id: 1,
  author: 1,
  inReplyTo: 1,
  createdAt: 1,
  deletedAt: 0,
  body: 1,
};

export interface IPost {
  _id: string;
  author: Pick<IUser, '_id'> & Partial<Pick<IUser, 'username' | 'image'>>;
  inReplyTo?: string;
  createdAt: Date;
  deletedAt?: Date;
  body: string;
}

export type IPostForDatabase = Omit<IPost, '_id'>;

export const PostProjection = PostProjectionRecord as FindOptions<IPost>;
