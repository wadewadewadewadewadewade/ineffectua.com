import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { IUserProjection } from '../../common/models/users/user';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../common/utils/passport-local';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

export type TVerifyUserResponse = IUserProjection | { isAuthenticated: false };

handler.get((req, res) => {
  res.json(req.user || { isAuthenticated: false });
});

export default handler;
