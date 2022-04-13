import React, { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { Box } from '@mui/material';
import UserProfile from './UserProfile';
import Copyright from '../footer/Copyright';
import CMSStatement from '../footer/CMSStatement';

interface HeaderProps {
  onDrawerToggle: () => void;
  children: ReactNode;
}

function Header(props: HeaderProps) {
  const { onDrawerToggle, children } = props;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  onClick={onDrawerToggle}
                  sx={{ marginLeft: (theme) => -theme.spacing(1) }}
                  size="large"
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            <Grid item>
              <UserProfile />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flex: 1,
          padding: (theme) => theme.spacing(0, 4),
          background: '#fff',
        }}
      >
        {children}
      </Box>
      <Box sx={{ padding: (theme) => theme.spacing(2), background: '#fff' }}>
        <CMSStatement />
        <Copyright />
      </Box>
    </div>
  );
}

export default Header;
