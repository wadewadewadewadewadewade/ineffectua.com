import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect';
import { getUser } from "../../../common/utils/userfront";

const handler = nextConnect<
  NextApiRequest,
  NextApiResponse
>();

handler.get(async (req, res) => {
  if ('userId' in req.query && typeof req.query.userId === 'string') {
    const user = getUser(parseInt(req.query.userId));
    res.json(user);
  }
});
  
export default handler;
