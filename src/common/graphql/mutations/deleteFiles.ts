import { gql } from '@apollo/client';

export const DELETE_FILES = gql`
  mutation deleteFiles($urls: [String]!) {
    deleteFiles(urls: $urls)
  }
`;
