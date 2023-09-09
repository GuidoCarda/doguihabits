import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { app, auth } from "../firebase";

const googleAuthProvider = new GoogleAuthProvider();

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

export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleAuthProvider);

    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      console.log(user);
      // This google accessToken allows us to use the Google API
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
    }
  } catch (err) {
    console.error(err);
  }
};
