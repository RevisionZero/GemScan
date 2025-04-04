// // lib/firebase.ts
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   //apiKey: 'YOUR_API_KEY',
//   authDomain: 'GemScan.firebaseapp.com',
//   projectId: 'gemscan-dbb35',
//   storageBucket: 'GemScan.appspot.com',
//   messagingSenderId: '49242045596',
//   appId: '49242045596',
// };

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const db = getFirestore(app);

// export { db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import apikey from '@/lib/apikey.json';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apikey.key,
  authDomain: "gemscan-dbb35ß.firebaseapp.com",
  projectId: "gemscan-dbb35",
  storageBucket: "gemscan-dbb35.firebasestorage.app",
  messagingSenderId: "49242045596",
  appId: "1:49242045596:web:ce6288d5cad4507ff6c159",
  measurementId: "G-8YHYEJN2G1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const FIREBASE_AUTH = getAuth(app);
// const analytics = getAnalytics(app);