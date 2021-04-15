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
    h6: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 0,
  },
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#052b69',
      },
    },
    MuiTabs: {
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: '#eaeff1',
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
});

export default theme;
