import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app, auth } from "../firebase";

export const signUp = async (email: string, password: string) => {
  try {
    const userCredentils = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentils.user;
    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredentials.user;

    return user;
  } catch (error) {
    throw error;
  }
};
