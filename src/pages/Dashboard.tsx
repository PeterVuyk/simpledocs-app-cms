import React from 'react';
import { Grid } from '@material-ui/core';
import Header from '../header/Header';
import RegulationsTable from '../list/RegulationsTable';

function Dashboard(): JSX.Element {
  return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item container>
        <Grid item sm={false} lg={2} />
        <Grid item sm={12} lg={8}>
          <RegulationsTable />
        </Grid>
        <Grid item sm={false} lg={2} />
      </Grid>
    </Grid>
  );
}

export default Dashboard;
