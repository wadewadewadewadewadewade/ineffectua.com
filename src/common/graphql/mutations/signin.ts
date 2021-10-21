import { gql } from '@apollo/client';

export const SIGNIN = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) { ... }
  }
`;
