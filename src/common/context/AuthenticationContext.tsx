import { CircularProgress, Box } from '@mui/material';
import React, { createContext, useRef } from 'react';
import { IUserProjection } from '../models/users/user';
import { useMutation, useQuery } from '@apollo/client';
import { SIGNOUT } from '../graphql/mutations/signout';
import { GET_CURRENT_USER } from '../graphql/queries/currentUser';
import { SEND_CONFIRMATION_EMAIL } from '../graphql/mutations/sendconfirmationemail';

export const AuthenticationContext = createContext<
  | (IUserProjection & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signOut: () => Promise<any>;
      sendConfirmationEmail?: (
        results?: (sent: boolean) => void,
      ) => Promise<void>;
    })
  | false
  | true
>(true);
AuthenticationContext.displayName = 'Authentication';

export const AuthenticationContextProvider: React.FC = ({ children }) => {
  const { data, loading } = useQuery(GET_CURRENT_USER);
  const [signOut] = useMutation(SIGNOUT);
  const confirmationResultsHandlerRef =
    useRef<(results: boolean) => void>(undefined);
  const [sendConfirmationEmail, mutationResults] = useMutation(
    SEND_CONFIRMATION_EMAIL,
  );
  if (confirmationResultsHandlerRef.current) {
    if (typeof mutationResults.data === 'boolean') {
      confirmationResultsHandlerRef.current(mutationResults.data);
    } else if (mutationResults.error) {
      confirmationResultsHandlerRef.current(false);
    }
  }
  console.log({ data });
  const user =
    data && data.currentUser ? (data.currentUser as IUserProjection) : false;
  return (
    <AuthenticationContext.Provider
      value={
        loading === true
          ? loading
          : user !== false
          ? {
              ...user,
              signOut,
              sendConfirmationEmail: user.isConfirmed
                ? undefined
                : async results => {
                    if (!mutationResults.called) {
                      confirmationResultsHandlerRef.current = results;
                      await sendConfirmationEmail({
                        variables: {
                          _id: user._id,
                        },
                      });
                    }
                  },
            }
          : user
      }
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContext;
