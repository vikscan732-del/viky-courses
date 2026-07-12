// Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBvHqTLICABX2uAHyEQkb7E1RnwTzKy8k",
  authDomain: "viky-courses.firebaseapp.com",
  projectId: "viky-courses",
  storageBucket: "viky-courses.firebasestorage.app",
  messagingSenderId: "301659825576",
  appId: "1:301659825576:web:6511bd2765dd617ce6699d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { db, auth, provider };
