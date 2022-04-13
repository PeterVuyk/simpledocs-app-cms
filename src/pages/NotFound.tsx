import React, { FC } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const NotFound: FC = () => {
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box sx={{ marginTop: (theme) => theme.spacing(24) }}>
        <img
          style={{ maxWidth: '700px', margin: 'auto', display: 'block' }}
          src="/simpledocs-logo.svg"
          alt="SimpleDocs"
        />
        <Box sx={{ marginTop: (theme) => theme.spacing(8) }}>
          <Typography align="center" variant="h1">
            404
          </Typography>
          <Typography align="center" variant="h5">
            Oeps, pagina niet gevonden.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
