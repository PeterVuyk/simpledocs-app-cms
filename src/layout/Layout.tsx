import React from 'react';
import { Grid } from '@material-ui/core';
import Header from '../header/Header';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function Layout({ children }): JSX.Element {
  return (
    <Grid spacing={8} container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item container>
        <Grid item sm={false} lg={2} />
        <Grid item sm={12} lg={8}>
          {children}
        </Grid>
        <Grid item sm={false} lg={2} />
      </Grid>
    </Grid>
  );
}

export default Layout;
