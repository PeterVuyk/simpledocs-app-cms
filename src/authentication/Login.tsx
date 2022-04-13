import React, { FC, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from './AuthProvider';
import { HOME_PAGE, PASSWORD_RESET_PAGE } from '../navigation/UrlSlugs';
import AlertBox from '../components/AlertBox';
import Copyright from '../components/footer/Copyright';
import useNavigate from '../navigation/useNavigate';
import CMSStatement from '../components/footer/CMSStatement';

const DivPaper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const Login: FC = () => {
  const emailRef = useRef<TextFieldProps>();
  const passwordRef = useRef<TextFieldProps>();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { history } = useNavigate();
  const { currentUser } = useAuth();

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
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <DivPaper>
        <Box sx={{ marginTop: (theme) => theme.spacing(16) }}>
          <img
            style={{ maxWidth: '700px' }}
            src="/simpledocs-logo.svg"
            alt="SimpleDocs"
          />
        </Box>
        <Container component="main" maxWidth="xs">
          {error && <AlertBox severity="error" message={error} />}
          <form noValidate>
            <TextField
              inputRef={emailRef}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Emailadres"
              name="Emailadres"
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
              sx={{ margin: (theme) => theme.spacing(3, 0, 2) }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={onSubmit}
              disabled={loading}
            >
              Inloggen
            </Button>
            <Typography
              align="center"
              style={{ marginBottom: 100, textDecoration: 'underline' }}
            >
              <Link
                href={PASSWORD_RESET_PAGE}
                color="textSecondary"
                variant="body2"
              >
                Wachtwoord vergeten?
              </Link>
            </Typography>
          </form>
        </Container>
      </DivPaper>
      <CMSStatement />
      <Copyright />
    </Container>
  );
};

export default Login;
