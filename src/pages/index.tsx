import React from 'react';
import { useRouter } from 'next/dist/client/router';
import AddPost from '../common/components/posts/AddPost';
import { IPostWithReplies } from '../common/types/IPost';
import fetchJson, { EApiEndpoints } from '../common/utils/fetcher';
import styles from '../styles/pages/index.module.scss';
import { Authentication } from '../common/components/users/Authentication';
import { ConfirmEmail } from '../common/components/users/ConfirmEmail';
import { GetServerSideProps } from 'next';
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { TVerifyUserResponse } from './api/auth';

type THeaders = [string, string];

export const getServerSideProps: GetServerSideProps = async context => {
  const isHeaders = (obj: [key: string, val: string]): obj is THeaders =>
    typeof obj[1] === 'string';
  const contextHeadersArray: THeaders[] = Object.entries(
    context.req.headers,
  ).filter(isHeaders);
  const contextHeaders: Record<string, string> = contextHeadersArray.reduce(
    (acc, obj) => ({ ...acc, [obj[0]]: obj[1] }),
    {},
  );
  const user: TVerifyUserResponse = await fetchJson(
    'GET',
    EApiEndpoints.VERIFY,
    undefined,
    undefined,
    {
      ...contextHeaders,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  );
  const posts = await fetchJson('GET', EApiEndpoints.POSTS);
  return {
    props: {
      posts,
      user,
      fallback: 'blocking',
      revalidate: 1,
    },
  };
};

export default function Home({
  posts,
  user,
}: {
  posts: IPostWithReplies[];
  user: TVerifyUserResponse;
}) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const isAuthenticated = 'isAuthenticated' in user ? false : true;
  return (
    <div className={styles.container}>
      <AppBar>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Posts
          </Typography>
          {isAuthenticated && (
            <div>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={async () => {
                    handleClose();
                    await fetchJson('GET', EApiEndpoints.SIGNOUT);
                    window.location.href = '/';
                  }}
                >
                  Sign out
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <main className={styles.main}>
        <h1 className='title'>
          Welcome to <a href='https://nextjs.org'>Next.js with MongoDB!</a>
        </h1>
        {'isAuthenticated' in user ? (
          <Authentication />
        ) : user.isConfirmed ? (
          <>
            <h2 className='subtitle'>Posts</h2>
            <AddPost
              onPost={() => {
                router.replace(router.asPath);
              }}
              replies={posts}
            />
          </>
        ) : (
          <ConfirmEmail />
        )}
      </main>

      <footer className={styles.footer}>
        <a href='https://vercel.com' target='_blank' rel='noopener noreferrer'>
          Powered by{' '}
          <img src='/vercel.svg' alt='Vercel Logo' className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
