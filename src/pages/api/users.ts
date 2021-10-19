import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { INextApiRequestWithDB } from '../../common/utils/mongodb';
import handerWithUserAndDB from '../../common/utils/passport-local';
import { Request } from 'express';

const handler = nextConnect<INextApiRequestWithDB & Request, NextApiResponse>();
handler.use(handerWithUserAndDB);

handler.post((req, res) => {
  res.json(req.user);
});

export default handler;
