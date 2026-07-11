const courses = [
{
title:"Web Development Masterclass",
price:"₹299",
image:"https://picsum.photos/400/220?random=1"
},
{
title:"Android App Development",
price:"₹499",
image:"https://picsum.photos/400/220?random=2"
},
{
title:"Python Programming",
price:"₹199",
image:"https://picsum.photos/400/220?random=3"
},
{
title:"AI & ChatGPT Complete Course",
price:"₹999",
image:"https://picsum.photos/400/220?random=4"
},
{
title:"Graphic Design",
price:"₹399",
image:"https://picsum.photos/400/220?random=5"
},
{
title:"Video Editing Pro",
price:"₹599",
image:"https://picsum.photos/400/220?random=6"
}
];

const container = document.getElementById("courses");

function showCourses(list){
container.innerHTML="";

list.forEach(course=>{
container.innerHTML += `
<div class="course-card">
<img src="${course.image}">
<div class="course-content">
<h3>${course.title}</h3>
<div class="price">${course.price}</div>
<a href="#" class="buy-btn">Buy Now</a>
</div>
</div>
`;
});
}

showCourses(courses);

document.querySelector(".search").addEventListener("keyup",function(){
const text=this.value.toLowerCase();

const filtered=courses.filter(course=>
course.title.toLowerCase().includes(text)
);

showCourses(filtered);
});