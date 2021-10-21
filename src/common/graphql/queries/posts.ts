import { gql } from '@apollo/client';
import { PostFragment } from '../fragments/posts';

export const GET_POSTS = gql`
  query getPosts($skip: Int, $inReplyTo: String, $userId: String) {
    getPosts(skip: $skip, inReplyTo: $inReplyTo, userId: $userId) {
      ...PostInfo
    }
  }
  ${PostFragment}
`;
