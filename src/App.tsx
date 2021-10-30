import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import AppRouter from './navigation/AppRouter';
import ConfigurationProvider from './configuration/ConfigurationProvider';
import { store } from './redux/store';

const App: FC = () => {
  return (
    <ConfigurationProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AppRouter />
        </Provider>
      </ThemeProvider>
    </ConfigurationProvider>
  );
};

export default App;
