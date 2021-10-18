import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from 'passport';
import mongodb, { INextApiRequestWithDB, validateUser } from './mongodb';
import { Strategy as LocalStrategy } from 'passport-local';
import redis from 'redis';
import ConnectRedis from 'connect-redis';
import session from 'express-session';

const RedisStore = ConnectRedis(session);
const redisClient = redis.createClient();

const sessionConfig = {
  store: new RedisStore({ client: redisClient }),
  secret: 'static session key that is persisting',
  cookie: {
    maxAge: 86400 * 1000,
  },
  resave: false,
  saveUninitialized: true,
};
const handler = nextConnect<INextApiRequestWithDB, NextApiResponse>();
handler.use(mongodb).use(session(sessionConfig));

passport.use(new LocalStrategy(validateUser));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

handler.use(passport.initialize()).use(passport.session());

export default handler;
