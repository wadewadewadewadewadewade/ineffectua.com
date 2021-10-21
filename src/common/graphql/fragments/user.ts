import { gql } from 'apollo-server-micro';

export const UserFragment = gql`
  fragment UserInfo on User {
    __typename
    _id
    email
    username
    name
    image
    locked
    isConfirmed
    lastActiveAt
    confirmedAt
    updatedAt
    createdAt
  }
`;
