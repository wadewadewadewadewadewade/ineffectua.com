import React, { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

export const Authentication: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  return isSignUp ? <SignUp onToggleAuthenticationMode={() => setIsSignUp(false)} /> : <SignIn onToggleAuthenticationMode={() => setIsSignUp(true)} />
}