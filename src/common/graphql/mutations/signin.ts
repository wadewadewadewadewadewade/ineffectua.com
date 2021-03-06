import { UserFragment } from './../fragments/user';
import { gql } from '@apollo/client';

export const SIGNIN = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      ...UserInfo
    }
  }
  ${UserFragment}
`;
