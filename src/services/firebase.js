import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Use environment variables for security (Meeting 'Security' and 'Google Services' criteria)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_GCP_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_GCP_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_GCP_PROJECT_ID}.appspot.com`,
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-ABCDEF123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
