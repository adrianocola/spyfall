import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/database';
import 'firebase/auth';
import env from 'env';

const config = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: `${env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: env.FIREBASE_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};
firebase.initializeApp(config);

export const database = firebase.database();
export const auth = firebase.auth();
export const analytics = firebase.analytics();

export const databaseServerTimestamp = firebase.database.ServerValue.TIMESTAMP;
