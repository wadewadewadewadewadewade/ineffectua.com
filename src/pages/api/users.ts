import { NextApiResponse } from "next";
import nextConnect from 'next-connect';
import mongodb, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import auth0, { createUser, getUser, INextApiRequestWithUser } from "../../common/utils/auth0";
import { UserProfile } from "@auth0/nextjs-auth0";

const handler = nextConnect<
  INextApiRequestWithDB & INextApiRequestWithUser,
  NextApiResponse
>();
handler.use(auth0);
handler.use(mongodb);

handler.get(async (req, res) => {
  const { _id } = req.user;
  res.json(await getUser(req.db, _id));
});

handler.post(async (req, res) => {
  const userData: UserProfile = req.body;
  const user = await createUser(req.db, userData);
  res.status(200).json(user);
});
  
export default handler;
