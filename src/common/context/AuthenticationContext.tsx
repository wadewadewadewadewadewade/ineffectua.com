import { CircularProgress, Box } from '@mui/material';
import React, { createContext } from 'react';
import { IUserProjection } from '../models/users/user';
import { useMutation, useQuery } from '@apollo/client';
import { SIGNOUT } from '../graphql/mutations/signout';
import { GET_CURRENT_USER } from '../graphql/queries/currentUser';

export const AuthenticationContext = createContext<
  (IUserProjection & { signout: () => Promise<void> }) | false | true
>(true);
AuthenticationContext.displayName = 'Authentication';

export const AuthenticationContextProvider: React.FC = ({ children }) => {
  const { data, loading } = useQuery(GET_CURRENT_USER);
  const [signout] = useMutation(SIGNOUT, {
    onCompleted: data => console.log(data),
  });
  const user = data && data.currentUser ? data.currentUser : false;
  return (
    <AuthenticationContext.Provider
      value={
        loading === true
          ? loading
          : user !== false
          ? { ...AuthenticationContext, signout }
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
