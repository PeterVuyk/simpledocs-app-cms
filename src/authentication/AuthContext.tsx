import React, { useContext, useState, useEffect } from 'react';
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const AuthContext = React.createContext<AuthContextType>(null);

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function AuthProvider({ children }): JSX.Element {
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
