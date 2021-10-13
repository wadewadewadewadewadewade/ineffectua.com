import { NextApiResponse } from 'next';
import database, { INextApiRequestWithDB } from '../../../common/utils/mongodb';
import { ObjectId } from 'mongodb';
import { IPostForDatabase, PostProjection } from '../../../common/models/posts/post';
import { IPostWithReplies } from '../../../common/types/IPost';
import nextConnect from 'next-connect';
import userfront, { getUsersForPosts, INextApiRequestWithUser } from '../../../common/utils/userfront';

const handler = nextConnect<
  INextApiRequestWithDB & INextApiRequestWithUser,
  NextApiResponse
>();
handler.use(userfront);
handler.use(database);

handler.get(async (req, res) => {
  const postId = Array.isArray(req.query.postId) ? req.query.postId.join(', ') : req.query.postId;
  // get a post with it's first-tier of replies
  const databasePosts: IPostForDatabase[] = await req.db
    .collection<IPostForDatabase>("posts")
    .find({
      _id: new ObjectId(postId),
      deleted: undefined
    })
    .sort({ created: -1 })
    .toArray();
  const posts: IPostWithReplies[] = [];
  await getUsersForPosts(databasePosts, posts);
  const replies: Promise<void>[] = [];
  posts.forEach(post => replies.push(
    new Promise<void>(
      (response,reject) => {
        try {
          req.db
            .collection<IPostForDatabase>("posts")
            .find({
              deleted: undefined,
              replyTo: new ObjectId(postId)
            }, PostProjection)
            .sort({ created: -1 })
            .toArray()
            .then(replies => {
              const repliesPosts: IPostWithReplies[] = [];
              getUsersForPosts(replies, repliesPosts).then(() => {
                post.replies = repliesPosts;
                response();
              })
              .catch(reject);
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
  const { user } = req;
  if (user) {
    const postId = Array.isArray(req.query.postId) ? req.query.postId.join(', ') : req.query.postId;
    const result = await req.db
      .collection<IPostForDatabase>("posts")
      .updateOne({
        _id: new ObjectId(postId),
        authorId: user.userId
      }, {
        $set: { deleted: new Date(Date.now()).toUTCString() }
      });
    res.json(result);
  } else {
    res.status(401).json('Please sign in or create an account in order to post')
  }
})
  
export default handler;