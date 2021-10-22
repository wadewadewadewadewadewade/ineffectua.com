import { TCookieMethod } from './../../../graphql/helpers/withCookies';

export function signOut(_, _args, ctx: { cookie: TCookieMethod }) {
  const { cookie } = ctx;

  // the password is correct, set a cookie on the response
  cookie('session', null, {
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
