import React, { FC } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(24),
  },
  notFoundContainer: {
    marginTop: theme.spacing(8),
  },
}));

const NotFound: FC = () => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <img src="https://firebasestorage.googleapis.com/v0/b/ambulancezorg-app.appspot.com/o/app-management%2Fazn-logo.svg?alt=media&token=1b2f7054-4df9-49c6-b733-54a7d1d3ec2f" />
        <div className={classes.notFoundContainer}>
          <Typography align="center" variant="h1">
            404
          </Typography>
          <Typography align="center" variant="h5">
            Oeps, pagina niet gevonden.
          </Typography>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
