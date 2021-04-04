import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@material-ui/core';
import Dashboard from './pages/Dashboard';
import Login from './authentication/Login';
import { AuthProvider } from './authentication/AuthContext';
import PrivateRoute from './authentication/PrivateRoute';

function App(): JSX.Element {
  return (
    <Container>
      <AuthProvider>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
          </Switch>
        </Router>
      </AuthProvider>
    </Container>
  );
}

export default App;
