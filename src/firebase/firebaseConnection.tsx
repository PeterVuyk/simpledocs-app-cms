import firebase from 'firebase/app';
// import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

// /**
//  * Due to a bug in the firebase library, a global import for 'base-64' is required.
//  * I put the global import here so we know it's related to firestore and can be
//  * removed later when the bug in the library is resolved and it can be removed.
//  */
// if (!global.btoa) {
//   global.btoa = base64.encode;
// }
//
// if (!global.atob) {
//   global.atob = base64.decode;
// }

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const firebaseConnection = firebase.initializeApp(firebaseConfig);

// const firebaseConnection = () => {
//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
//   return firebase.firestore();
// };

export const auth = firebaseConnection.auth();
export default firebaseConnection;
