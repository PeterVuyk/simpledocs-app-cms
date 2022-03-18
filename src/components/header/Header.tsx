import React, { ReactNode } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import UserProfile from './UserProfile';
import Copyright from '../footer/Copyright';
import Disclaimer from '../footer/Disclaimer';
import CMSStatement from '../footer/CMSStatement';

const styles = (theme: Theme) =>
  createStyles({
    menuButton: {
      marginLeft: -theme.spacing(1),
    },
    app: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    main: {
      flex: 1,
      padding: theme.spacing(0, 4),
      background: '#fff',
    },
    footer: {
      padding: theme.spacing(2),
      background: '#fff',
    },
  });

interface HeaderProps extends WithStyles<typeof styles> {
  onDrawerToggle: () => void;
  children: ReactNode;
}

function Header(props: HeaderProps) {
  const { classes, onDrawerToggle, children } = props;

  return (
    <div className={classes.app}>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
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
      <main className={classes.main}>{children}</main>
      <footer className={classes.footer}>
        <CMSStatement />
        <Copyright />
      </footer>
    </div>
  );
}

export default withStyles(styles)(Header);
