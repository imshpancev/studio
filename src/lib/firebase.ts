// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "optimumpulse",
  appId: "1:257655082700:web:18ef8355c1a2f5e6f97c69",
  storageBucket: "optimumpulse.firebasestorage.app",
  apiKey: "AIzaSyB1N-yohIDmxxFwqUJX4QT-F3qo40UAFB0",
  authDomain: "optimumpulse.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "257655082700"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };
