import { gql } from '@apollo/client';

export const SIGNIN = gql`
  mutation sigin($email: String!, $password: String!) {
    signin(email: $email, password: $password)
  }
`;
