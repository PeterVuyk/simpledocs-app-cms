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
import DecisionTreeArtifactEditor from '../pages/decisionTree/artifacts/DecisionTreeArtifactEditor';
import NotFound from '../pages/NotFound';
import useConfiguration from '../configuration/useConfiguration';
import {
  AGGREGATE_CALCULATIONS,
  AGGREGATE_DECISION_TREE,
} from '../model/Aggregate';

const AppRouter: FC = () => {
  const { configuration } = useConfiguration();

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
                  path="/stopping-distance/edit"
                  Component={EditStoppingDistance}
                />
                <PrivateRoute
                  exact
                  path="/overtaking-distance/edit"
                  Component={EditOvertakingDistance}
                />
              </Switch>
            </Route>
          )}
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
          {Object.keys(configuration.menu.menuItems).includes(
            AGGREGATE_DECISION_TREE
          ) && (
            <Route path="/artifacts/decision-tree">
              <Switch>
                <PrivateRoute
                  exact
                  path="/add"
                  Component={DecisionTreeArtifactEditor}
                />
                <PrivateRoute
                  exact
                  path="/:artifactId"
                  Component={DecisionTreeArtifactEditor}
                />
              </Switch>
            </Route>
          )}

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
