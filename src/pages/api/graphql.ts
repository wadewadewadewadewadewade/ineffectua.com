import { ApolloServer } from 'apollo-server-micro';
import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import typeDefs from '../../common/graphql/typedefs';
import resolvers from '../../common/graphql/resolvers';
import context from '../../common/graphql/context';
import withCookies from '../../common/graphql/helpers/withCookies';
import mongodb, { INextApiRequestWithDB } from '../../common/utils/mongodb';
import { graphqlUploadExpress } from 'graphql-upload';

const handler = nextConnect<
  INextApiRequestWithDB & { is: (type: string) => boolean },
  NextApiResponse
>();
handler
  .use(mongodb)
  .use((req, res, next) => {
    req.is = ctype => req.headers['content-type'].includes(ctype);
    next();
  })
  .use(
    graphqlUploadExpress({
      maxFileSize: 10000000,
    }),
  );

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

let started = false;

const startApolloServer = async (
  req: INextApiRequestWithDB,
  res: NextApiResponse,
) => {
  if (!started) {
    await apolloServer.start();
    started = true;
  }
  apolloServer.createHandler({ path: '/api/graphql' })(req, res);
};

handler.use(startApolloServer);

export default withCookies(handler);
