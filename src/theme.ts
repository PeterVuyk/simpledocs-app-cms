import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#0091ea',
      main: '#154594',
      dark: '#052b69',
    },
    secondary: {
      light: '#ff3333',
      main: '#ff0000',
      dark: '#b20000',
    },
  },
  typography: {
    fontFamily: 'arial',
  },
  shape: {
    borderRadius: 0,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
    },
  },
});

export default theme;
