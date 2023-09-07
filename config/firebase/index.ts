import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FB_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FB_STORE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FB_MESSAGE_SEND_ID,
  appId: process.env.EXPO_PUBLIC_FB_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FB_MEASURE_Id,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
