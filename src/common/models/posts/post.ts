import { FindOptions, ObjectId } from "mongodb";
import { IUser } from "../users/user";

const PostProjectionRecord: Record<keyof IPost, 0 | 1> = {
  _id: 1,
  authorId: 0,
  author: 0,
  inReplyTo: 1,
  created: 1,
  deleted: 0,
  body: 1
}

export interface IPost {
  _id?: ObjectId;
  authorId: number;
  author: Pick<IUser, 'userId' | 'name' | 'image'>;
  inReplyTo?: ObjectId;
  created: string;
  deleted?: string;
  body: string;
}

export type IPostForDatabase = Omit<IPost, 'author'>;

export const PostProjection = PostProjectionRecord as FindOptions<IPost>;

export const PostForDatabase = (post: IPost): IPostForDatabase => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { author, ...rest } = post;
  return rest;
}

export const PostForWebsite = (post: IPostForDatabase, user: Pick<IUser, 'userId' | 'name' | 'image'>): IPost => ({
  ...post,
  author: {
    userId: user.userId,
    name: user.name,
    image: user.image
  }
});
