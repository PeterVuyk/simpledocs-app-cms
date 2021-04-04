import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  component: Component,
  ...rest
}): JSX.Element {
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
