import { CircularProgress, Box } from '@mui/material';
import React, { createContext } from 'react';
import { IUserProjection } from '../models/users/user';
import { useQuery } from '@apollo/client';
import { gql } from 'apollo-server-micro';

const CurrentUserQuery = gql`
  query currentUser {
    currentUser
  }
`;

export const AuthenticationContext = createContext<
  IUserProjection | false | true
>(true);
AuthenticationContext.displayName = 'Authentication';

export const AuthenticationContextProvider: React.FC = ({ children }) => {
  const {
    data: { user },
    loading,
  } = useQuery(CurrentUserQuery);
  return (
    <AuthenticationContext.Provider value={loading === true ? loading : user}>
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
