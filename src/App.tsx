import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import configureStore from './redux/configureStore';
import Login from './authentication/Login';
import { AuthProvider } from './authentication/AuthProvider';
import PrivateRoute from './authentication/PrivateRoute';
import CreateRegulation from './pages/regulations/CreateRegulation';
import SnackbarNotification from './components/SnackbarNotification';
import theme from './theme';
import EditRegulation from './pages/regulations/EditRegulation';
import Publications from './pages/publications/Publications';
import Navigation from './pages/Navigation';
import DecisionTree from './pages/decisionTree/DecisionTree';
import BreakingDistance from './pages/breakingDistance/BreakingDistance';

const store = configureStore();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AuthProvider>
          <SnackbarNotification />
          <Router>
            <Switch>
              <Route path="/login" component={Login} />
              <Redirect exact from="/" to="/regulations" />
              <PrivateRoute
                exact
                path="/:page?"
                component={(props: any) => <Navigation {...props} />}
              />
              <PrivateRoute
                exact
                path="/publications"
                component={Publications}
              />
              <PrivateRoute
                exact
                path="/breaking-distance"
                component={BreakingDistance}
              />
              <PrivateRoute
                exact
                path="/decision-tree"
                component={DecisionTree}
              />
              <PrivateRoute
                exact
                path="/regulations/add"
                component={CreateRegulation}
              />
              <PrivateRoute
                exact
                path="/:regulations/:regulationId"
                component={EditRegulation}
              />
            </Switch>
          </Router>
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
