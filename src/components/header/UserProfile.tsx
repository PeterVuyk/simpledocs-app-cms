import React, { FC, useState } from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../../authentication/AuthProvider';
import { LOGIN_PAGE, USERS_PAGE } from '../../navigation/UrlSlugs';
import UpdatePasswordDialog from '../../authentication/UpdatePasswordDialog';
import useNavigate from '../../navigation/useNavigate';

const UserProfile: FC = () => {
  const [showUpdatePasswordDialog, setShowUpdatePasswordDialog] =
    useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, logout } = useAuth();
  const open = Boolean(anchorEl);
  const { history, navigate } = useNavigate();

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
          <IconButton onClick={handleProfileMenu} color="inherit" size="large">
            <Typography variant="body2" style={{ flexGrow: 1 }}>
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
            <MenuItem onClick={(e) => navigate(e, USERS_PAGE)}>
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
