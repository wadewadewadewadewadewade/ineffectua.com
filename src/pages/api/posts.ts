import { NextApiResponse } from "next";
import database, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import nextConnect from 'next-connect';
import { IPostForDatabase, PostProjection } from "../../common/models/posts/post";
import userfront, { getUsersForPosts, INextApiRequestWithUser } from "../../common/utils/userfront";
import { IPostWithReplies } from "../../common/types/IPost";

const handler = nextConnect<
  INextApiRequestWithDB & INextApiRequestWithUser,
  NextApiResponse
>();
handler.use(userfront);
handler.use(database);

handler.get(async (req, res) => {
  const databasePosts = await req.db
    .collection<IPostForDatabase>("posts")
    .find({
      replyTo: undefined,
      deleted: undefined
    }, PostProjection)
    .sort({ created: -1 })
    .limit(20)
    .toArray();
  const posts: IPostWithReplies[] = [];
  await getUsersForPosts(databasePosts, posts);
  res.json(posts);
});

handler.post(async (req, res) => {
  if (req.user) {
    const { inReplyTo, created, body } = req.body;
    const { userId } = req.user;
    const newPost: IPostForDatabase = { inReplyTo, created, body, authorId: userId };
    const result = await req.db
      .collection<IPostForDatabase>("posts")
      .insertOne(newPost);
    newPost._id = result.insertedId;
    res.json(newPost);
  } else {
    res.status(401).json('Please sign in or create an account in order to post')
  }
})
  
export default handler;
