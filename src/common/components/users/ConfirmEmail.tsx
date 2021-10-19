import { Button, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import AuthenticationContext from '../../context/AuthenticationContext';

export const ConfirmEmail: React.FC = () => {
  const userContext = useContext(AuthenticationContext);
  const isUserLoading = userContext === true;
  const sendConfirmationEmail =
    userContext !== true && 'sendConfirmationEmail' in userContext
      ? userContext.sendConfirmationEmail
      : undefined;
  const [isSent, setIsSent] = useState(false);
  if (isUserLoading || !sendConfirmationEmail) {
    return null;
  }
  return (
    <>
      <Typography>Please check your email</Typography>
      {!isSent && (
        <Button
          onClick={() => {
            sendConfirmationEmail();
            setIsSent(true);
          }}
        >
          Resend confirmation email
        </Button>
      )}
    </>
  );
};
