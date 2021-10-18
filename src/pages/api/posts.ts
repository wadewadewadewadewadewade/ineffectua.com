import { INextApiRequestWithDB } from './../../common/utils/mongodb';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { IPost, PostProjection } from '../../common/models/posts/post';
import { IPostWithReplies } from '../../common/types/IPost';
import handerWithUserAndDB from '../../common/utils/passport-local';
import { getUsersForPosts } from '../../common/models/users/user';
import passport from 'passport';

const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.get(async (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    // select posts based on if authenticated user exists
    req.db
      .collection<IPost>('posts')
      .find(
        {
          replyTo: undefined,
          deleted: undefined,
        },
        PostProjection,
      )
      .sort({ created: -1 })
      .limit(20)
      .toArray()
      .then(databasePosts => {
        const posts: IPostWithReplies[] = [];
        getUsersForPosts(req.db, databasePosts, posts).then(() =>
          res.json(posts),
        );
      });
  });
});

handler.post(async (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    if (!user) {
      res.status(401).json('Unauthorized');
    } else {
      const { inReplyTo, body } = req.body;
      const { _id, name, image } = user;
      const author = { _id, name, image };
      const created = new Date(Date.now()).toUTCString();
      const newPost: Omit<IPost, '_id'> = { inReplyTo, created, body, author };
      const result = req.db
        .collection<Omit<IPost, '_id'>>('posts')
        .insertOne(newPost)
        .then(newPost =>
          res.json({ ...newPost, _id: result.insertedId.toString() }),
        );
    }
  });
});

export default handler;
