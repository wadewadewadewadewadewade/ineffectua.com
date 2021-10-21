import { gql } from '@apollo/client';
import { PostFragment } from '../fragments/posts';

export const GET_POSTS = gql`
  query posts($skip: Int, $inReplyTo: String, $userId: String) {
    posts(skip: $skip, inReplyTo: $inReplyTo, userId: $userId) {
      ...PostInfo
    }
  }
  ${PostFragment}
`;
