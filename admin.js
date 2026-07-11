const form = document.getElementById("courseForm");
const courseList = document.getElementById("courseList");
const success = document.getElementById("success");

let courses = JSON.parse(localStorage.getItem("course49_courses")) || [];

function saveCourses() {
    localStorage.setItem("course49_courses", JSON.stringify(courses));
}

function renderCourses() {

    courseList.innerHTML = "";

    if(courses.length === 0){
        courseList.innerHTML = "<p>No courses added yet.</p>";
        return;
    }

    courses.forEach((course,index)=>{

        courseList.innerHTML += `
        <div class="course-item">

            <div class="course-info">

                <h3>${course.title}</h3>

                <p class="price">₹${course.price}</p>

                <p>${course.category}</p>

            </div>

            <button class="delete-btn" onclick="deleteCourse(${index})">

            Delete

            </button>

        </div>
        `;

    });

}

function deleteCourse(index){

    if(confirm("Delete this course?")){

        courses.splice(index,1);

        saveCourses();

        renderCourses();

    }

}

form.addEventListener("submit",function(e){

    e.preventDefault();

    const title=document.getElementById("title").value.trim();

    const price=document.getElementById("price").value.trim();

    const image=document.getElementById("image").value.trim();

    const category=document.getElementById("category").value;

    const description=document.getElementById("description").value.trim();

    if(title==="" || price==="" || image===""){

        alert("Please fill all required fields.");

        return;

    }

    courses.push({

        title,

        price,

        image,

        category,

        description

    });

    saveCourses();

    renderCourses();

    success.style.display="block";

    setTimeout(()=>{

        success.style.display="none";

    },2000);

    form.reset();

});

renderCourses();