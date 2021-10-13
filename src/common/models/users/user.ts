import { UserProfile } from "@auth0/nextjs-auth0";
import { FindOptions  } from 'mongodb';

const UserProjectionRecord: Record<keyof IUser, 0 | 1> = {
  _id: 1,
  email: 1,
  email_verified: 1,
  name: 1,
  nickname: 1,
  picture: 1,
  sub: 1,
  updated_at: 1,
  org_id: 1
}

export const UserProjection = UserProjectionRecord as FindOptions<IUser>;

export interface IUser extends UserProfile {
  _id: string;
}
