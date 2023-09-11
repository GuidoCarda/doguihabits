import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createDocInFirebase = async (habit) => {
  try {
    await setDoc(doc(db, "habits", habit.id), habit);
  } catch (err) {
    console.error(err);
  }
};
