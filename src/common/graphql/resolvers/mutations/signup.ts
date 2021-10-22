import {
  createOrGetExistingUser,
  ICreateUserUser,
  serealizeUser,
} from '../../../models/users/user';
import Cryptr from 'cryptr';
import { TCookieMethod } from '../../helpers/withCookies';

export async function signUp(
  _,
  data: ICreateUserUser,
  _context: { cookie: TCookieMethod },
) {
  const { cookie } = _context;

  const user = await createOrGetExistingUser(data);

  const secret = process.env.ENCRYPTION_TOKEN;
  const cryptr = new Cryptr(secret);
  const encrypted = cryptr.encrypt(serealizeUser(user));

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
  return user;
}
