import { db } from "./firebase-config.js";
import { checkAdmin } from "./auth.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form=document.getElementById("courseForm");

const courseList=document.getElementById("courseList");

let courses=[];
let editId=null;

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

<div style="display:flex;gap:10px;">

<button
class="buy-btn"
onclick="editCourse('${course.id}')">

Edit

</button>

<button
class="buy-btn"
style="background:#444;"
onclick="deleteCourse('${course.id}')">

Delete

</button>

</div>

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
function editCourse(id){

const course=courses.find(c=>c.id===id);

if(!course) return;

editId=id;

document.getElementById("title").value=course.title;
document.getElementById("price").value=course.price;
document.getElementById("image").value=course.image;
document.getElementById("category").value=course.category;
document.getElementById("description").value=course.description;
document.getElementById("courseLink").value=course.courseLink || "";

form.querySelector("button").textContent="Update Course";

window.scrollTo({
top:0,
behavior:"smooth"
});

}

window.editCourse=editCourse;


form.addEventListener("submit", async (e)=>{

e.preventDefault();

const title=document.getElementById("title").value.trim();

const price=Number(document.getElementById("price").value);

const image=document.getElementById("image").value.trim();

const category=document.getElementById("category").value;

const description=document.getElementById("description").value.trim();

const courseLink=document.getElementById("courseLink").value.trim();

if(!title || !price || !image || !courseLink){

alert("Please fill all required fields.");

return;

}

try{

if(editId){

await updateDoc(doc(db,"courses",editId),{

title,
price,
image,
category,
description,
courseLink

});

alert("Course Updated Successfully");

editId=null;

form.querySelector("button").textContent="Add Course";

}else{

await addDoc(collection(db,"courses"),{

title,
price,
image,
category,
description,
courseLink,
createdAt:Date.now()

});

alert("Course Added Successfully");

}

form.reset();
  
document.getElementById("courseLink").value="";
  
editId=null;
  
form.querySelector("button").textContent="Add Course";
  
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

checkAdmin(()=>{

startApp();

});
