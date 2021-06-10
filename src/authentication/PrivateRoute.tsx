import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface Props {
  Component: any;
  [x: string]: any;
}

const PrivateRoute: React.FC<Props> = ({ Component, ...otherProps }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...otherProps}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default PrivateRoute;
