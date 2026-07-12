import { auth, db } from "./firebase-config.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const profilePhoto=document.getElementById("profilePhoto");

const userName=document.getElementById("userName");

const userEmail=document.getElementById("userEmail");

const courseCount=document.getElementById("courseCount");

const logoutBtn=document.getElementById("logoutBtn");

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="index.html";

return;

}

profilePhoto.src=user.photoURL||"";

userName.textContent=user.displayName||"User";

userEmail.textContent=user.email;

const q=query(

collection(db,"purchases"),

where("userEmail","==",user.email)

);

const snapshot=await getDocs(q);

courseCount.textContent=snapshot.size;

});

logoutBtn.addEventListener("click",async()=>{

const ok=confirm("Are you sure you want to logout?");

if(!ok){

return;

}

try{

await signOut(auth);

alert("Logged out successfully.");

location.href="index.html";

}catch(error){

console.error(error);

alert("Logout failed.");

}

});