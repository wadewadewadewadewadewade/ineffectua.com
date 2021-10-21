import { gql } from '@apollo/client';

export const SIGNUP = gql`
  mutation signup(
    $email: String!
    $password: String!
    $username: String!
    $name: String
  ) {
    signup(email: $email, password: $password, username: $username, name: $name) { ... }
  }
`;
