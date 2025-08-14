// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBUVeElfCS8nW3OKK_Cw-V95aNPI-4Gep4",
  authDomain: "spinstat-80020.firebaseapp.com",
  projectId: "spinstat-80020",
  storageBucket: "spinstat-80020.firebasestorage.app",
  messagingSenderId: "746221064131",
  appId: "1:746221064131:web:3901d2e3dce46bd0c47776",
  measurementId: "G-H2PBX5K0P8"
};

// Firebase init
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Tekrar tanımlamadan sadece export et!
export { auth, db, app, analytics };
