import { ApolloClient, InMemoryCache } from '@apollo/client';

const uri = `${process.env.HOSTNAME_AND_PORT}/api/graphql`.replace(
  'undefined',
  '',
);

export const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});
