import { FindOptions } from 'mongodb';
import { isNumeric } from '../../utils/general-helpers';

export interface IUser {
  _id: string;
  name?: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  locked?: boolean;
  isConfirmed: boolean;
  lastActiveAt: Date;
  confirmedAt?: Date;
  updatedAt?: Date;
  createdAt: Date;
}

export type IUserProjection = Omit<
  IUser,
  'confirmedAt' | 'updatedAt' | 'createdAt' | 'password'
>;

export const UserProjectionRecord: Record<keyof IUser, 0 | 1> = {
  _id: 1,
  name: 1,
  username: 1,
  email: 1,
  password: 0,
  image: 1,
  locked: 1,
  isConfirmed: 1,
  lastActiveAt: 1,
  confirmedAt: 0,
  updatedAt: 0,
  createdAt: 0,
};

export const serealizeUser = (user: IUserProjection | false): string => {
  if (user === false) {
    return JSON.stringify(user);
  }
  const userObject = {};
  Object.keys(user).forEach(key => {
    const value = user[key];
    switch (typeof value) {
      case 'object':
        if ('getTime' in value) {
          userObject[key] = value.getTime();
        } else {
          userObject[key] = value;
        }
        break;
      default:
        userObject[key] = value;
    }
  });
  return JSON.stringify(userObject);
};

export const deserealizeUser = (userString: string): IUserProjection => {
  const userObject = JSON.parse(userString);
  const keys = Object.keys(userObject);
  const dateKeys = [
    'isConfirmed',
    'lastActiveAt',
    'confirmedAt',
    'updatedAt',
    'createdAt',
  ];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = userObject[key];
    if (
      dateKeys.includes(key) &&
      (typeof value === 'number' ||
        (typeof value === 'string' && isNumeric(value)))
    ) {
      userObject[key] = new Date(
        typeof value === 'string' ? parseInt(value, 10) : value,
      );
    }
  }
  return userObject;
};

export const UserProjection = UserProjectionRecord as FindOptions<IUser>;
