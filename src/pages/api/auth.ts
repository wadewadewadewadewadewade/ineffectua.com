import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import {
  auth0WithoutRedirect,
  INextApiRequestWithUserOptional,
} from '../../common/utils/auth0';

const handler = nextConnect<INextApiRequestWithUserOptional, NextApiResponse>();
handler.use(auth0WithoutRedirect);

handler.get(async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json(false);
  }
});

export default handler;
