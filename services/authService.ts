import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (!credential.user) {
      throw new Error('Failed to create user');
    }
    await updateProfile(credential.user, { displayName });
    return credential.user;
  } catch (error) {
    console.error('Error in signUpWithEmail:', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!credential.user) {
      throw new Error('Failed to sign in user');
    }
    return credential.user;
  } catch (error) {
    console.error('Error in signInWithEmail:', error);
    throw error;
  }
}
