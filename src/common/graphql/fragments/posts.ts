import { gql } from 'apollo-server-micro';

export const PostFragment = gql`
  fragment PostInfo on Post {
    __typename
    _id
    author {
      _id
    }
    body
    createdAt
  }
`;
