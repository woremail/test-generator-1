// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBxZx728L-W5bvmNq3oIluryrS5G-AU0Ms",
  authDomain: "quiz-app-f197b.firebaseapp.com",
  projectId: "quiz-app-f197b",
  storageBucket: "quiz-app-f197b.firebasestorage.app",
  messagingSenderId: "604478945623",
  appId: "1:604478945623:web:8d89f2b24a7006c2a2a612",
  measurementId: "G-9DGG5GCRD0"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
export { db,app,auth};

