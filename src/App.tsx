import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import configureStore from './redux/configureStore';
import theme from './theme';
import AppRouter from './navigation/AppRouter';
import ConfigurationProvider from './configuration/ConfigurationProvider';

const store = configureStore();

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
