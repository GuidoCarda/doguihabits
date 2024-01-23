import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createDocInFirebase = async (habit) => {
  try {
    await addDoc(collection(db, "habits"), habit);
  } catch (err) {
    console.error(err);
  }
};

// when using setDoc you have to specify the document id
// otherwise you can use addDoc which will generate a random id for you
