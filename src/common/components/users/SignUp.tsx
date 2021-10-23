import { useMutation } from '@apollo/client';
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
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { SIGNUP } from '../../graphql/mutations/signup';
import { ICreateUserUser } from '../../graphql/resolvers/mutations/signup';

interface IFormData extends ICreateUserUser {
  password_confirm: string;
}

interface ISignUp {
  onToggleAuthenticationMode: () => void;
}

export const SignUp: React.FC<ISignUp> = ({ onToggleAuthenticationMode }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<IFormData>({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      password_confirm: '',
    },
  });
  const [handleSignup] = useMutation(SIGNUP, {
    refetchQueries: ['currentUser'],
  });
  const passwordConfirm = watch('password_confirm');
  const onSubmit = async (variables: IFormData) => {
    if (variables.password === variables.password_confirm) {
      handleSignup({ variables });
    }
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
              Create an account
            </FormLabel>
            <FormGroup>
              <FormControl>
                <FormControlLabel
                  label='Name'
                  labelPlacement='top'
                  sx={{ alignItems: 'flex-start' }}
                  control={
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <Input
                          id='name'
                          type='text'
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
                  label='Username'
                  labelPlacement='top'
                  sx={{ alignItems: 'flex-start' }}
                  control={
                    <Controller
                      name='username'
                      control={control}
                      rules={{
                        required:
                          "A username is required - we dont' want to expose your email address unless you want us to",
                      }}
                      render={({ field }) => (
                        <Input
                          id='username'
                          type='text'
                          autoComplete='username'
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
                          autoComplete='new-password'
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
              <FormControl>
                <FormControlLabel
                  label='Password Confirm'
                  labelPlacement='top'
                  sx={{ alignItems: 'flex-start' }}
                  control={
                    <Controller
                      name='password_confirm'
                      control={control}
                      rules={{
                        required: 'Password Confirmation is required',
                        validate: value =>
                          value === passwordConfirm ||
                          'Password and Password Confirm values do not match',
                      }}
                      render={({ field }) => (
                        <Input
                          id='password_confirm'
                          type='password'
                          {...field}
                          sx={{ width: '100%' }}
                        />
                      )}
                    />
                  }
                />
                {!!errors.password_confirm && (
                  <FormHelperText error>
                    {errors.password_confirm?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </FormGroup>
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
            Sign Up
          </Button>
          <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>
          <Button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onToggleAuthenticationMode();
            }}
          >
            Sign in to an existing account
          </Button>
        </Toolbar>
      </form>
    </Box>
  );
};
