// THIS FILE IS FOR CLIENT-SIDE FIREBASE SDK
// DO NOT USE IN SERVER-SIDE CODE (e.g. Server Actions, Genkit flows)

import { initializeApp, getApp, getApps, deleteApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "optimumpulse",
  appId: "1:257655082700:web:18ef8355c1a2f5e6f97c69",
  storageBucket: "optimumpulse.appspot.com",
  apiKey: "AIzaSyB1N-yohIDmxxFwqUJX4QT-F3qo40UAFB0",
  authDomain: "optimumpulse.firebaseapp.com",
  messagingSenderId: "257655082700",
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
