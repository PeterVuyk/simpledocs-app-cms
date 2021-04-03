import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from '@material-ui/core';
import RootPage from './pages/RootPage';
import Login from './authentication/Login';

function App() {
  return (
    <Container>
      <Router>
        <Switch>
          <Route exact path="/" component={RootPage} />
          <Route path="/login" component={Login} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
