import { db } from '../config/firebase';
import { Timestamp, doc, getDoc, setDoc, serverTimestamp, FieldValue } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string | null;
  bolts: number;
  steps: number; // Represents the user's total steps for the current day
  dailyStepGoal: number; // The user's personal goal for the day
  streak: number; // For tracking consecutive days of meeting the goal
  createdAt: Timestamp;
  pushToken?: string;
}

type NewUserProfile = Omit<UserProfile, 'createdAt'> & { createdAt: FieldValue };

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) {
    throw new Error('getUserProfile: uid is required');
  }
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as UserProfile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
}

export async function createUserProfile(
  uid: string,
  username: string,
  email: string,
  dailyStepGoal: number,
): Promise<void> {
  if (!uid) {
    throw new Error('createUserProfile: uid is required');
  }
  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return;
    }

    const newUser: NewUserProfile = {
      uid,
      email,
      username,
      bolts: 0,
      steps: 0,
      dailyStepGoal,
      streak: 0,
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, newUser);
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
}
