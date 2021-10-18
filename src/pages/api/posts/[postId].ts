import { NextApiResponse } from 'next';
import { INextApiRequestWithDB } from '../../../common/utils/mongodb';
import { ObjectId } from 'mongodb';
import { IPost, PostProjection } from '../../../common/models/posts/post';
import { IPostWithReplies } from '../../../common/types/IPost';
import nextConnect from 'next-connect';
import handerWithUserAndDB from '../../../common/utils/passport-local';
import { getUsersForPosts } from '../../../common/models/users/user';
import passport from 'passport';

const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.get((req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

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
  });
});

handler.delete((req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    // TODO: verify req.user has permissions to perform actions
    if (user) {
      const postId = Array.isArray(req.query.postId)
        ? req.query.postId.join(', ')
        : req.query.postId;
      req.db
        .collection<IPost>('posts')
        .updateOne(
          {
            _id: new ObjectId(postId),
            authorId: user._id,
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
});

export default handler;
