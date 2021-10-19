import { CircularProgress, Box } from '@mui/material';
import { useRouter } from 'next/dist/client/router';
import React, { createContext, useEffect, useState } from 'react';
import { TVerifyUserResponse } from '../../pages/api/auth';
import { ICreateUserUser, IUser, IUserProjection } from '../models/users/user';
import fetchJson, { EApiEndpoints } from '../utils/fetcher';

interface IAuthenticationContextUser extends IUserProjection {
  logout: () => Promise<void>;
}

interface IAuthenticationContextMethods {
  signUp: (props: ICreateUserUser) => Promise<void>;
  signIn: (email: IUser['email'], password: string) => Promise<void>;
  resetPassword: (password: string) => Promise<boolean>;
}

interface IConfirmAuthenticationContext {
  sendConfirmationEmail?: () => Promise<void>;
}

export const AuthenticationContext = createContext<
  | IAuthenticationContextMethods
  | IConfirmAuthenticationContext
  | IAuthenticationContextUser
  | true
>(undefined);
AuthenticationContext.displayName = 'Authentication';

export const AuthenticationContextProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<TVerifyUserResponse>({
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authenticationContextMethods: IAuthenticationContextMethods = {
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
        router.replace(router.asPath);
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
        router.replace(router.asPath);
      }
    },
    resetPassword: async (password: string) => {
      if ('_id' in user) {
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
  };
  const logout: IAuthenticationContextUser['logout'] = async () => {
    if ('_id' in user) {
      await fetchJson('GET', EApiEndpoints.SIGNOUT);
      setUser(undefined);
      router.replace(router.asPath);
    }
  };
  const sendConfirmationEmail: IConfirmAuthenticationContext['sendConfirmationEmail'] =
    async () => await fetchJson('GET', EApiEndpoints.CONFIRMEMAIL);
  useEffect(() => {
    const getUser = async () => {
      const u: TVerifyUserResponse = await fetchJson(
        'GET',
        EApiEndpoints.VERIFY,
      );
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
          : user && 'isConfirmed' in user && user.isConfirmed
          ? { ...user, logout }
          : user && 'isConfirmed' in user && !user.isConfirmed
          ? {
              sendConfirmationEmail,
            }
          : authenticationContextMethods
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
