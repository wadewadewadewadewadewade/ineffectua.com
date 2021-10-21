import { ApolloServer } from 'apollo-server-micro';
import { apolloServerMongoDB } from '../../common/utils/mongodb';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../common/utils/passport-local';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import typeDefs from '../../common/models/typedefs';
import resolvers from '../../common/models/resolvers';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

const apolloServer = new ApolloServer(apolloServerMongoDB(typeDefs, resolvers));

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.post(async (req, res) => {
  console.log(req.user);
  await apolloServer.start();
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

export default handler;
