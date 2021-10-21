import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Link as UILink } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import CottageIcon from '@mui/icons-material/Cottage';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AuthenticationContext from '../../context/AuthenticationContext';
import { Logout } from '@mui/icons-material';
import NavigationMenu from './NavigationMenu';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';

const siteMenu = [
  {
    name: 'home',
    path: '/',
    children: (
      <Link href='/'>
        <UILink sx={{ textDecoration: 'none', display: 'flex' }}>
          <CottageIcon sx={{ marginRight: 1 }} />
          Home
        </UILink>
      </Link>
    ),
  },
  {
    name: 'posts',
    path: '/posts',
    children: (
      <Link href='/posts'>
        <UILink sx={{ textDecoration: 'none', display: 'flex' }}>
          <PostAddIcon sx={{ marginRight: 1 }} />
          Posts
        </UILink>
      </Link>
    ),
  },
];

export const SiteAppBar: React.FC = () => {
  const { asPath } = useRouter();
  const authentication = useContext(AuthenticationContext);
  // isUserLoading
  if (authentication === true) {
    return null;
  }
  const isAuthenticated = typeof authentication !== 'boolean';
  const signout =
    typeof authentication !== 'boolean' && 'signout' in authentication
      ? authentication.signout
      : undefined;
  return (
    <AppBar>
      <Toolbar>
        <NavigationMenu
          name='menu-appbar-navigation'
          label='site navigation'
          Icon={MenuIcon}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          menuItems={siteMenu.map(item => ({
            ...item,
            selected: item.path === asPath,
          }))}
        />
        <Typography
          variant='h1'
          component='div'
          sx={{ flexGrow: 1, textTransform: 'capitalize', fontSize: '1.5rem' }}
        >
          {siteMenu.find(item => item.path === asPath)?.name}
        </Typography>
        {isAuthenticated && (
          <NavigationMenu
            name='menu-appbar-user'
            label='account of current user'
            Icon={AccountCircle}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            menuItems={[
              {
                name: 'signout',
                onClose: signout,
                children: (
                  <>
                    <Logout sx={{ marginRight: 1 }} />
                    Sign out
                  </>
                ),
              },
            ]}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default SiteAppBar;
