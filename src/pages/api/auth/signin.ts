/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getExistingUser } from '../../../common/models/users/user';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../../common/utils/passport-local';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.post(async (req, res) => {
  const user = await getExistingUser(req.db, req.body);
  if ('_id' in user) {
    req.logIn(user, err => {
      if (err) {
        throw err;
      }
      // @ts-ignore
      const { password, confirmedAt, ...rest } = user;
      res.json(rest);
    });
  }
  res.json({ message: 'A user with that email address or password not found' });
});

export default handler;
