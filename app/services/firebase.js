import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import 'firebase/compat/database';
import 'firebase/compat/auth';
import env from '@app/env';
import { socketDatabase, socketAuth, socketAnalytics, socketServerTimestamp } from '@services/socket-db';

const config = {
  apiKey: env.EMULATOR ? env.FIREBASE_PROJECT_ID : env.FIREBASE_API_KEY,
  authDomain: `${env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: env.FIREBASE_SENDER_ID,
  appId: env.EMULATOR ? env.FIREBASE_PROJECT_ID : env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

let database, auth, analytics, databaseServerTimestamp;

if (import.meta.env.VITE_NO_FIREBASE === 'true') {
  database = socketDatabase;
  auth = socketAuth;
  analytics = socketAnalytics;
  databaseServerTimestamp = socketServerTimestamp;
} else {
  firebase.initializeApp(config);
  database = firebase.database();
  auth = firebase.auth();
  analytics = firebase.analytics();

  if (env.EMULATOR) {
    database.useEmulator('localhost', 9000);
    auth.useEmulator('http://localhost:9099');
  }

  databaseServerTimestamp = firebase.database.ServerValue.TIMESTAMP;
}

export { database, auth, analytics, databaseServerTimestamp };
