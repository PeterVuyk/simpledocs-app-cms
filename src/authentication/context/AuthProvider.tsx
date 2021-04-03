import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth } from '../../firebase/firebaseConnection';

// TODO: inlezen over context

// const AuthContext = React.createContext();
//
// export function useAuth() {
//   return useContext(AuthContext);
// }
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AuthProvider({ children }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();

  // function signUp(email: any, password: any) {
  //   return auth.createUserWithEmailAndPassword(email, password);
  // }
  //
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setCurrentUser(user);
  //   });
  //   return unsubscribe;
  // }, []);
  //
  // const value = {
  //   currentUser,
  //   signUp,
  // };
  //
  // return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  return <></>;
}

export default AuthProvider;
