import { NextApiResponse } from "next";
import database, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import nextConnect from 'next-connect';
import { IPost, PostProjection } from "../../common/models/posts/post";
import { IPostWithReplies } from "../../common/types/IPost";
import { auth0WithoutRedirect, getUsersForPosts, INextApiRequestWithUser } from "../../common/utils/auth0";

const handler = nextConnect<
  INextApiRequestWithDB & INextApiRequestWithUser,
  NextApiResponse
>();
handler.use(auth0WithoutRedirect);
handler.use(database);

handler.get(async (req, res) => {
  const databasePosts = await req.db
    .collection<IPost>("posts")
    .find({
      replyTo: undefined,
      deleted: undefined
    }, PostProjection)
    .sort({ created: -1 })
    .limit(20)
    .toArray();
  const posts: IPostWithReplies[] = [];
  await getUsersForPosts(req.db, databasePosts, posts);
  res.json(posts);
});

handler.post(async (req, res) => {
  if (!req.user) {
    res.status(401).json('Unauthorized');
  } else {
    const { inReplyTo, body } = req.body;
    const { _id, name, picture } = req.user;
    const author = { _id, name, picture };
    const created = new Date(Date.now()).toUTCString();
    const newPost: Omit<IPost, '_id'> = { inReplyTo, created, body, author };
    const result = await req.db
      .collection< Omit<IPost, '_id'>>("posts")
      .insertOne(newPost);
    res.json({...newPost, _id: result.insertedId.toString()});
  }
})
  
export default handler;
