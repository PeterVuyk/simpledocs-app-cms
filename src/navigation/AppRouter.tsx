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
import EditBrakingDistance from '../pages/calculations/edit/EditBrakingDistance';
import EditReactionPathDistance from '../pages/calculations/edit/EditReactionPathDistance';
import LayoutEditor from '../pages/htmlLayout/LayoutEditor';
import DecisionTreeHtmlFileEditor from '../pages/decisionTree/html/DecisionTreeHtmlFileEditor';
import NotFound from '../pages/NotFound';
import {
  ADD_DECISION_TREE,
  EDIT_CALCULATIONS_BRAKING_DISTANCE,
  EDIT_CALCULATIONS_OVERTAKING_DISTANCE,
  EDIT_CALCULATIONS_REACTION_PATH_DISTANCE,
  EDIT_CALCULATIONS_STOPPING_DISTANCE,
} from './UrlSlugs';

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
            path={EDIT_CALCULATIONS_STOPPING_DISTANCE}
            Component={EditStoppingDistance}
          />
          <PrivateRoute
            exact
            path={EDIT_CALCULATIONS_OVERTAKING_DISTANCE}
            Component={EditOvertakingDistance}
          />
          <PrivateRoute
            exact
            path={EDIT_CALCULATIONS_BRAKING_DISTANCE}
            Component={EditBrakingDistance}
          />
          <PrivateRoute
            exact
            path={EDIT_CALCULATIONS_REACTION_PATH_DISTANCE}
            Component={EditReactionPathDistance}
          />
          <PrivateRoute
            exact
            path="/books/:aggregatePath/add"
            Component={CreateArticle}
          />
          <PrivateRoute
            exact
            path="/html-layout/:htmlFileCategory/add"
            Component={LayoutEditor}
          />
          <PrivateRoute
            exact
            path="/html-layout/:htmlFileCategory/:htmlFileId"
            Component={LayoutEditor}
          />
          <PrivateRoute
            exact
            path={ADD_DECISION_TREE}
            Component={DecisionTreeHtmlFileEditor}
          />
          <PrivateRoute
            exact
            path="/html/decision-tree/:htmlFileId"
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
