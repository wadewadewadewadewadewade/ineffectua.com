import { gql } from '@apollo/client';

export const SIGNUP = gql`
  mutation signUp(
    $email: String!
    $password: String!
    $username: String!
    $name: String
  ) {
    signUp(email: $email, password: $password, username: $username, name: $name) { ... }
  }
`;
