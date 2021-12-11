import React, { FC, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../authentication/AuthProvider';
import { LOGIN_PAGE, USERS_PAGE } from '../../navigation/UrlSlugs';
import UpdatePasswordDialog from '../../authentication/UpdatePasswordDialog';

const useStyles = makeStyles(() => ({
  headerItem: {
    flexGrow: 1,
  },
}));

const UserProfile: FC = () => {
  const [showUpdatePasswordDialog, setShowUpdatePasswordDialog] =
    useState<boolean>(false);
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
    history.push(LOGIN_PAGE);
  }

  return (
    <>
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
            <MenuItem onClick={() => history.push(USERS_PAGE)}>
              Gebruikers
            </MenuItem>
            <MenuItem onClick={() => setShowUpdatePasswordDialog(true)}>
              Wachtwoord wijzigen
            </MenuItem>
            <MenuItem onClick={handleLogout}>Uitloggen</MenuItem>
          </Menu>
          {showUpdatePasswordDialog && (
            <UpdatePasswordDialog
              oncloseDialog={() => {
                setShowUpdatePasswordDialog(false);
                setAnchorEl(null);
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

export default UserProfile;
