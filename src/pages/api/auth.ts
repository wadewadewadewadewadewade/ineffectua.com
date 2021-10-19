import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { IUser } from '../../common/models/users/user';
import { INextApiRequestWithDB } from '../../common/utils/mongodb';
import handerWithUserAndDB from '../../common/utils/passport-local';

const handler = nextConnect<
  INextApiRequestWithDB & Request & { user?: IUser },
  NextApiResponse
>();
handler.use(handerWithUserAndDB);

handler.get((req, res) => {
  res.json(req.user || false);
});

export default handler;
