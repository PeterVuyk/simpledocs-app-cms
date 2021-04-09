import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import configureStore from './redux/configureStore';
import Dashboard from './pages/Dashboard';
import Login from './authentication/Login';
import { AuthProvider } from './authentication/AuthProvider';
import PrivateRoute from './authentication/PrivateRoute';
import CreateRegulation from './pages/CreateRegulation';
import SnackbarNotification from './component/SnackbarNotification';

const store = configureStore();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SnackbarNotification />
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
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
  );
};

export default App;
