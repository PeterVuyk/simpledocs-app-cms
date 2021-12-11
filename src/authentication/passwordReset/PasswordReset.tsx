import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { Link } from '@material-ui/core';
import { useAuth } from '../AuthProvider';
import { HOME_PAGE, LOGIN_PAGE } from '../../navigation/UrlSlugs';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import Copyright from '../../components/Copyright';
import PasswordResetForm from './PasswordResetForm';
import PasswordResetSuccess from './PasswordResetSuccess';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: theme.spacing(16),
  },
}));

const PasswordReset: FC = () => {
  const [resetSuccessful, setResetSuccessful] = useState<boolean>(false);
  const history = useHistory();
  const classes = useStyles();
  const { currentUser } = useAuth();
  const { configuration } = useCmsConfiguration();

  useEffect(() => {
    if (currentUser !== null) {
      history.push(HOME_PAGE);
    }
  }, [currentUser, history]);

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logoContainer}>
          <img src={configuration.cms.logoUrl} style={{ maxWidth: '700px' }} />
        </div>
        <Container component="main" maxWidth="xs">
          {resetSuccessful && <PasswordResetSuccess />}
          {!resetSuccessful && (
            <PasswordResetForm onReset={() => setResetSuccessful(true)} />
          )}
          <Typography
            align="center"
            style={{ marginBottom: 100, textDecoration: 'underline' }}
          >
            <Link href={LOGIN_PAGE} color="textSecondary" variant="body2">
              Terug naar de login pagina
            </Link>
          </Typography>
        </Container>
      </div>
      <Copyright />
    </Container>
  );
};

export default PasswordReset;