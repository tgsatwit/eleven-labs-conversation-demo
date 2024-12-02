import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6nkm4paR12zdkAc6FFBEBsUEH2GyHoO8",
  authDomain: "gestalts-demo.firebaseapp.com",
  projectId: "gestalts-demo",
  storageBucket: "gestalts-demo.firebasestorage.app",
  messagingSenderId: "304841127173",
  appId: "1:304841127173:web:bc9cd9b0c8bef1c1d7f36c"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; 