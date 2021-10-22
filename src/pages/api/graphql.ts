import { ApolloServer } from 'apollo-server-micro';
import handerWithUserAndDB, {
  INextApiResponseWithDBAndUser,
} from '../../common/utils/passport-local';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import typeDefs from '../../common/graphql/typedefs';
import resolvers from '../../common/graphql/resolvers';
import context from '../../common/graphql/context';
import withCookies from '../../common/graphql/helpers/withCookies';

const handler = nextConnect<INextApiResponseWithDBAndUser, NextApiResponse>();
handler.use(handerWithUserAndDB);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.use(apolloServer.createHandler({ path: '/api/graphql' }));

export default withCookies(handler);
