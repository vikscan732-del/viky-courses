import { db } from "./firebase-config.js";
import { buyCourse } from "./payment.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const coursesContainer = document.getElementById("courses");
const searchInput = document.querySelector(".search");

let allCourses = [];

async function loadCourses(){

coursesContainer.innerHTML="<h2 style='text-align:center'>Loading Courses...</h2>";

try{

const snapshot=await getDocs(collection(db,"courses"));

allCourses=[];

snapshot.forEach(doc=>{

allCourses.push({

id:doc.id,

...doc.data()

});

});

renderCourses(allCourses);

}catch(error){

console.error(error);

coursesContainer.innerHTML=`
<h2 style="text-align:center;color:red;">
Unable to load courses.
</h2>
`;

}

}

function renderCourses(courseList){

coursesContainer.innerHTML="";

if(courseList.length===0){

coursesContainer.innerHTML=`
<h2 style="text-align:center">
No Courses Found
</h2>
`;

return;

}

courseList.forEach(course=>{

coursesContainer.innerHTML+=`

<div class="course-card">

<img src="${course.image}" alt="${course.title}">

<div class="course-content">

<h3>${course.title}</h3>

<p class="price">₹${course.price}</p>

<p class="category">${course.category}</p>

<p>${course.description || ""}</p>

<button
class="buy-btn"
onclick="buyCourseById('${course.id}')">

Buy Now

</button>

</div>

</div>

`;

});

}

searchInput.addEventListener("input",()=>{

const keyword=searchInput.value.trim().toLowerCase();

if(keyword===""){

renderCourses(allCourses);

return;

}

const filteredCourses=allCourses.filter(course=>{

const title=(course.title||"").toLowerCase();

const category=(course.category||"").toLowerCase();

const description=(course.description||"").toLowerCase();

return title.includes(keyword) ||
category.includes(keyword) ||
description.includes(keyword);

});

renderCourses(filteredCourses);

});

// ===============================
// course49 Homepage Initialization
// ===============================

async function startApp(){

try{

await loadCourses();

}catch(error){

console.error("Startup Error:",error);

coursesContainer.innerHTML=`
<h2 style="text-align:center;color:red;">
Unable to connect to Firebase.
</h2>
`;

}

}

startApp();
function buyCourseById(id){

const course=allCourses.find(c=>c.id===id);

if(!course){

alert("Course not found.");

return;

}

buyCourse(course);

}

window.buyCourseById=buyCourseById;
