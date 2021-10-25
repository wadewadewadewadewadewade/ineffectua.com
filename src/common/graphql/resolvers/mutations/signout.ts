import { TCookieMethod } from '../../helpers/withCookies';

export function signOut(
  _: Record<string, unknown>,
  _args: Record<string, unknown>,
  ctx: { cookie: TCookieMethod },
) {
  const { cookie } = ctx;

  // delete cookie on the response
  cookie('session', null, {
    // delete the cookie
    expires: new Date(Date.now() + -(1000 * 60)),
    // cookie is valid for all subpaths of my domain
    path: '/',
    // this cookie won't be readable by the browser
    httpOnly: true,
    // and won't be usable outside of my domain
    sameSite: 'strict',
  });

  // tell the mutation that login was successful
  return false;
}
