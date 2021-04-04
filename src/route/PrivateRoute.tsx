import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../authentication/context/AuthContext';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function PrivateRoute({ component: Component, ...rest }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}
