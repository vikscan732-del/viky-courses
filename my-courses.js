import { db, auth } from "./firebase-config.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const container=document.getElementById("courses");

let user=null;

onAuthStateChanged(auth, async(currentUser)=>{

if(!currentUser){

container.innerHTML=`
<h2 style="text-align:center;">
Please login first.
</h2>
`;

return;

}

user=currentUser;

loadCourses();

});

async function loadCourses(){

container.innerHTML="Loading...";

const q=query(

collection(db,"purchases"),

where("userEmail","==",user.email)

);

const snapshot=await getDocs(q);

if(snapshot.empty){

container.innerHTML=`
<h2 style="text-align:center;">
No purchased courses yet.
</h2>
`;

return;

}

container.innerHTML="";

snapshot.forEach(doc=>{

const course=doc.data();

container.innerHTML+=`

<div class="course-card">

<div class="course-content">

<h3>${course.courseTitle}</h3>

<p class="price">₹${course.price}</p>

<button
class="buy-btn"
onclick="openCourse('${course.courseLink}')">

Open Course

</button>

</div>

</div>

`;

});

}

function openCourse(link){

if(!link){

alert("Course link not available.");

return;

}

window.open(link,"_blank");

}

window.openCourse=openCourse;
