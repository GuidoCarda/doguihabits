import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Send a contact message
 * @param {Object} data
 * @returns The id of the message
 */
export const sendContactMessage = async (data) => {
  const contactCollection = collection(db, "contact");
  const messageRef = await addDoc(contactCollection, data);

  return messageRef.id;
};
