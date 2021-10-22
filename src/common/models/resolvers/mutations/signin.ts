import { TCookieMethod } from './../../../graphql/helpers/withCookies';
import Cryptr from 'cryptr';
import { validateUser } from '../../../utils/mongodb';

export async function signIn(
  _,
  { email, password }: { email: string; password: string },
  ctx: { cookie: TCookieMethod },
) {
  const { cookie } = ctx;

  const user = await validateUser(email, password);

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
