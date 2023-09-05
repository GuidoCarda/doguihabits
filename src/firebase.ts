import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0sHTFzqsvlqzEE1f3it0kZKmDMa8v82o",
  authDomain: "doguihabits.firebaseapp.com",
  projectId: "doguihabits",
  storageBucket: "doguihabits.appspot.com",
  messagingSenderId: "225819376156",
  appId: "1:225819376156:web:8dcddeb756ca668ef7bdd9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Auth instance and get a reference to the service
export const auth = getAuth(app);
