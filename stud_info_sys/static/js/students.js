
import { loadData, saveData } from "./utils/storage.js";
import { renderTable, deleteItem } from "./utils/functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addStudentBtn");
  const modal = document.getElementById("studentModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("studentForm");
  const tableBody = document.getElementById("studentsTableBody");

  const nameInput = document.getElementById("studentName");
  const emailInput = document.getElementById("studentEmail");
  const bdayInput = document.getElementById("studentBirthday");
  const phoneInput = document.getElementById("studentPhone");
  const addressInput = document.getElementById("studentAddress");
  const yearInput = document.getElementById("studentYear");
  const editIndexInput = document.getElementById("editIndex");
  const modalTitle = document.getElementById("modalTitle");
  const yearFilter = document.getElementById("yearFilter");

  // Load data
  let students = loadData("students", []);

  // Generate sequential student ID
  function generateStudentId() {
    let lastId = loadData("lastStudentId", "2025000");
    const newId = (parseInt(lastId, 10) + 1).toString();
    saveData("lastStudentId", newId);
    return newId;
  }

  // Save students array
  function saveStudents() {
    saveData("students", students);
  }

  // Show modal for adding new student
  addBtn.addEventListener("click", () => {
    modalTitle.textContent = "Add Student";
    form.reset();
    editIndexInput.value = "";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  // Cancel modal
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Submit form
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const year = parseInt(yearInput.value, 10);

    if (year < 1 || year > 4 || isNaN(year)) {
      alert("Year must be between 1 and 4");
      return;
    }

    const student = {
      id: editIndexInput.value ? students[editIndexInput.value].id : generateStudentId(),
      name: nameInput.value,
      email: emailInput.value,
      birthday: bdayInput.value,
      phone: phoneInput.value,
      address: addressInput.value,
      year: year
    };

    if (editIndexInput.value) {
      // Update existing student
      students[editIndexInput.value] = student;
    } else {
      // Add new student
      students.push(student);
    }

    saveStudents();
    renderStudentsTable();

    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Attach edit/delete events
  function attachRowEvents() {
    tableBody.querySelectorAll(".editBtn").forEach((btn) => {
      btn.onclick = () => {
        const index = btn.getAttribute("data-index");
        const student = students[index];
        modalTitle.textContent = "Edit Student";
        editIndexInput.value = index;
        nameInput.value = student.name;
        emailInput.value = student.email;
        bdayInput.value = student.birthday;
        phoneInput.value = student.phone;
        addressInput.value = student.address;
        yearInput.value = student.year;
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      };
    });

    tableBody.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.onclick = () => {
        const index = parseInt(btn.getAttribute("data-index")); // always parse as integer
        deleteItem("students", students, index, renderStudentsTable);
      };
});
  }

// Render students table
function renderStudentsTable() {
  // Sort by year
  let filtered = [...students].sort((a, b) => a.year - b.year);

  // Apply year filter
  if (yearFilter && yearFilter.value !== "all") {
    filtered = filtered.filter((s) => s.year === parseInt(yearFilter.value, 10));
  }

  // Define columns in order
  const columns = ["id", "name", "email", "birthday", "phone", "address", "year"];


  renderTable("studentsTableBody", filtered, columns, (student, index) => {
    const div = document.createElement("div");
    div.className = "space-x-2";
    div.innerHTML = `
      <button class="editBtn text-blue-600 hover:underline" data-index="${index}">Edit</button>
      <button class="deleteBtn text-red-600 hover:underline" data-index="${index}">Delete</button>
    `;
    return div;
  });

  // Reattach events
  attachRowEvents();
}


  // Filter change event
  if (yearFilter) {
    yearFilter.addEventListener("change", renderStudentsTable);
  }

  // Initial load
  renderStudentsTable();
});
