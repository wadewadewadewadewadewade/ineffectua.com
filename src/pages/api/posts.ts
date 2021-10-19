import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { IPost, PostProjection } from '../../common/models/posts/post';
import { IPostWithReplies } from '../../common/types/IPost';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../common/utils/passport-local';
import { getUsersForPosts, IUser } from '../../common/models/users/user';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.get(async (req, res) => {
  if (req.isAuthenticated()) {
    // select posts based on if authenticated user exists
  }
  const inReplyTo =
    typeof req.query.inReplyTo === 'string' ? req.query.inReplyTo : undefined;
  req.db
    .collection<IPost>('posts')
    .find(
      {
        inReplyTo,
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

handler.post(async (req, res) => {
  if (!req.user || !('_id' in req.user)) {
    res.status(401).json('Unauthorized');
  } else {
    try {
      const { inReplyTo, body } = req.body;
      const { _id } = req.user as Partial<IUser>;
      const author = { _id };
      const created = new Date(Date.now()).toUTCString();
      const newPost: Omit<IPost, '_id' | 'author'> & {
        author: { _id: string };
      } = { inReplyTo, created, body, author };
      req.db
        .collection<
          Omit<IPost, '_id' | 'author'> & { author: { _id: string } }
        >('posts')
        .insertOne(newPost)
        .then(result =>
          res.json({ ...newPost, _id: result.insertedId.toString() }),
        );
    } catch (ex) {
      res.json(ex);
      throw ex;
    }
  }
});

export default handler;
