// config/firebase.js
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCBeIkT9upATOkrsv0UjAeeIVr0b8lPnSA",
  authDomain: "techpath-finder-36bfd.firebaseapp.com",
  projectId: "techpath-finder-36bfd",
  storageBucket: "techpath-finder-36bfd.firebasestorage.app",
  messagingSenderId: "1000562444207",
  appId: "1:1000562444207:web:5136b7d330cbbbf6db115a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence (fixes the warning)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
};