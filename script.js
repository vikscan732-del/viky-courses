import { db, auth, provider } from "./firebase-config.js";
import { buyCourse } from "./payment.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
signInWithPopup,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const coursesContainer = document.getElementById("courses");
const searchInput = document.querySelector(".search");
let allCourses = [];

async function loadCourses() {
  // Better Loading Skeleton
  coursesContainer.innerHTML = `
    <div class="course-card skeleton">
      <div style="height: 130px; background: #2a2a2a;"></div>
      <div class="course-content">
        <div style="height: 18px; background: #2a2a2a; border-radius: 5px; margin-bottom: 10px;"></div>
        <div style="height: 14px; background: #2a2a2a; border-radius: 5px; width: 60%; margin-bottom: 10px;"></div>
        <div style="height: 35px; background: #2a2a2a; border-radius: 8px;"></div>
      </div>
    </div>
  `;

  try {
    const snapshot = await getDocs(collection(db, "courses"));
    allCourses = [];
    snapshot.forEach(doc => {
      allCourses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    renderCourses(allCourses);
  } catch (error) {
    console.error(error);
    coursesContainer.innerHTML = `
      <h2 style="text-align:center;color:red;">
        Unable to load courses.
      </h2>
    `;
  }
}

function renderCourses(courseList) {
  coursesContainer.innerHTML = "";

  if (courseList.length === 0) {
    coursesContainer.innerHTML = `
      <h2 style="text-align:center">
        No Courses Found
      </h2>
    `;
    return;
  }

  courseList.forEach(course => {
    const originalPrice = Number(course.originalPrice || course.price);
    const sellingPrice = Number(course.price);
    const discount = Math.round(
      ((originalPrice - sellingPrice) / originalPrice) * 100
    );

    // Modern Course Card
    coursesContainer.innerHTML += `
      <div class="course-card">
        ${course.badge ? `
          <div class="category">
            ${course.badge}
          </div>
        ` : ""}
        
        <img src="${course.image}" alt="${course.title}">
        
        <div class="course-content">
          <h3>${course.title}</h3>
          <p style="margin: 8px 0;">
            <del style="color:#888; font-size: 14px;">
              ₹${originalPrice}
            </del>
          </p>
          <p class="price">
            ₹${sellingPrice}
          </p>
          <div style="
            display: inline-block;
            background: #16a34a;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin: 8px 0;
          ">
            ${discount}% OFF
          </div>
          <p class="category">
            ${course.category}
          </p>
          <p style="
            height: 38px;
            overflow: hidden;
            color: #bbb;
            font-size: 14px;
          ">
            ${course.description || ""}
          </p>
          <div style="
            display: flex;
            gap: 8px;
            margin-top: 12px;
          ">
            <button
              class="buy-btn"
              style="background: #333; flex:1;"
              onclick="showDetails('${course.id}')">
              Details
            </button>
            <button
              class="buy-btn"
              style="flex:1;"
              onclick="buyCourseById('${course.id}')">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.trim().toLowerCase();
  if (keyword === "") {
    renderCourses(allCourses);
    return;
  }
  const filteredCourses = allCourses.filter(course => {
    const title = (course.title || "").toLowerCase();
    const category = (course.category || "").toLowerCase();
    const description = (course.description || "").toLowerCase();
    return title.includes(keyword) ||
      category.includes(keyword) ||
      description.includes(keyword);
  });
  renderCourses(filteredCourses);
});

function showDetails(id) {
  const course = allCourses.find(c => c.id === id);
  if (!course) return;

  const originalPrice = Number(course.originalPrice || course.price);
  const sellingPrice = Number(course.price);
  const discount = Math.round(
    ((originalPrice - sellingPrice) / originalPrice) * 100
  );

  const old = document.getElementById("coursePopup");
  if (old) old.remove();

  // Premium Details Popup
  document.body.insertAdjacentHTML("beforeend", `
    <div id="coursePopup"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.85);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: flex-end;
        justify-content: center;
        z-index: 9999;
      ">
      <div style="
        background: #181818;
        width: 100%;
        max-width: 500px;
        border-radius: 25px 25px 0 0;
        padding: 20px;
        max-height: 90vh;
        overflow: auto;
        animation: popupFade .25s;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        ">
          <h2 style="margin:0;">
            ${course.title}
          </h2>
          <button
            onclick="closePopup()"
            style="
              background: none;
              border: none;
              color: white;
              font-size: 28px;
              cursor: pointer;
            ">
            ×
          </button>
        </div>
        
        <img
          src="${course.image}"
          style="
            width: 100%;
            border-radius: 15px;
            margin-bottom: 15px;
          ">
        
        ${course.badge ? `
          <div class="category">
            ${course.badge}
          </div>
        ` : ""}
        
        <p>
          <del style="color:#888;">
            ₹${originalPrice}
          </del>
        </p>
        <p class="price">
          ₹${sellingPrice}
        </p>
        <div style="
          display: inline-block;
          background: #16a34a;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: bold;
          margin: 10px 0;
        ">
          ${discount}% OFF
        </div>
        
        <p style="
          margin-top: 15px;
          line-height: 1.7;
          color: #ddd;
        ">
          ${course.description || ""}
        </p>
        
        <pre style="
          white-space: pre-wrap;
          background: #111;
          padding: 15px;
          border-radius: 12px;
          margin-top: 15px;
          font-size: 14px;
          color: white;
        ">
          ${course.courseInfo || ""}
        </pre>
        
        <div style="
          display: flex;
          gap: 10px;
          margin-top: 20px;
        ">
          <button
            class="buy-btn"
            style="flex:1;"
            onclick="buyCourseById('${course.id}')">
            Buy Now
          </button>
          <button
            class="buy-btn"
            style="background: #333;"
            onclick="closePopup()">
            Close
          </button>
        </div>
      </div>
    </div>
  `);
}

function closePopup() {
  const popup = document.getElementById("coursePopup");
  if (popup) {
    popup.remove();
  }
}

window.showDetails = showDetails;
window.closePopup = closePopup;

async function startApp() {
  try {
    await loadCourses();
  } catch (error) {
    console.error("Startup Error:", error);
    coursesContainer.innerHTML = `
      <h2 style="text-align:center;color:red;">
        Unable to connect to Firebase.
      </h2>
    `;
  }
}

startApp();

function buyCourseById(id) {
  const course = allCourses.find(c => c.id === id);
  if (!course) {
    alert("Course not found.");
    return;
  }
  buyCourse(course);
}

window.buyCourseById = buyCourseById;

const loginBtn = document.getElementById("loginBtn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.textContent = "Logout";
  } else {
    loginBtn.textContent = "Login";
  }
});

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (auth.currentUser) {
    await signOut(auth);
    return;
  }
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    alert("Login failed.");
  }
});
