import {
  IUser,
  serealizeUser,
  UserProjection,
  IUserProjection,
} from '../../../models/users/user';
import Cryptr from 'cryptr';
import { TCookieMethod } from '../../helpers/withCookies';
import { SHA256 } from 'crypto-js';
import { ineffectuaDb } from '../../../utils/mongodb';

export interface ICreateUserUser {
  email: IUser['email'];
  password: string;
  username: IUser['username'];
  name?: IUser['name'];
}

export const createOrGetExistingUser = async (
  user: ICreateUserUser,
): Promise<IUserProjection> => {
  const passwordEncoded = SHA256(user.password).toString();
  const db = await ineffectuaDb();
  const existingUser: IUserProjection | false = await db
    .collection<IUserProjection>('users')
    .findOne(
      {
        email: user.email,
        password: passwordEncoded,
      },
      UserProjection,
    );
  if (existingUser) {
    return existingUser;
  }
  const createdAt = new Date(Date.now());
  const result = await db
    .collection<Partial<Omit<IUser, '_id'>>>('users')
    .insertOne({
      email: user.email,
      password: passwordEncoded,
      username: user.username,
      name: user.name,
      createdAt,
      lastActiveAt: createdAt,
    });
  return {
    image: undefined,
    isConfirmed: false,
    locked: false,
    email: user.email,
    username: user.username,
    name: user.name,
    _id: result.insertedId.toString(),
    lastActiveAt: createdAt,
  };
};

export const getExistingUser = async (
  user: ICreateUserUser,
): Promise<IUserProjection | false> => {
  const db = await ineffectuaDb();
  const passwordEncoded = SHA256(user.password).toString();
  const existingUser: IUserProjection | false = await db
    .collection<IUserProjection>('users')
    .findOne(
      {
        email: user.email,
        password: passwordEncoded,
      },
      UserProjection,
    );
  if (existingUser) {
    return existingUser;
  }
  return false;
};

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

  // Set a cookie on the response
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
