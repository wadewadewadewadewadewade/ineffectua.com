import { gql } from '@apollo/client';

export const UPLOAD_FILE = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file)
  }
`;
