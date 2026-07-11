import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs
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

const container = document.getElementById("courses");

let courses = [];

async function loadCourses(){

container.innerHTML = "<h2 style='text-align:center'>Loading courses...</h2>";

try{

const querySnapshot = await getDocs(collection(db,"courses"));

courses = [];

querySnapshot.forEach((doc)=>{

courses.push(doc.data());

});

showCourses(courses);

}catch(error){

console.error(error);

container.innerHTML="<h2 style='text-align:center;color:red'>Unable to load courses.</h2>";

}

}

function showCourses(list){

container.innerHTML="";

if(list.length===0){

container.innerHTML=`
<h2 style="text-align:center">
No Courses Found
</h2>
`;

return;

}

list.forEach(course=>{

container.innerHTML+=`

<div class="course-card">

<img src="${course.image}" alt="${course.title}">

<div class="course-content">

<h3>${course.title}</h3>

<p class="price">₹${course.price}</p>

<p>${course.category}</p>

<a href="#" class="buy-btn">
Buy Now
</a>

</div>

</div>

`;

});

}

const search=document.querySelector(".search");

search.addEventListener("keyup",()=>{

const keyword=search.value.toLowerCase();

const filtered=courses.filter(course=>{

return course.title.toLowerCase().includes(keyword);

});

showCourses(filtered);

});

loadCourses();

