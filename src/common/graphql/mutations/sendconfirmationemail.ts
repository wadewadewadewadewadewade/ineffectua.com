import { gql } from '@apollo/client';

export const SEND_CONFIRMATION_EMAIL = gql`
  mutation sendConfirmationEmail($_id: String!) {
    sendConfirmationEmail(_id: $_id)
  }
`;
