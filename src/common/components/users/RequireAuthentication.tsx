import React from 'react';
import { IUserProjection } from '../../models/users/user';
import { Authentication } from './Authentication';
import { ConfirmEmail } from './ConfirmEmail';

export const RequireAuthentication: React.FC<{
  user: IUserProjection | false;
}> = ({ user, children }) => {
  if (!children || typeof children === 'boolean') {
    return null;
  }
  if (!user) {
    return <Authentication />;
  }
  if (user.isConfirmed) {
    return <>{children}</>;
  }
  return <ConfirmEmail />;
};
