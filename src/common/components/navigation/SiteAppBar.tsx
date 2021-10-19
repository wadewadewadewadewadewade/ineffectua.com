import React, { useContext } from 'react';
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
import AuthenticationContext from '../../context/AuthenticationContext';
import { Logout } from '@mui/icons-material';

export const SiteAppBar: React.FC<{ title: string }> = ({ title }) => {
  const authentication = useContext(AuthenticationContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (authentication === true) {
    return null;
  }
  const isAuthenticated = 'isAuthenticated' in authentication ? false : true;
  const logout = 'logout' in authentication ? authentication.logout : undefined;
  return (
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
          {title}
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
                  await logout();
                }}
              >
                <Logout />
                Sign out
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default SiteAppBar;
