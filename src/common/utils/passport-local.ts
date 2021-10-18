import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect, { NextHandler } from 'next-connect';
import { IUser } from '../models/users/user';
import passport from 'passport';
import mongodb, { INextApiRequestWithDB } from './mongodb';

export interface INextApiRequestWithUser extends NextApiRequest {
  user: IUser;
}

export interface INextApiRequestWithUserOptional extends NextApiRequest {
  user?: IUser;
}

async function passportLocalHandler(
  req: INextApiRequestWithDB & INextApiRequestWithUser,
  res: NextApiResponse,
  next: NextHandler,
) {
  await new Promise<void>((resolve, reject) =>
    passport.authenticate('local', (err, user, info, status) => {
      console.log(err, user, info, status);
      if (err) {
        next(err);
      }
      if (!user) {
        res.status(401);
      }
      if (err || !user) {
        reject();
      }
      req.user = user;
      resolve();
    }),
  );
  return next();
}

const middleware = nextConnect<
  INextApiRequestWithDB & INextApiRequestWithUser,
  NextApiResponse
>();

middleware.use(mongodb).use(passport.initialize()).use(passportLocalHandler);

export default middleware;

async function passportLocalUserOptionalHandler(
  req: INextApiRequestWithDB & INextApiRequestWithUserOptional,
  res: NextApiResponse,
  next: NextHandler,
) {
  await new Promise<void>((resolve, reject) =>
    passport.authenticate('local', (err, user, info, status) => {
      console.log(err, user, info, status);
      if (err) {
        next(err);
      }
      if (err || !user) {
        req.user = undefined;
        reject();
      }
      req.user = user;
      resolve();
    }),
  );
  return next();
}

export const passportLocalUserOptional = nextConnect<
  INextApiRequestWithDB & INextApiRequestWithUserOptional,
  NextApiResponse
>();

passportLocalUserOptional
  .use(mongodb)
  .use(passport.initialize())
  .use(passportLocalUserOptionalHandler);
