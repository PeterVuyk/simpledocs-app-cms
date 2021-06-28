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
import Navigation from '../pages/navigation/Navigation';
import EditStoppingDistance from '../pages/calculations/edit/EditStoppingDistance';
import EditOvertakingDistance from '../pages/calculations/edit/EditOvertakingDistance';
import CreateArticle from '../pages/articles/CreateArticle';
import EditArticle from '../pages/articles/EditArticle';
import EditBrakingDistance from '../pages/calculations/edit/EditBrakingDistance';
import EditReactionPathDistance from '../pages/calculations/edit/EditReactionPathDistance';
import DecisionTreeHtmlFileEditor from '../pages/decisionTree/DecisionTreeHtmlFileEditor';

const AppRouter: FC = () => {
  return (
    <AuthProvider>
      <SnackbarNotification />
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect exact from="/" to="/article/instruction-manual" />
          <PrivateRoute
            exact
            path="/article/:page?"
            Component={(props: any) => (
              <Navigation gridWidth="default" {...props} />
            )}
          />
          <PrivateRoute
            exact
            path="/:page?"
            Component={(props: any) => (
              <Navigation gridWidth="default" {...props} />
            )}
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
            path="/calculations/braking-distance/edit"
            Component={EditBrakingDistance}
          />
          <PrivateRoute
            exact
            path="/calculations/reaction-path-distance/edit"
            Component={EditReactionPathDistance}
          />
          <PrivateRoute
            exact
            path="/article/:aggregatePath/add"
            Component={CreateArticle}
          />
          <PrivateRoute
            exact
            path="/decision-tree/html/add"
            Component={DecisionTreeHtmlFileEditor}
          />
          <PrivateRoute
            exact
            path="/decision-tree/html/:htmlFileId"
            Component={DecisionTreeHtmlFileEditor}
          />
          <PrivateRoute
            exact
            path="/article/:aggregatePath/:articleId"
            Component={EditArticle}
          />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
