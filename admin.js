import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const form = document.getElementById("courseForm");
const courseList = document.getElementById("courseList");
const success = document.getElementById("success");

async function loadCourses(){

courseList.innerHTML="<p>Loading...</p>";

const snapshot=await getDocs(collection(db,"courses"));

courseList.innerHTML="";

snapshot.forEach((item)=>{

const course=item.data();

courseList.innerHTML+=`
<div class="course-item">

<div class="course-info">

<h3>${course.title}</h3>

<p>₹${course.price}</p>

<p>${course.category}</p>

</div>

<button
class="delete-btn"
onclick="deleteCourse('${item.id}')">

Delete

</button>

</div>
`;

});

}

form.addEventListener("submit", async (e) => {

e.preventDefault();

const title = document.getElementById("title").value.trim();

const price = Number(document.getElementById("price").value);

const image = document.getElementById("image").value.trim();

const category = document.getElementById("category").value;

const description = document.getElementById("description").value.trim();

if(!title || !price || !image){

alert("Please fill all required fields.");

return;

}

try{

await addDoc(collection(db,"courses"),{

title,
price,
image,
category,
description

});

success.style.display="block";

setTimeout(()=>{

success.style.display="none";

},2000);

form.reset();

loadCourses();

}catch(err){

console.error(err);

alert("Failed to save course.");

}

});

async function deleteCourse(id){

if(!confirm("Delete this course?")) return;

try{

await deleteDoc(doc(db,"courses",id));

loadCourses();

}catch(err){

console.error(err);

alert("Unable to delete course.");

}

}

window.deleteCourse = deleteCourse;

loadCourses();
