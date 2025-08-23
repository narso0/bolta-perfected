import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from 'firebase/auth/react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'boltaaa.firebaseapp.com',
  projectId: 'boltaaa',
  storageBucket: 'boltaaa.firebasestorage.app',
  messagingSenderId: '196578511481',
  appId: '1:196578511481:web:b7c12c2462db05563f62a8',
  measurementId: 'G-R7LWXHJ5ZE',
};

const app = initializeApp(firebaseConfig);

// Use React Native persistence for Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
