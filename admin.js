import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
GoogleAuthProvider,
signInWithPopup,
signOut,
onAuthStateChanged
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
const ADMIN_EMAIL = "vikscan732@gmail.com";

async function login(){

try{

await signInWithPopup(auth,provider);

}catch(err){

alert(err.message);

}

}

onAuthStateChanged(auth,(user)=>{

if(!user){

const ok=confirm("Admin login required.\nPress OK to sign in with Google.");

if(ok){

login();

}

return;

}

if(user.email!==ADMIN_EMAIL){

alert("Access denied.");

signOut(auth);

return;

}

document.body.style.display="block";

loadCourses();

});
