import { IUserProjection } from '../../../models/users/user';
import Cryptr from 'cryptr';
import { TCookieMethod } from '../../../utils/cookies';
import { validateUser } from '../../../utils/mongodb';

export function signIn(
  _,
  { email, password }: { email: string; password: string },
  ctx: { cookie: TCookieMethod },
) {
  const { cookie } = ctx;

  let user: Partial<IUserProjection> = undefined;
  let error = undefined;
  validateUser(undefined, email, password, (err, u) => {
    user = u;
    error = err;
  });
  if (error) {
    console.error(error);
    return false;
  }

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
