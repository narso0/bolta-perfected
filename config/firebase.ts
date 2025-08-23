import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, Auth, getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'boltaaa.firebaseapp.com',
  projectId: 'boltaaa',
  storageBucket: 'boltaaa.firebasestorage.app',
  messagingSenderId: '196578511481',
  appId: '1:196578511481:web:b7c12c2462db05563f62a8',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.error('Firebase initialization error', error);
    app = getApp();
    auth = getAuth(app);
  }
} else {
  app = getApp();
  auth = getAuth(app);
}

db = getFirestore(app);

export { app, auth, db };
