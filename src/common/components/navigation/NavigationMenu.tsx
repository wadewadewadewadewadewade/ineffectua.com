import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  MenuItemTypeMap,
  PopoverOrigin,
  SvgIconTypeMap,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface INavigationMenu {
  Icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>> & {
    muiName: string;
  };
  name: string;
  label: string;
  transformOrigin?: PopoverOrigin;
  menuItems: INavigationMenuItem[];
}

export interface INavigationMenuItem {
  name: React.Key;
  onClose?: () => Promise<void>;
  children: JSX.Element;
  selected?: MenuItemTypeMap['props']['selected'];
}

export const NavigationMenu: React.FC<INavigationMenu> = ({
  Icon,
  name,
  label,
  transformOrigin,
  menuItems,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size='large'
        aria-label={label}
        aria-controls={name}
        aria-haspopup='true'
        onClick={handleMenu}
        color='inherit'
      >
        <Icon />
      </IconButton>
      <Menu
        id={name}
        anchorEl={anchorEl}
        anchorOrigin={transformOrigin}
        keepMounted
        transformOrigin={transformOrigin}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map(menuItem => (
          <MenuItem
            key={menuItem.name}
            onClick={async () => {
              handleClose();
              menuItem.onClose && (await menuItem.onClose());
            }}
            selected={menuItem.selected}
          >
            {menuItem.children}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NavigationMenu;
