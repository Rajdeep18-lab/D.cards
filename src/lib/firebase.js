import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Firebase configuration from environment variables with graceful fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDkj6E9tWCOdzwTXffN1jo13G75liEHt-c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "d-card-71933.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "d-card-71933",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "d-card-71933.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "672659614467",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:672659614467:web:1cf5f786d03118a27bd736"
};


// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
console.log("firebase connected", app);


// Initialize Firebase Auth instance
export const auth = getAuth(app);

// Initialize Firestore Database instance
export const db = getFirestore(app);

// Initialize Firebase Storage instance
export const storage = getStorage(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  firebaseUpdateProfile,
  firebaseUpdateEmail,
  firebaseUpdatePassword,
  // Firestore exports
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
  onSnapshot,
  // Storage exports
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};
