import React, { FC } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useCmsConfiguration from '../configuration/useCmsConfiguration';

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
  const { configuration } = useCmsConfiguration();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.container}>
        <img src={configuration.cms.logoUrl} />
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
