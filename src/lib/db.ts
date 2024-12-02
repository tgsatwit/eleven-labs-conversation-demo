import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type UserData = {
  email: string;
  createdAt: Date;
  lastLogin: Date;
};

export async function createUserDocument(userId: string, userData: UserData) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: userData.createdAt.toISOString(),
        lastLogin: userData.lastLogin.toISOString(),
      });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

export async function updateUserLastLogin(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      lastLogin: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating last login:', error);
  }
} 