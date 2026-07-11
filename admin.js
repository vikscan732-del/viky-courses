import { db } from "./firebase-config.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form=document.getElementById("courseForm");

const courseList=document.getElementById("courseList");

let courses=[];

async function loadCourses(){

courseList.innerHTML="Loading...";

const snapshot=await getDocs(collection(db,"courses"));

courses=[];

snapshot.forEach(item=>{

courses.push({

id:item.id,

...item.data()

});

});

renderCourses();

}

function renderCourses(){

courseList.innerHTML="";

if(courses.length===0){

courseList.innerHTML="<h3>No courses found</h3>";

return;

}

courses.forEach(course=>{

courseList.innerHTML+=`

<div class="course-card">

<img src="${course.image}" alt="${course.title}">

<div class="course-content">

<h3>${course.title}</h3>

<p class="price">₹${course.price}</p>

<p class="category">${course.category}</p>

<p>${course.description}</p>

<button
class="buy-btn"
onclick="deleteCourse('${course.id}')">

Delete

</button>

</div>

</div>

`;

});

}

async function deleteCourse(id){

if(!confirm("Delete this course?")){

return;

}

await deleteDoc(doc(db,"courses",id));

loadCourses();

}

window.deleteCourse=deleteCourse;

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const title=document.getElementById("title").value.trim();

const price=Number(document.getElementById("price").value);

const image=document.getElementById("image").value.trim();

const category=document.getElementById("category").value;

const description=document.getElementById("description").value.trim();

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
description,
createdAt:Date.now()

});

alert("Course Added Successfully");

form.reset();

loadCourses();

}catch(err){

console.error(err);

alert("Failed to save course");

}

});

// ============================
// course49 Admin Initialization
// ============================

async function startApp(){

try{

await loadCourses();

}catch(error){

console.error("Startup Error:",error);

courseList.innerHTML=`
<h2 style="text-align:center;color:red;">
Unable to connect to Firebase.
</h2>
`;

}

}

startApp();