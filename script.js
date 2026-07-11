import { db } from "./firebase-config.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const container = document.getElementById("courses");
const search = document.querySelector(".search");

let courses = [];

async function loadCourses() {

    container.innerHTML = "<h2>Loading courses...</h2>";

    try {

        const snapshot = await getDocs(collection(db, "courses"));

        courses = [];

        snapshot.forEach((doc) => {

            courses.push({
                id: doc.id,
                ...doc.data()
            });

        });

        displayCourses(courses);

    } catch (err) {

        console.error(err);

        container.innerHTML = `
        <h2 style="text-align:center;color:red;">
        Unable to load courses
        </h2>`;

    function displayCourses(list) {

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
        <h2 style="text-align:center;">
        No Courses Found
        </h2>`;
        return;

    }

    list.forEach(course => {

        container.innerHTML += `
        <div class="course-card">

            <img src="${course.image}" alt="${course.title}">

            <div class="course-content">

                <h3>${course.title}</h3>

                <p class="price">₹${course.price}</p>

                <span class="category">${course.category}</span>

                <a href="#" class="buy-btn">
                Buy Now
                </a>

            </div>

        </div>
        `;

    });

}

search.addEventListener("input", () => {

    const keyword = search.value.toLowerCase();

    const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(keyword)
    );

    displayCourses(filtered);

});

loadCourses();

}

