import { db } from "./firebase-config.js";
import { buyCourse } from "./payment.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const coursesContainer=document.getElementById("courses");

const searchInput=document.querySelector(".search");

let allCourses=[];

async function loadCourses(){

coursesContainer.innerHTML=`
<h2 style="text-align:center">
Loading Courses...
</h2>
`;

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

const originalPrice=Number(course.originalPrice||course.price);

const sellingPrice=Number(course.price);

const discount=Math.round(

((originalPrice-sellingPrice)/originalPrice)*100

);

coursesContainer.innerHTML+=`

<div class="course-card">

${course.badge?`

<div class="category">

${course.badge}

</div>

`:""}

<img src="${course.image}">

<div class="course-content">

<h3>

${course.title}

</h3>

<p>

<del style="color:#888">

₹${originalPrice}

</del>

</p>

<p class="price">

₹${sellingPrice}

</p>

<p style="color:#00ff99;font-weight:bold">

${discount}% OFF

</p>

<p class="category">

${course.category}

</p>

<p>

${course.description||""}

</p>

<div style="display:flex;gap:10px;">

<button

class="buy-btn"

onclick="showDetails('${course.id}')">

Details

</button>

<button

class="buy-btn"

onclick="buyCourseById('${course.id}')">

Buy Now

</button>

</div>

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

function showDetails(id){

const course=allCourses.find(c=>c.id===id);

if(!course) return;

const originalPrice=Number(course.originalPrice||course.price);

const sellingPrice=Number(course.price);

const discount=Math.round(

((originalPrice-sellingPrice)/originalPrice)*100

);

const old=document.getElementById("coursePopup");

if(old) old.remove();

document.body.insertAdjacentHTML("beforeend",`

<div id="coursePopup"

style="

position:fixed;

top:0;

left:0;

width:100%;

height:100%;

background:rgba(0,0,0,.85);

display:flex;

justify-content:center;

align-items:center;

z-index:9999;

padding:20px;

">

<div

style="

background:#181818;

padding:20px;

border-radius:15px;

max-width:500px;

width:100%;

">

<h2>${course.title}</h2>

${course.badge?`<p style="color:#00ff99">${course.badge}</p>`:""}

<img

src="${course.image}"

style="

width:100%;

border-radius:10px;

margin:15px 0;

">

<p>

<del>₹${originalPrice}</del>

&nbsp;

<span style="color:#00ff99;font-size:22px">

₹${sellingPrice}

</span>

</p>

<p style="color:#00ff99">

${discount}% OFF

</p>

<p>

${course.description||""}

</p>

<pre style="white-space:pre-wrap;color:white">

${course.courseInfo||""}

</pre>

<div style="display:flex;gap:10px;margin-top:20px;">

<button

class="buy-btn"

onclick="buyCourseById('${course.id}')">

Buy Now

</button>

<button

class="buy-btn"

style="background:#444"

onclick="closePopup()">

Close

</button>

</div>

</div>

</div>

`);

}

function closePopup(){

const popup=document.getElementById("coursePopup");

if(popup){

popup.remove();

}

}

window.showDetails=showDetails;

window.closePopup=closePopup;

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
