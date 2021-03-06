import { createOrGetExistingUser } from './../../../common/models/users/user';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../../common/utils/passport-local';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.post(async (req, res) => {
  const user = await createOrGetExistingUser(req.db, req.body);
  if (user) {
    req.logIn(user, err => {
      if (err) {
        throw err;
      }
      res.json(user);
    });
  }
  res.json('Missing user data');
});

export default handler;
