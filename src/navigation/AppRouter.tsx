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
import CreatePage from '../pages/bookPages/CreatePage';
import EditPage from '../pages/bookPages/EditPage';
import StyleEditor from '../pages/styleguide/StyleEditor';
import DecisionTreeArtifactEditor from '../pages/decisionTree/artifacts/DecisionTreeArtifactEditor';
import NotFound from '../pages/NotFound';
import useCmsConfiguration from '../configuration/useCmsConfiguration';
import {
  AGGREGATE_CALCULATIONS,
  AGGREGATE_DECISION_TREE,
} from '../model/Aggregate';
import PasswordReset from '../authentication/passwordReset/PasswordReset';

const AppRouter: FC = () => {
  const { configuration } = useCmsConfiguration();

  const getDefaultRedirectUrl = () => {
    const { urlSlug } = Object.entries(configuration.books.bookItems).sort(
      (a, b) => a[1].navigationIndex - b[1].navigationIndex
    )[0][1];
    return `/books/${urlSlug}`;
  };

  return (
    <AuthProvider>
      <SnackbarNotification />
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/password-reset" component={PasswordReset} />
          <Redirect exact from="/" to={getDefaultRedirectUrl()} />
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
          {Object.keys(configuration.menu.menuItems).includes(
            AGGREGATE_CALCULATIONS
          ) && (
            <Route path="/calculations">
              <Switch>
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
              </Switch>
            </Route>
          )}
          <PrivateRoute
            exact
            path="/books/:aggregatePath/add"
            Component={CreatePage}
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
          {Object.keys(configuration.menu.menuItems).includes(
            AGGREGATE_DECISION_TREE
          ) && (
            <Route path="/artifacts">
              <Switch>
                <PrivateRoute
                  exact
                  path="/artifacts/decision-tree/add"
                  Component={DecisionTreeArtifactEditor}
                />
                <PrivateRoute
                  exact
                  path="/artifacts/decision-tree/:artifactId"
                  Component={DecisionTreeArtifactEditor}
                />
              </Switch>
            </Route>
          )}
          <PrivateRoute
            exact
            path="/books/:aggregatePath/:bookPageId"
            Component={EditPage}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
