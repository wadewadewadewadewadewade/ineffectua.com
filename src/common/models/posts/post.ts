import { ObjectId } from "mongodb";

export const PostProjection: Record<string, 0 | 1> = {
  _id: 1,
  inReplyTo: 1,
  created: 1,
  deleted: 0,
  body: 1
}

export interface IPost {
  _id?: ObjectId;
  inReplyTo?: ObjectId;
  created: string;
  deleted?: string;
  body: string;
}