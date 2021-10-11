import { NextApiResponse } from 'next';
import middleware, { INextApiRequestWithDB } from '../../../common/utils/mongodb';
import { ObjectId } from 'mongodb';
import { IPost, PostProjection } from '../../../common/models/posts/post';
import { IPostWithReplies } from '../../../common/types/IPost';
import nextConnect from 'next-connect';

const handler = nextConnect<
  INextApiRequestWithDB,
  NextApiResponse
>();
handler.use(middleware);

handler.get(async (req, res) => {
  const postId = Array.isArray(req.query.postId) ? req.query.postId.join(', ') : req.query.postId;
  // get a post with it's first-tier of replies
  const posts: IPostWithReplies[] = await req.db
    .collection<IPost>("posts")
    .find({
      _id: new ObjectId(postId),
      deleted: undefined
    })
    .sort({ created: -1 })
    .toArray();
  const replies: Promise<void>[] = [];
  posts.forEach(post => replies.push(
    new Promise<void>(
      (response,reject) => {
        try {
          req.db
            .collection<IPost>("posts")
            .find({
              deleted: undefined,
              replyTo: new ObjectId(postId)
            }, PostProjection)
            .sort({ created: -1 })
            .toArray()
            .then(replies => {
              post.replies = replies;
              response();
            })
            .catch(reject);
        } catch (ex) {
          reject(ex);
        }
      }
    )
  ));
  await Promise.all(replies);
  res.json(posts);
});

handler.delete(async (req, res) => {
  const postId = Array.isArray(req.query.postId) ? req.query.postId.join(', ') : req.query.postId;
  const result = await req.db
    .collection<IPost>("posts")
    .updateOne({
      _id: new ObjectId(postId)
    }, {
      $set: { deleted: new Date(Date.now()).toUTCString() }
    });
  res.json(result);
})
  
export default handler;