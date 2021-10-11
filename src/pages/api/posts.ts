import { NextApiResponse } from "next";
import middleware, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import nextConnect from 'next-connect';
import { IPost, PostProjection } from "../../common/models/posts/post";

const handler = nextConnect<
  INextApiRequestWithDB,
  NextApiResponse<any>
>();
handler.use(middleware);

handler.get(async (req, res) => {
  const posts = await req.db
    .collection<IPost>("posts")
    .find({
      replyTo: undefined,
      deleted: undefined
    }, PostProjection)
    .sort({ created: -1 })
    .limit(20)
    .toArray();
  res.json(posts);
});

handler.post(async (req, res) => {
  const { inReplyTo, created, body } = req.body;
  const newPost: IPost = { inReplyTo, created, body };
  const result = await req.db
    .collection<IPost>("posts")
    .insertOne(newPost); // TODO: also index images and clean-up unused images
  newPost._id = result.insertedId;
  res.json(newPost);
})
  
export default handler;
