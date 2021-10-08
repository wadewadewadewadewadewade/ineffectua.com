import { IPost } from "../models/posts/post";

export interface IPostWithReplies extends IPost {
  replies?: IPost[];
}
