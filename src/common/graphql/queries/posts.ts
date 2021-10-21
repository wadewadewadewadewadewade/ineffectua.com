import { gql } from '@apollo/client';
import { PostFragment } from '../fragments/posts';

export const GET_POSTS = gql`
  query Posts($skip: Int, $userId: String) {
    posts(skip: $skip, userId: $userId) {
      ...PostInfo
    }
  }
  ${PostFragment}
`;
