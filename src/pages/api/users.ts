import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import {
  createOrGetExistingUser,
  ICreateUserUser,
} from '../../common/models/users/user';
import { INextApiRequestWithDB } from '../../common/utils/mongodb';
import handerWithUserAndDB from '../../common/utils/passport-local';
import passport from 'passport';

const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.post((req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    console.log(req.body);

    // TODO: verify req.user has permissions to perform actions
    const userData: ICreateUserUser = req.body;
    createOrGetExistingUser(req.db, { ...userData, ...user }).then(newUser =>
      res.status(200).json(newUser),
    );
  });
});

export default handler;
