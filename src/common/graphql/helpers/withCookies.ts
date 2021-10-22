import { NextApiResponse, NextApiRequest, NextApiHandler } from 'next';
import { serialize } from 'cookie';

export interface ICookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax';
}

export type TCookieMethod = (
  name: string,
  value: string,
  options: ICookieOptions,
) => void;

/**
 * This sets `cookie` on `res` object
 */
const cookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: ICookieOptions = {},
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
};

/**
 * Adds `cookie` function on `res.cookie` to set cookies for response
 */
const withCookies =
  (handler: NextApiHandler) =>
  (
    req: NextApiRequest,
    res: NextApiResponse & {
      cookie: TCookieMethod;
    },
  ) => {
    res.cookie = (name: string, value: string, options: ICookieOptions) =>
      cookie(res, name, value, options);

    return handler(req, res);
  };

export default withCookies;
