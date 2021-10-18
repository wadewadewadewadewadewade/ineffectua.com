import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { getUser } from '../../../common/models/users/user';
import mongodb, { INextApiRequestWithDB } from '../../../common/utils/mongodb';
import passportLocalUser, { INextApiRequestWithUser } from '../../../common/utils/passport-local';

const handler = nextConnect<INextApiRequestWithDB & INextApiRequestWithUser, NextApiResponse>();
handler.use(mongodb).use(passportLocalUser);

handler.get(async (req, res) => {
  // TODO: verify req.user has permissions to perform actions
  if ('_id' in req.query) {
    if (typeof req.query._id === 'string') {
      const user = getUser(req.db, req.query._id);
      res.json(user);
    } else {
      // TODO: return a group of users
    }
  } else {
    // it's a logout
  }
});

handler.put(async (req, res) => {
  // TODO: verify req.user has permissions to perform actions
  if ('_id' in req.query) {
    if (typeof req.query._id === 'string') {
      const user = getUser(req.db, req.query._id);
      if (user) {
        // update password or other user data
      }
    } else {
      res.status(501).json('Updating an array of users is not supported');
    }
  } else {
    res.status(501).json('No user specified');
  }
});

export default handler;
