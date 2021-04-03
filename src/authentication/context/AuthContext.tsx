import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth } from '../../firebase/firebaseConnection';

const AuthContext = React.createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<firebase.User>();
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
      if (user === null) {
        return;
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
