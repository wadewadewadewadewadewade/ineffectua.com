import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import {
  createUser,
  ICreateUserUser,
  IUser,
} from '../../common/models/users/user';
import mongodb, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import { SHA256 } from 'crypto-js';
import passport from 'passport';

const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler.use(mongodb);

handler.get(async (req, res) => {
  passport.use(
    new LocalStrategy(function (
      email: string,
      password: string,
      done: (err, user) => void,
    ) {
      req.db
        .collection<IUser>('users')
        .findOne({ email }, function (err, user) {
          if (err) {
            return done(err, null);
          }
          if (!user) {
            return done(null, false);
          }
          if (SHA256(password).toString() !== user.password) {
            return done(null, false);
          }
          return done(null, user);
        });
    }),
  );
});

handler.post(async (req, res) => {
  const userData: ICreateUserUser = req.body;
  const user = await createUser(req.db, userData);
  res.status(200).json(user);
});

export default handler;
