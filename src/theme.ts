import { createTheme } from '@mui/material/styles';

const cmsTheme = createTheme({
  palette: {
    primary: {
      light: '#5E8AC7',
      main: '#175BA0',
      dark: '#052b69',
    },
    secondary: {
      light: '#ff3333',
      main: '#ff0000',
      dark: '#b20000',
    },
  },
  zIndex: {
    drawer: 1100,
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 3,
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

const theme = {
  ...cmsTheme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#18202c',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          '& > *:not(:last-child)': {
            marginRight: cmsTheme.spacing(1),
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: cmsTheme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: cmsTheme.palette.common.white,
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [cmsTheme.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        width: '100%',
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: cmsTheme.spacing(1),
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#404854',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 500,
          fontSize: '0.86rem',
          lineHeight: 1.5,
          letterSpacing: 0.009,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        paddingTop: 1,
        paddingBottom: 1,
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover,&:focus': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          marginLeft: 5,
        },
      },
    },
  },
};

export default theme;
