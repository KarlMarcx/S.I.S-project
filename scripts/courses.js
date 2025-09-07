import { loadData, saveData } from "./utils/storage.js";
import { renderTable } from "./utils/functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addCourseBtn");
  const modal = document.getElementById("courseModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("courseForm");
  const tableBodyId = "coursesTableBody";

  const codeInput = document.getElementById("courseCode");
  const nameInput = document.getElementById("courseName");
  const descInput = document.getElementById("courseDesc");
  const unitsInput = document.getElementById("courseUnits");
  const yearInput = document.getElementById("courseYear");
  const timeInput = document.getElementById("courseTime");
  const priceInput = document.getElementById("coursePrice");

  const editIndexInput = document.getElementById("editIndex");
  const modalTitle = document.getElementById("modalTitle");
  const yearFilter = document.getElementById("yearFilter");

  // Load courses
  let courses = loadData("courses", []);

  function saveCourses() {
    saveData("courses", courses);
  }

  // Show modal
  addBtn.addEventListener("click", () => {
    modalTitle.textContent = "Add Course";
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
    const units = parseInt(unitsInput.value, 10);
    const price = parseFloat(priceInput.value);

    if (year < 1 || year > 4 || isNaN(year)) {
      alert("Year must be between 1 and 4");
      return;
    }

    if (units < 1 || isNaN(units)) {
      alert("Units must be at least 1");
      return;
    }

    if (price < 0 || isNaN(price)) {
      alert("Price per unit must be 0 or higher");
      return;
    }

    const course = {
      code: codeInput.value,
      name: nameInput.value,
      description: descInput.value,
      units,
      year,
      time: timeInput.value,
      pricePerUnit: price
    };

    if (editIndexInput.value) {
      courses[editIndexInput.value] = course;
    } else {
      courses.push(course);
    }

    saveCourses();
    renderCoursesTable();

    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // Attach edit/delete events
  function attachRowEvents() {
    document.querySelectorAll(".editBtn").forEach((btn) => {
      btn.onclick = () => {
        const index = btn.getAttribute("data-index");
        const c = courses[index];
        modalTitle.textContent = "Edit Course";
        editIndexInput.value = index;

        codeInput.value = c.code;
        nameInput.value = c.name;
        descInput.value = c.description;
        unitsInput.value = c.units;
        yearInput.value = c.year;
        timeInput.value = c.time;
        priceInput.value = c.pricePerUnit;

        modal.classList.remove("hidden");
        modal.classList.add("flex");
      };
    });

    document.querySelectorAll(".deleteBtn").forEach((btn) => {
      btn.onclick = () => {
        const index = btn.getAttribute("data-index");
        courses.splice(index, 1);
        saveCourses();
        renderCoursesTable();
      };
    });
  }

  // Action renderer for edit/delete
  function actionRenderer(item, index) {
    const container = document.createElement("div");
    container.classList.add("space-x-2");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "editBtn text-blue-600 hover:underline";
    editBtn.setAttribute("data-index", index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtn text-red-600 hover:underline";
    deleteBtn.setAttribute("data-index", index);

    container.appendChild(editBtn);
    container.appendChild(deleteBtn);
    return container;
  }

  // Render courses table
  function renderCoursesTable() {
    let filtered = [...courses].sort((a, b) => a.year - b.year);

    if (yearFilter && yearFilter.value !== "all") {
      filtered = filtered.filter((c) => c.year === parseInt(yearFilter.value, 10));
    }

    renderTable(
      tableBodyId,
      filtered,
      ["code", "name", "description", "year", "time", "units", "pricePerUnit"],
      actionRenderer,
      {
        pricePerUnit: (value) => `₱${Number(value).toFixed(2)}`
      }
    );

    attachRowEvents();
  }

  // Year filter
  if (yearFilter) {
    yearFilter.addEventListener("change", renderCoursesTable);
  }

  // Initial load
  renderCoursesTable();
});
