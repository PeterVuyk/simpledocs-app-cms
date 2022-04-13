import React, { FC, useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../AuthProvider';
import { HOME_PAGE, LOGIN_PAGE } from '../../navigation/UrlSlugs';
import Copyright from '../../components/footer/Copyright';
import PasswordResetForm from './PasswordResetForm';
import PasswordResetSuccess from './PasswordResetSuccess';
import useNavigate from '../../navigation/useNavigate';
import CMSStatement from '../../components/footer/CMSStatement';

const DivPaper = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const PasswordReset: FC = () => {
  const [resetSuccessful, setResetSuccessful] = useState<boolean>(false);
  const { history } = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser !== null) {
      history.push(HOME_PAGE);
    }
  }, [currentUser, history]);

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
      </DivPaper>
      <CMSStatement />
      <Copyright />
    </Container>
  );
};

export default PasswordReset;
