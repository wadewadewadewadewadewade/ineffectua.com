import { NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { IPost, PostProjection } from '../../../common/models/posts/post';
import { IPostWithReplies } from '../../../common/types/IPost';
import nextConnect from 'next-connect';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../../common/utils/passport-local';
import { getUsersForPosts } from '../../../common/models/users/user';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.get((req, res) => {
  if (req.user) {
    const postId = Array.isArray(req.query.postId)
      ? req.query.postId.join(', ')
      : req.query.postId;
    // get a post with it's first-tier of replies
    req.db
      .collection<IPost>('posts')
      .find({
        _id: new ObjectId(postId),
        deleted: undefined,
      })
      .sort({ created: -1 })
      .toArray()
      .then(databasePosts => {
        const posts: IPostWithReplies[] = [];
        getUsersForPosts(req.db, databasePosts, posts).then(() => {
          const replies: Promise<void>[] = [];
          posts.forEach(post =>
            replies.push(
              new Promise<void>((response, reject) => {
                try {
                  req.db
                    .collection<IPost>('posts')
                    .find(
                      {
                        deleted: undefined,
                        replyTo: new ObjectId(postId),
                      },
                      PostProjection,
                    )
                    .sort({ created: -1 })
                    .toArray()
                    .then(replies => {
                      const repliesPosts: IPostWithReplies[] = [];
                      getUsersForPosts(req.db, replies, repliesPosts)
                        .then(() => {
                          post.replies = repliesPosts;
                          response();
                        })
                        .catch(reject);
                    })
                    .catch(reject);
                } catch (ex) {
                  reject(ex);
                }
              }),
            ),
          );
          Promise.all(replies).then(() => res.json(posts));
        });
      });
  }
});

handler.delete((req, res) => {
  if (req.user) {
    const postId = Array.isArray(req.query.postId)
      ? req.query.postId.join(', ')
      : req.query.postId;
    req.db
      .collection<IPost>('posts')
      .updateOne(
        {
          _id: new ObjectId(postId),
          author: { _id: req.user._id },
        },
        {
          $set: { deleted: new Date(Date.now()).toUTCString() },
        },
      )
      .then(result => res.json(result));
  } else {
    res
      .status(401)
      .json('Please sign in or create an account in order to post');
  }
});

export default handler;
