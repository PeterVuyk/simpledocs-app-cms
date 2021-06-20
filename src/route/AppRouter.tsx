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
import Publications from '../pages/publications/Publications';
import Navigation from '../pages/navigation/Navigation';
import DecisionTree from '../pages/decisionTree/DecisionTree';
import Calculations from '../pages/calculations/Calculations';
import EditBreakingDistance from '../pages/calculations/edit/EditBreakingDistance';
import EditOvertakingDistance from '../pages/calculations/edit/EditOvertakingDistance';
import Articles from '../pages/articles/list/Articles';
import CreateArticle from '../pages/articles/CreateArticle';
import EditArticle from '../pages/articles/EditArticle';
import { ARTICLE_TYPE_REGULATIONS } from '../model/ArticleType';

const AppRouter: FC = () => {
  return (
    <AuthProvider>
      <SnackbarNotification />
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect exact from="/" to="/regulations" />
          <PrivateRoute
            exact
            path="/:page?"
            Component={(props: any) => (
              <Navigation gridWidth="default" {...props} />
            )}
          />
          <PrivateRoute exact path="/publications" Component={Publications} />
          <PrivateRoute exact path="/instruction-manual" Component={Articles} />
          <PrivateRoute exact path="/calculations" Component={Calculations} />
          <PrivateRoute
            exact
            path="/calculations/breaking-distance/edit"
            Component={EditBreakingDistance}
          />
          <PrivateRoute
            exact
            path="/calculations/overtaking-distance/edit"
            Component={EditOvertakingDistance}
          />
          <PrivateRoute exact path="/decision-tree" Component={DecisionTree} />
          <PrivateRoute
            exact
            path="/:regulations/:articleId"
            Component={EditArticle}
            articleType={ARTICLE_TYPE_REGULATIONS}
          />
          <PrivateRoute
            exact
            path="/article/:aggregatePath/add"
            Component={CreateArticle}
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
