import { gql } from '@apollo/client';

export const DELETE_POST = gql`
  mutation deletePost($_id: String!) {
    deletePost(_id: $_id)
  }
`;
