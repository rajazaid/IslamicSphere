// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBVO9dNmVCt_vw6DceIksQCztjTJSbWx1c",
  authDomain: "rnauthincation.firebaseapp.com",
  projectId: "rnauthincation",
  storageBucket: "rnauthincation.appspot.com",
  messagingSenderId: "799569699653",
  appId: "1:799569699653:web:de5ab4cb9706f31306d42c"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);