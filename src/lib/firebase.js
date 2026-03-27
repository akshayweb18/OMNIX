import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBqffLla5ML4p0GzEcU4ML9b4WOwUFRNVk",
  authDomain: "omnix-ai-67f24.firebaseapp.com",
  projectId: "omnix-ai-67f24",
  storageBucket: "omnix-ai-67f24.firebasestorage.app",
  messagingSenderId: "1080167720117",
  appId: "1:1080167720117:web:4ae42eec96a1c6e7bd0afc",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();