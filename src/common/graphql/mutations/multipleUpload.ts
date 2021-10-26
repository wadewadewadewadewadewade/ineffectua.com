import { gql } from '@apollo/client';

export const UPLOAD_MULTIPLE_FILES = gql`
  mutation multipleUpload($files: [Upload]!) {
    multipleUpload(files: $files)
  }
`;
