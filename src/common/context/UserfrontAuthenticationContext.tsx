import React, { createContext, useEffect, useState } from 'react';
import Userfront from '@userfront/react';
import fetchJson, { EApiEndpoints } from '../utils/fetcher';
import { IUser } from '../models/users/user';

Userfront.init('6nzydpb7');

interface IUserfrontAuthenticationContext {
  signUp: (email: IUser['email'], password: string, username?: IUser['username'], name?: IUser['name']) => Promise<void>;
  signIn: (email: IUser['email'], password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (password: string) => Promise<boolean>;
  sendConfirmationEmail?: () => Promise<void>;
}

export const UserfrontAuthenticationContext = createContext<IUserfrontAuthenticationContext | IUser | undefined>(undefined);
UserfrontAuthenticationContext.displayName = 'UserfrontAuthentication';

export const UserfrontAuthenticationContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState<() => Promise<void> | undefined>(undefined)
  const u: IUser | undefined = Userfront.user;
  const userExists = !!u;
  const { isConfirmed } = u || { isConfirmed: false };
  useEffect(() => {
    if (userExists && isConfirmed && !user) {
      setUser(Userfront.user);
    } else if (userExists) {
      setSendConfirmationEmail(() => {
        return () => Userfront.sendLoginLink(u.email);
      })
    } else {
      setUser(undefined)
    }
  }, [Userfront, userExists, isConfirmed]);
  return (
    <UserfrontAuthenticationContext.Provider value={ user && user.isConfirmed ? user : {
      signUp: async (email: IUser['email'], password: string, username?: IUser['username'], name?: IUser['name']) => {
        const newUser: IUser | string = await fetchJson('POST', EApiEndpoints.USER, undefined, JSON.stringify({
          email,
          password,
          username,
          name
        }), {Authorization: `Bearer ${Userfront.tokens.accessToken}`});
        if (typeof newUser === 'string') {
          console.error(newUser);
        } else {
          setUser(newUser);
        }
      },
      signIn: async (email: IUser['email'], password: string) => {
        const newUser = await Userfront.login({
          method: "password",
          email,
          password,
        });
        if (newUser) {
          setUser(newUser);
        }
      },
      logout: async () => {
        await Userfront.logout();
        setUser(undefined);
      },
      resetPassword: async (password: string) => Userfront.resetPassword({ password }),
      sendConfirmationEmail
    }}>
      {children}
    </UserfrontAuthenticationContext.Provider>
  )
};

export default UserfrontAuthenticationContext;
