import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0sHTFzqsvlqzEE1f3it0kZKmDMa8v82o",
  authDomain: "doguihabits.firebaseapp.com",
  projectId: "doguihabits",
  storageBucket: "doguihabits.appspot.com",
  messagingSenderId: "225819376156",
  appId: "1:225819376156:web:8dcddeb756ca668ef7bdd9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export async function test() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Guido",
      last: "Cardarelli",
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (err) {
    console.log("Something went wrong adding document: ", err);
  }
}
