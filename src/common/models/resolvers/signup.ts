import { createOrGetExistingUser, ICreateUserUser } from './../users/user';
import Cryptr from 'cryptr';
import { TCookieMethod } from '../../utils/cookies';
import { Db } from 'mongodb';

export function signup(
  _,
  data: ICreateUserUser,
  ctx: { cookie: TCookieMethod; db: Db },
) {
  const { cookie, db } = ctx;

  const user = createOrGetExistingUser(db, data);

  const secret = process.env.ENCRYPTION_TOKEN;
  const cryptr = new Cryptr(secret);
  const encrypted = cryptr.encrypt(JSON.stringify(user));

  // the password is correct, set a cookie on the response
  cookie('session', encrypted, {
    // cookie is valid for all subpaths of my domain
    path: '/',
    // this cookie won't be readable by the browser
    httpOnly: true,
    // and won't be usable outside of my domain
    sameSite: 'strict',
  });

  // tell the mutation that login was successful
  return true;
}
