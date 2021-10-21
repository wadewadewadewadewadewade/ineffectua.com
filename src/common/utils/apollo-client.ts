import { ApolloClient, InMemoryCache } from '@apollo/client';

const uri = `${process.env.HOSTNAME_AND_PORT}/api/graphql`;

const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
});

export default client;
