import firebase from 'firebase'
import 'firebase/firestore'

import settings from '@/../settings.json';

const firebaseConf = settings.firebase;
const firebaseApp = firebase.initializeApp(firebaseConf)
let firestore = firebaseApp.firestore();
firestore.settings({
  timestampsInSnapshots: true,
});
export const db = firestore;