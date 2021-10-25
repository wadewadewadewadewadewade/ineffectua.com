import { PostFragment } from '../fragments/posts';
import { gql } from '@apollo/client';

export const ADD_POST = gql`
  mutation addPost($body: String!, $inReplyTo: String) {
    addPost(body: $body, inReplyTo: $inReplyTo) {
      ...PostInfo
    }
  }
  ${PostFragment}
`;
