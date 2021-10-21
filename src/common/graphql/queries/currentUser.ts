import { UserFragment } from '../fragments/user';
import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query currentUser {
    ...UserInfo
  }
  ${UserFragment}
`;
