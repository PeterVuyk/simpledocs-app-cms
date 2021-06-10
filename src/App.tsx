import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import configureStore from './redux/configureStore';
import theme from './theme';
import AppRouter from './route/AppRouter';

const store = configureStore();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
