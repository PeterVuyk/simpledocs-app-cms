import React, { FC, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useAuth } from './AuthProvider';
import { HOME_PAGE } from '../navigation/UrlSlugs';
import useCmsConfiguration from '../configuration/useCmsConfiguration';
import AlertBox from '../components/AlertBox';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    marginTop: theme.spacing(16),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login: FC = () => {
  const emailRef = useRef<TextFieldProps>();
  const passwordRef = useRef<TextFieldProps>();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const { currentUser } = useAuth();
  const { configuration } = useCmsConfiguration();

  useEffect(() => {
    if (currentUser !== null) {
      history.push(HOME_PAGE);
    }
  }, [currentUser, history]);

  async function onSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(
        emailRef?.current?.value as string,
        passwordRef?.current?.value as string
      );
    } catch {
      setError(
        'Login mislukt, gebruikersnaam en wachtwoord komt niet overeen.'
      );
    }
    setLoading(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.logo}>
        <img src={configuration.cms.logoUrl} />
      </div>
      <div className={classes.paper}>
        {error && <AlertBox severity="error" message={error} />}
        <form className={classes.form} noValidate>
          <TextField
            inputRef={emailRef}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mailadres"
            name="E-mailadres"
            autoComplete="email"
            autoFocus
          />
          <TextField
            inputRef={passwordRef}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="Wachtwoord"
            label="Wachtwoord"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
            disabled={loading}
          >
            Inloggen
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
