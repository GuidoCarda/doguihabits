import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../firebase";

const googleAuthProvider = new GoogleAuthProvider();

/**
 * Sign up a user in firebase with email and password
 * @param {string} email
 * @param {string} password
 * @returns The firebase user object
 */
export const signUp = async (email, password) => {
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

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns The firebase user object
 */
export const signIn = async (email, password) => {
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

/**
 * Sign in with Google
 * @returns The firebase user object
 */
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
