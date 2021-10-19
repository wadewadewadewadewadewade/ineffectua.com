import { CircularProgress, Box } from '@mui/material';
import React, { createContext, useEffect, useState } from 'react';
import { ICreateUserUser, IUser, IUserProjection } from '../models/users/user';
import fetchJson, { EApiEndpoints } from '../utils/fetcher';

interface IAuthenticationContext {
  signUp: (props: ICreateUserUser) => Promise<void>;
  signIn: (email: IUser['email'], password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (password: string) => Promise<boolean>;
}

interface IConfirmAuthenticationContext {
  sendConfirmationEmail?: () => Promise<void>;
}

export const AuthenticationContext = createContext<
  | IAuthenticationContext
  | IConfirmAuthenticationContext
  | IUserProjection
  | true
>(undefined);
AuthenticationContext.displayName = 'Authentication';

export const AuthenticationContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUserProjection | false>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const getUser = async () => {
      const u: IUser | false = await fetchJson('GET', EApiEndpoints.VERIFY);
      setUser(u);
      setIsLoading(false);
    };
    getUser();
  }, []);
  return (
    <AuthenticationContext.Provider
      value={
        isLoading === true
          ? isLoading
          : user && user.isConfirmed
          ? user
          : user && !user.isConfirmed
          ? {
              sendConfirmationEmail: async () =>
                await fetchJson('GET', EApiEndpoints.CONFIRMEMAIL),
            }
          : {
              signUp: async (props: ICreateUserUser) => {
                const newUser: IUser | string = await fetchJson(
                  'POST',
                  EApiEndpoints.SIGNUP,
                  undefined,
                  JSON.stringify(props),
                );
                if (typeof newUser === 'string') {
                  console.error(newUser);
                } else {
                  setUser(newUser);
                }
              },
              signIn: async (email: IUser['email'], password: string) => {
                const newUser: IUser | string = await fetchJson(
                  'POST',
                  EApiEndpoints.SIGNIN,
                  undefined,
                  JSON.stringify({
                    email,
                    password,
                  }),
                );
                if (typeof newUser === 'string') {
                  console.error(newUser);
                } else {
                  setUser(newUser);
                }
              },
              logout: async () => {
                if (user) {
                  await fetchJson('GET', EApiEndpoints.USER, user._id);
                  setUser(undefined);
                }
              },
              resetPassword: async (password: string) => {
                if (user) {
                  const result: boolean | string = await fetchJson(
                    'PUT',
                    EApiEndpoints.USER,
                    user._id,
                    JSON.stringify({
                      password,
                    }),
                  );
                  if (!result || typeof result === 'string') {
                    console.error(result);
                    return false;
                  } else {
                    return true;
                  }
                } else {
                  return false;
                }
              },
            }
      }
    >
      {isLoading ? (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContext;
