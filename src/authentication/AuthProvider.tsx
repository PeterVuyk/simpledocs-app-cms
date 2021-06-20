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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContextProvider.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContextProvider.Provider>
  );
};
