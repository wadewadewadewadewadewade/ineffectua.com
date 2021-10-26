import { ineffectuaDb } from './../utils/mongodb';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  ServerError,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import schema from '../graphql/schema';
import { SchemaLink } from '@apollo/client/link/schema';

// ensure that queries can run on the server during SSR and SSG
//global.fetch = require('node-fetch');
let globalApolloClient = null;

const uri = `${process.env.HOSTNAME_AND_PORT}/api/graphql`.replace(
  'undefined',
  '',
);

function createIsomorphLink() {
  if (typeof window === 'undefined') {
    // These have to imported dynamically, instead of at the root of the page,
    // in order to make sure that we're not shipping server-side code to the client
    return new SchemaLink({
      schema,
      context: { db: ineffectuaDb, cookie: null, user: false },
    });
  } else {
    return new HttpLink({
      uri,
      headers: {
        'keep-alive': 'true',
      },
    });
  }
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      try {
        //toast.error(message);
        console.error(message);
      } catch {
        console.error({ message });
      }
    });
  }

  if (networkError) {
    const err = networkError as ServerError;
    try {
      //toast.error(err.result.error);
      console.error(err.result.error);
    } catch {
      console.error({ err });
    }
  }
});

const link = ApolloLink.from([errorLink, createIsomorphLink()]);

export function createApolloClient(initialState: NormalizedCacheObject = {}) {
  const ssrMode = typeof window === 'undefined';
  const cache = new InMemoryCache({
    typePolicies: {
      Post: {
        keyFields: ['_id'],
        fields: {
          _id: {
            merge: false,
          },
        },
      },
      User: {
        keyFields: ['_id'],
        fields: {
          _id: {
            merge: false,
          },
        },
      },
    },
  }).restore(initialState);

  return new ApolloClient({
    ssrMode,
    link,
    cache,
  });
}

export function initApolloClient(
  initialState = {},
): ApolloClient<NormalizedCacheObject> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  // ref https://github.com/zeit/next.js/blob/canary/examples/api-routes-apollo-server-and-client/apollo/client.js
  if (typeof window === 'undefined') {
    return createApolloClient(initialState);
  }

  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState);
  }

  return globalApolloClient;
}
