import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getUser } from '../../../common/utils/auth0';
import mongodb, { INextApiRequestWithDB } from '../../../common/utils/mongodb';

const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler.use(mongodb);

handler.get(async (req, res) => {
  if ('_id' in req.query) {
    if (typeof req.query._id === 'string') {
      const user = getUser(req.db, req.query._id);
      res.json(user);
    } else {
      // TODO: return a group of users
    }
  }
});

export default handler;
