import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/functions';
import env from 'env';

const config = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: `${env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: `${env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: env.FIREBASE_SENDER_ID,
};
firebase.initializeApp(config);

export const database = firebase.database();
export const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});
export const storage = firebase.storage();
export const auth = firebase.auth();
export const functions = firebase.functions();

export const firestoreServerTimestamp = firebase.firestore.FieldValue.serverTimestamp();
export const databaseServerTimestamp = firebase.database.ServerValue.TIMESTAMP;
