import { NextApiResponse } from 'next';
import database, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import nextConnect from 'next-connect';
import { IPost, PostProjection } from '../../common/models/posts/post';
import { IPostWithReplies } from '../../common/types/IPost';
import { INextApiRequestWithUserOptional, passportLocalUserOptional } from '../../common/utils/passport-local';
import { getUsersForPosts } from '../../common/models/users/user';

const handler = nextConnect<
  INextApiRequestWithDB & INextApiRequestWithUserOptional,
  NextApiResponse
>();
handler.use(database).use(passportLocalUserOptional);

handler.get(async (req, res) => {
  const databasePosts = await req.db
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
    const { _id, name, image } = req.user;
    const author = { _id, name, image };
    const created = new Date(Date.now()).toUTCString();
    const newPost: Omit<IPost, '_id'> = { inReplyTo, created, body, author };
    const result = await req.db
      .collection<Omit<IPost, '_id'>>('posts')
      .insertOne(newPost);
    res.json({ ...newPost, _id: result.insertedId.toString() });
  }
});

export default handler;
