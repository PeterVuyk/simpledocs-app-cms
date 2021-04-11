import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import configureStore from './redux/configureStore';
import Login from './authentication/Login';
import { AuthProvider } from './authentication/AuthProvider';
import PrivateRoute from './authentication/PrivateRoute';
import CreateRegulation from './pages/CreateRegulation';
import SnackbarNotification from './components/SnackbarNotification';
import theme from './theme';
import RegulationsList from './pages/regulationList/RegulationsList';

const store = configureStore();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AuthProvider>
          <SnackbarNotification />
          <Router>
            <Switch>
              <PrivateRoute exact path="/" component={RegulationsList} />
              <PrivateRoute
                exact
                path="/regulations/add"
                component={CreateRegulation}
              />
              <Route path="/login" component={Login} />
            </Switch>
          </Router>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
