import React from 'react';
import { TVerifyUserResponse } from '../../../pages/api/auth';
import { Authentication } from './Authentication';
import { ConfirmEmail } from './ConfirmEmail';

export const RequireAuthentication: React.FC<{ user: TVerifyUserResponse }> = ({
  user,
  children,
}) => {
  if (!children || typeof children === 'boolean') {
    return null;
  }
  if ('isAuthenticated' in user) {
    return <Authentication />;
  }
  if (user.isConfirmed) {
    return <>{children}</>;
  }
  return <ConfirmEmail />;
};
