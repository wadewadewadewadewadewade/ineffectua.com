import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Input,
  Toolbar,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { SIGNIN } from '../../graphql/mutations/signin';
import { IUserProjection } from '../../models/users/user';
import { useRouter } from 'next/dist/client/router';

interface IFormData {
  email: string;
  password: string;
  password_confirm: string;
}

interface ISignIn {
  onToggleAuthenticationMode: () => void;
}

export const SignIn: React.FC<ISignIn> = ({ onToggleAuthenticationMode }) => {
  const router = useRouter();
  const [error, setError] = useState<string>(undefined);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: {
      email: '',
      password: '',
      password_confirm: '',
    },
  });
  const [handleSignin] = useMutation(SIGNIN, {
    refetchQueries: ['currentUser'],
    onCompleted: (completed: IUserProjection | false) =>
      completed
        ? router.replace(router.asPath)
        : setError(
            'There was a problem signing you in with that email or password. Please try again.',
          ),
  });
  const onSubmit = async (variables: IFormData) => {
    handleSignin({
      variables,
    });
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <FormControl
            component='fieldset'
            variant='standard'
            error={
              !!errors.email?.message ||
              !!errors.password?.message ||
              !errors.password_confirm?.message
            }
          >
            <FormLabel
              component='legend'
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                fontSize: '1.5em',
                marginBottom: 2,
              }}
            >
              Sign in to an existing account
            </FormLabel>
            <FormGroup>
              <FormControl>
                <FormControlLabel
                  label='Email'
                  labelPlacement='top'
                  sx={{ alignItems: 'flex-start' }}
                  control={
                    <Controller
                      name='email'
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
                          message: 'Please enter a valid email',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          id='email'
                          type='email'
                          autoComplete='email'
                          onFocus={() => error && setError(undefined)}
                          {...field}
                          sx={{ width: '100%' }}
                        />
                      )}
                    />
                  }
                />
                {!!errors.email && (
                  <FormHelperText error>{errors.email?.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormControlLabel
                  label='Password'
                  labelPlacement='top'
                  sx={{ alignItems: 'flex-start' }}
                  control={
                    <Controller
                      name='password'
                      control={control}
                      rules={{
                        required: 'Password is required',
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                          message:
                            'Password must be at least 8 characters and include numbers, symbols (one or more of !@#$%^&*), and upper and lower letters',
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          id='password'
                          type='password'
                          autoComplete='password'
                          onFocus={() => error && setError(undefined)}
                          {...field}
                          sx={{ width: '100%' }}
                        />
                      )}
                    />
                  }
                />
                {!!errors.password && (
                  <FormHelperText error>
                    {errors.password?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </FormGroup>
            {!!error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        </Box>
        <Toolbar
          sx={{ flexGrow: 1, paddingLeft: 2, paddingRight: 2, marginTop: 2 }}
          disableGutters
        >
          <Button
            type='submit'
            variant='contained'
            onClick={handleSubmit(onSubmit)}
          >
            Sign In
          </Button>
          <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>
          <Button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onToggleAuthenticationMode();
            }}
          >
            Create an account
          </Button>
        </Toolbar>
      </form>
    </Box>
  );
};
