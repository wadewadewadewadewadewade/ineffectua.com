import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect';
import { checkHeaderIsVerified, createUser, getUser } from "../../common/utils/userfront";

const handler = nextConnect<
  NextApiRequest,
  NextApiResponse
>();

handler.get(async (req, res) => {
  const userId = checkHeaderIsVerified(req.headers);
  if (userId) {
    res.status(200).json(await getUser(userId));
  } else {
    res.status(404).end();
  }
});

handler.post(async (req, res) => {
  const { email, password, username, name } = req.body;
  const user = await createUser({email, password, username, name})
  res.json(user);
});
  
export default handler;
