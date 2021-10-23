import { Config, gql } from 'apollo-server-micro';

const typeDefs: Config['typeDefs'] = gql`
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

  type PostAuthor {
    _id: ID!
  }

  type Post {
    _id: ID!
    author: PostAuthor!
    inReplyTo: ID
    createdAt: String!
    deletedAt: String
    body: String!
  }

  type Query {
    currentUser: User
    getPosts(skip: Int, inReplyTo: String, userId: String): [Post]!
  }

  type Mutation {
    signIn(email: String!, password: String!): User
    signUp(
      email: String!
      password: String!
      username: String!
      name: String
    ): User
    signOut: Boolean
    sendConfirmationEmail(_id: String!): Boolean
  }
`;

export default typeDefs;
