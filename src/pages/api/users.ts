import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import {
  createOrGetExistingUser,
  ICreateUserUser,
} from '../../common/models/users/user';
import mongodb, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import { INextApiRequestWithUserOptional, passportLocalUserOptional } from '../../common/utils/passport-local';

const handler = nextConnect<INextApiRequestWithDB & INextApiRequestWithUserOptional, NextApiResponse>();
handler.use(mongodb).use(passportLocalUserOptional);

handler.get(async (req, res) => {
  // test for user is authenticated
  res.json(!!req.user);
});

handler.post(async (req, res) => {
  // TODO: verify req.user has permissions to perform actions
  const userData: ICreateUserUser = req.body;
  const user = await createOrGetExistingUser(req.db, userData);
  res.status(200).json(user);
});

export default handler;
