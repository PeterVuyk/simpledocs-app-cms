import React, { useContext, useState, useEffect, ReactNode, FC } from 'react';
import firebase from 'firebase/app';
import { auth } from '../firebase/firebaseConnection';

export type AuthContextType = {
  currentUser: firebase.User | null | undefined;
  login: (
    email: string,
    password: string
  ) => Promise<firebase.auth.UserCredential>;
  logout: () => Promise<void>;
};

// @ts-ignore
const AuthContextProvider = React.createContext<AuthContextType>(null);

export function useAuth(): AuthContextType {
  return useContext(AuthContextProvider);
}

interface Props {
  children: ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();
  const [loading, setLoading] = useState(true);

  function login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout(): Promise<void> {
    return auth.signOut();
  }

  function getMillisecondsUntilMidnight() {
    const midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    return midnight.getTime() - new Date().getTime();
  }

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user !== null) {
        user.getIdTokenResult().then((idTokenResult) => {
          const authTime = idTokenResult.claims.auth_time * 1000;
          const sessionDuration = getMillisecondsUntilMidnight();
          const millisecondsUntilExpiration =
            sessionDuration - (Date.now() - authTime);
          setTimeout(() => auth.signOut(), millisecondsUntilExpiration);
        });
      }
    });
  }, []);

  return (
    <AuthContextProvider.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContextProvider.Provider>
  );
};
