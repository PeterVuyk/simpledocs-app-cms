import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/functions';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

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

// Below works, but due to a bug it could break by a future update of firebase. In that case read: https://github.com/firebase/firebase-tools/issues/3519#issuecomment-865173539
if (
  process.env.NODE_ENV === 'development' &&
  process.env.USE_LOCAL_FUNCTIONS === 'true'
) {
  firebase.app().functions('europe-west3').useEmulator('localhost', 5001);
}
export const functions = firebase.app().functions('europe-west3');

export const auth = firebaseConnection.auth();
export const database = firebaseConnection.firestore();
export const storage = firebaseConnection.storage();
export default firebaseConnection;
