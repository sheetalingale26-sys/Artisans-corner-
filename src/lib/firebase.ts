import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Artisan's Corner Firebase configuration provided
export const firebaseConfig = {
  apiKey: "AIzaSyBOdsM2taT8wklwbIUytKv5SEDnkRrIpns",
  authDomain: "artisan-s-corner.firebaseapp.com",
  projectId: "artisan-s-corner",
  storageBucket: "artisan-s-corner.firebasestorage.app",
  messagingSenderId: "736019955362",
  appId: "1:736019955362:web:0be0d6fb38c4d89154a1fb",
  measurementId: "G-ZPFL9KF2XQ"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics initializes asynchronously if supported by browser environment
export const initAnalytics = async () => {
  try {
    if (typeof window !== "undefined" && (await isSupported())) {
      return getAnalytics(app);
    }
  } catch (err) {
    console.warn("Firebase analytics not initialized:", err);
  }
  return null;
};
