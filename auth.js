import { auth } from "./firebase-config.js";

import {
GoogleAuthProvider,
signInWithPopup,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

const ADMIN_EMAIL = "vikscan732@gmail.com";

export async function login(){

await signInWithPopup(auth,provider);

}

export async function logout(){

await signOut(auth);

}

export function checkAdmin(success){

onAuthStateChanged(auth,(user)=>{

if(!user){

location.href="login.html";

return;

}

if(user.email!==ADMIN_EMAIL){

alert("Access Denied");

logout();

return;

}

success(user);

});

}