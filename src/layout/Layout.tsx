import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from '../header/Header';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const classes = useStyles();

  return (
    <Grid spacing={0} container direction="column">
      <Grid item container>
        <Header />
      </Grid>
      <Grid item container>
        <Grid item sm={false} lg={2} />
        <Grid item sm={12} lg={8}>
          <div className={classes.paper}>{children}</div>
        </Grid>
        <Grid item sm={false} lg={2} />
      </Grid>
    </Grid>
  );
};

export default Layout;
