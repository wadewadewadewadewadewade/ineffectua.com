import { validateUser } from './../../../common/utils/mongodb';
import passport from 'passport';
import { NextApiResponse } from 'next';
import mongodb, { INextApiRequestWithDB } from '../../../common/utils/mongodb';
import nextConnect from 'next-connect';
import { Strategy as LocalStrategy } from 'passport-local';

const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler.use(mongodb);

passport.use(new LocalStrategy(validateUser));

handler.post(async (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    if (!user) {
      return res.status(400).send({ error: 'Login failed' });
    }
    console.log(user);
    return res.json(user);
  });
});

export default handler;
