import { Config, gql } from 'apollo-server-micro';

const typeDefs: Config['typeDefs'] = gql`
  scalar Date

  type User {
    _id: String!
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
    _id: String!
  }

  type Post {
    _id: String!
    author: PostAuthor!
    inReplyTo: String
    createdAt: String!
    deletedAt: String
    body: String!
  }

  type Query {
    currentUser: User
    getPosts(skip: Int, inReplyTo: String, userId: String): [Post]!
    otherFields: Boolean!
  }

  scalar SimpleResponse

  scalar StringOrArray

  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
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
    addPost(body: String!, inReplyTo: String): Post
    deletePost(_id: String!): SimpleResponse
    singleUpload(file: Upload!): String!
    multipleUpload(files: [Upload]!): String!
    deleteFiles(urls: [String]!): Boolean
  }
`;

export default typeDefs;
