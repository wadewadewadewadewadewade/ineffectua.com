import { Config, gql } from 'apollo-server-micro';

export const typeDefs: Config['typeDefs'] = gql`
  type PostAuthor {
    _id: ID!
  }

  type Post {
    _id: ID!
    author: PostAuthor!
    inReplyTo: ID
    created: String!
    deleted: String
    body: String!
  }

  type Query {
    posts: [Post]!
  }
`;
