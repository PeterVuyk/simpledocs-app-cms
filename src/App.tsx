import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './authentication/Login';
import { AuthProvider } from './authentication/AuthContext';
import PrivateRoute from './authentication/PrivateRoute';
import CreateRegulation from './pages/CreateRegulation';

function App(): JSX.Element {
  return (
    <AuthProvider>
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
  );
}

export default App;
