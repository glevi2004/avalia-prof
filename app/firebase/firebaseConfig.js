// "use client";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA24buV0_YfUqls9Ypgfe8cyMchQnx7KS8",
  authDomain: "avalia-prof-dev.firebaseapp.com",
  projectId: "avalia-prof-dev",
  storageBucket: "avalia-prof-dev.firebasestorage.app",
  messagingSenderId: "235446399701",
  appId: "1:235446399701:web:5935d7cb532f24ccf7e85c",
  measurementId: "G-7ZY8ZVF7MN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, googleProvider, auth };
