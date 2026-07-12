import { auth, db } from "./firebase-config.js";

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

currentUser = user;

});

export async function buyCourse(course){

if(!currentUser){

alert("Please login with Google first.");

location.href="login.html";

return;

}

const options={

key:"rzp_test_TCVI6paOSHulk1",

amount:Number(course.price)*100,

currency:"INR",

name:"course49",

description:course.title,

handler:async function(response){

try{

await addDoc(collection(db,"purchases"),{

userEmail:currentUser.email,

courseId:course.id,

courseTitle:course.title,

courseLink:course.courseLink,

price:course.price,

paymentId:response.razorpay_payment_id,

purchaseDate:Date.now()

});

alert("Payment Successful");

}catch(err){

console.error(err);

alert("Payment saved failed.");

}

},

theme:{
color:"#E50914"
}

};

const rzp=new Razorpay(options);

rzp.open();

}
