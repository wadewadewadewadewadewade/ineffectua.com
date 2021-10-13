import { Link } from '@mui/material';
import React from 'react';

export const Authentication: React.FC = () => (
    <>
      <Link href="/api/auth/login">Login</Link>
      {' or '}
      <Link href="/api/signup">Sign Up</Link>
    </>
)