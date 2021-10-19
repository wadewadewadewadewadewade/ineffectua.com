import redis from 'redis';
import ConnectRedis from 'connect-redis';
import session from 'express-session';

const RedisStore = ConnectRedis(session);
const redisClient = redis.createClient();

export const sessionConfig = {
  store: new RedisStore({ client: redisClient }),
  secret: 'static session key that is persisting',
  cookie: {
    maxAge: 86400 * 1000,
    secure: process.env.NODE_ENV === 'production',
  },
  resave: false,
  saveUninitialized: true,
};

export const Session = session(sessionConfig);
