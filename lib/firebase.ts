// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  //apiKey: 'YOUR_API_KEY',
  authDomain: 'GemScan.firebaseapp.com',
  projectId: 'gemscan-dbb35',
  storageBucket: 'GemScan.appspot.com',
  messagingSenderId: '49242045596',
  appId: '49242045596',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
