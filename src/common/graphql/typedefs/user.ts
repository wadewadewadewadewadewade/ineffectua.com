import { Config, gql } from 'apollo-server-micro';

export const typeDefs: Config['typeDefs'] = gql`
  scalar Date

  type User {
    _id: ID!
    email: String!
    password: String!
    username: String!
    name: String
    image: String
    locked: Boolean
    isConfirmed: Boolean
    lastActiveAt: Date!
    confirmedAt: Date
    updatedAt: Date
    createdAt: Date!
  }
`;
