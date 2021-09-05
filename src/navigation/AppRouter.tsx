import React, { FC } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Login from '../authentication/Login';
import { AuthProvider } from '../authentication/AuthProvider';
import PrivateRoute from '../authentication/PrivateRoute';
import SnackbarNotification from '../components/SnackbarNotification';
import Navigation from './Navigation';
import EditStoppingDistance from '../pages/calculations/edit/EditStoppingDistance';
import EditOvertakingDistance from '../pages/calculations/edit/EditOvertakingDistance';
import CreateArticle from '../pages/articles/CreateArticle';
import EditArticle from '../pages/articles/EditArticle';
import StyleEditor from '../pages/styleguide/StyleEditor';
import DecisionTreeHtmlFileEditor from '../pages/decisionTree/html/DecisionTreeHtmlFileEditor';
import NotFound from '../pages/NotFound';

const AppRouter: FC = () => {
  return (
    <AuthProvider>
      <SnackbarNotification />
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect exact from="/" to="/books/instruction-manual" />
          <PrivateRoute
            exact
            path="/books/:page?"
            Component={(props: any) => <Navigation {...props} />}
          />
          <PrivateRoute
            exact
            path="/:page?"
            Component={(props: any) => <Navigation {...props} />}
          />
          <PrivateRoute
            exact
            path="/calculations/stopping-distance/edit"
            Component={EditStoppingDistance}
          />
          <PrivateRoute
            exact
            path="/calculations/overtaking-distance/edit"
            Component={EditOvertakingDistance}
          />
          <PrivateRoute
            exact
            path="/books/:aggregatePath/add"
            Component={CreateArticle}
          />
          <PrivateRoute
            exact
            path="/styleguide/:artifactType/add"
            Component={StyleEditor}
          />
          <PrivateRoute
            exact
            path="/styleguide/:artifactType/:artifactId"
            Component={StyleEditor}
          />
          <PrivateRoute
            exact
            path="/html/decision-tree/add"
            Component={DecisionTreeHtmlFileEditor}
          />
          <PrivateRoute
            exact
            path="/html/decision-tree/:artifactId"
            Component={DecisionTreeHtmlFileEditor}
          />
          <PrivateRoute
            exact
            path="/books/:aggregatePath/:articleId"
            Component={EditArticle}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
