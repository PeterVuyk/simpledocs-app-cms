import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import AppRouter from './navigation/AppRouter';
import ConfigurationProvider from './configuration/ConfigurationProvider';
import { store } from './redux/store';
import CookieUserConsent from './components/CookieUserConsent';

const App: FC = () => {
  return (
    <ConfigurationProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CookieUserConsent>
            <AppRouter />
          </CookieUserConsent>
        </Provider>
      </ThemeProvider>
    </ConfigurationProvider>
  );
};

export default App;
