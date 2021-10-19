import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../../common/utils/passport-local';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.get(async (req, res) => {
  const user = req.user;
  if (user) {
    req.logOut();
  }
  res.json({ message: 'Signed out' });
});

export default handler;
