import { CircularProgress, Box } from '@mui/material';
import React, { createContext } from 'react';
import { IUserProjection } from '../models/users/user';
import { useMutation, useQuery } from '@apollo/client';
import { SIGNOUT } from '../graphql/mutations/signout';
import { GET_CURRENT_USER } from '../graphql/queries/currentUser';

export const AuthenticationContext = createContext<
  | (IUserProjection & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signout: () => Promise<any>;
      sendConfirmationEmail?: () => Promise<void>;
    })
  | false
  | true
>(true);
AuthenticationContext.displayName = 'Authentication';

export const AuthenticationContextProvider: React.FC = ({ children }) => {
  const { data, loading } = useQuery(GET_CURRENT_USER);
  const [signout] = useMutation(SIGNOUT);
  const user =
    data && data.currentUser ? (data.currentUser as IUserProjection) : false;
  return (
    <AuthenticationContext.Provider
      value={
        loading === true
          ? loading
          : user !== false
          ? { ...user, signout }
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
