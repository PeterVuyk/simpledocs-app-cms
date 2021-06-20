import React, { FC, ReactNode, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../authentication/AuthProvider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  headerItem: {
    flexGrow: 1,
  },
}));

interface Props {
  children: ReactNode;
}

const Header: FC<Props> = ({ children }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, logout } = useAuth();
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleProfileMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(null);
  };
  async function handleLogout() {
    setAnchorEl(null);
    await logout();
    history.push('/login');
  }

  return (
    <div className={classes.root}>
      <AppBar elevation={0} position="fixed">
        <Toolbar>
          <Typography variant="h6" className={classes.headerItem}>
            AZN App CMS
          </Typography>
          <div className={classes.headerItem}>{children}</div>
          {currentUser !== null && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenu}
                color="inherit"
              >
                <Typography variant="body2" className={classes.headerItem}>
                  {currentUser?.email}&nbsp;
                </Typography>
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
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
                open={open}
                onClose={handleCloseProfile}
              >
                <MenuItem onClick={handleLogout}>Uitloggen</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
