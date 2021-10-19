import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import mongodb, { INextApiRequestWithDB, validateUser } from './mongodb';
import { Strategy as LocalStrategy } from 'passport-local';
import { Session } from '../models/session/session';

const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler
  .use(mongodb)
  .use(Session)
  .use(passport.initialize())
  .use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
      session: true,
    },
    validateUser,
  ),
);

export default handler;
