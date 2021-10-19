import { createOrGetExistingUser } from './../../../common/models/users/user';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { INextApiRequestWithDB } from '../../../common/utils/mongodb';
import handerWithUserAndDB from '../../../common/utils/passport-local';
import { Request } from 'express';

const handler = nextConnect<INextApiRequestWithDB & Request, NextApiResponse>();
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
  res.status(501).json('Missing user data');
});

export default handler;
