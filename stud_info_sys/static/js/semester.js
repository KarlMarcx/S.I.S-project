import { loadData, saveData } from "./utils/storage.js";
import { renderTable } from "./utils/functions.js";

// State
let selectedStudent = null;
let enrollments = loadData("enrollments", []);

// Utility: clear and set a message option
function clearAndSetMessage(selectEl, message) {
  selectEl.innerHTML = "";
  const opt = document.createElement("option");
  opt.disabled = true;
  opt.selected = true;
  opt.textContent = message;
  opt.value = "";
  selectEl.appendChild(opt);
}

// Populate Courses (filtered by year)
function populateCourseSelect(year) {
  const courses = loadData("courses", []);
  const courseSelect = document.getElementById("courseSelect");

  courseSelect.innerHTML = "";

  const filteredCourses = courses.filter(c => String(c.year) === String(year));

  if (filteredCourses.length === 0) {
    clearAndSetMessage(courseSelect, "No available courses");
    return;
  }

  filteredCourses.forEach(course => {
    const opt = document.createElement("option");
    opt.value = course.code;
    opt.textContent = `${course.code}: ${course.name} (${course.time})`;
    courseSelect.appendChild(opt);
  });
}

// Search Student
function searchStudent() {
  const studentId = document.getElementById("studentInput").value.trim();
  const students = loadData("students", []);
  const courseSelect = document.getElementById("courseSelect");

  const found = students.find(s => s.id === studentId);

  if (!found) {
    selectedStudent = null;
    clearAndSetMessage(courseSelect, "Student not found");
    return;
  }

  selectedStudent = found;
  populateCourseSelect(found.year);
}

// Render Enrollments Table using reusable function
function renderEnrollments() {
  renderTable(
    "enrolledTableBody",
    enrollments,
    ["studentId", "studentName", "date"],
    (item, index) => {
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.className = "deleteBtn text-red-600 hover:underline";
      btn.onclick = () => {
        enrollments.splice(index, 1);
        saveData("enrollments", enrollments);
        renderEnrollments();
      };
      return btn;
    }
  );
}


// Enroll Student
function enrollStudent() {
  if (!selectedStudent) {
    alert("Please search for a valid student first");
    return;
  }

  const courseSelect = document.getElementById("courseSelect");
  const selectedCourses = Array.from(courseSelect.selectedOptions)
    .map(opt => opt.value)
    .filter(v => v && v.trim() !== "");

  if (selectedCourses.length === 0) {
    alert("No valid courses selected");
    return;
  }

  

  const enrollment = {
    studentId: selectedStudent.id,
    studentName: selectedStudent.name,
    courses: selectedCourses,
    date: new Date().toLocaleDateString(),
  };

  enrollments.push(enrollment);
  saveData("enrollments", enrollments);
  renderEnrollments();

  // reset only course selection
  courseSelect.selectedIndex = -1;
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchStudentBtn").addEventListener("click", searchStudent);
  document.getElementById("enrollBtn").addEventListener("click", enrollStudent);

  renderEnrollments();
});