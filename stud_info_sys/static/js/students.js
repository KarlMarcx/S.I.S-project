import { renderTable } from "./utils/functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://127.0.0.1:8000/api/students";

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


  let students = [];


  async function getStudents() {
    const res = await fetch(`${API_URL}/`);
    if (!res.ok) throw new Error("Failed to fetch students");
    return await res.json();
  }

  async function createStudent(student) {
    const res = await fetch(`${API_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Failed to create student");
    return await res.json();
  }

  async function updateStudent(studentId, student) {
    const res = await fetch(`${API_URL}/${studentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Failed to update student");
    return await res.json();
  }

  async function deleteStudent(studentId) {
    const res = await fetch(`${API_URL}/${studentId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete student");
    return true;
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
   form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const year = parseInt(yearInput.value, 10);
    if (year < 1 || year > 4 || isNaN(year)) {
      alert("Year must be between 1 and 4");
      return;
    }

    const studentData = {
      full_name: nameInput.value,
      email: emailInput.value,
      date_of_birth: bdayInput.value,
      phone: phoneInput.value,
      address: addressInput.value,
      year: year,
    };

    try {
      if (editIndexInput.value) {
        // Update existing student
        const id = students[editIndexInput.value].id;
        await updateStudent(id, studentData);
      } else {
        // Add new student
        await createStudent(studentData);
      }
      await renderStudentsTable();
    } catch (err) {
      alert(err.message);
    }

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
      btn.onclick = async () => {
        const studentId = parseInt(btn.getAttribute("data-id"));
        if (confirm("Are you sure you want to delete this student?")) {
          try {
            await deleteStudent(studentId);
            await renderStudentsTable();
          } catch (err) {
            alert(err.message);
          }
        }
      };
    });
  }

  // Render students table
async function renderStudentsTable() {
  try {
    // Show loading state
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="border p-4 text-center text-gray-500">
          Loading students...
        </td>
      </tr>
    `;

    students = await getStudents();

    // Sort by year
    let filtered = [...students].sort((a, b) => a.year - b.year);

    // Apply year filter
    if (yearFilter && yearFilter.value !== "all") {
      filtered = filtered.filter(
        (s) => s.year === parseInt(yearFilter.value, 10)
      );
    }

    // Define columns
    const columns = [
      "id",
      "full_name",
      "email",
      "date_of_birth",
      "phone",
      "address",
      "year",
    ];

    renderTable("studentsTableBody", filtered, columns, (student) => {
      const div = document.createElement("div");
      div.className = "space-x-2";
      div.innerHTML = `
        <button class="editBtn text-blue-600 hover:underline" data-id="${student.id}">Edit</button>
        <button class="deleteBtn text-red-600 hover:underline" data-id="${student.id}">Delete</button>
      `;
      return div;
    });

    attachRowEvents();
  } catch (err) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="border p-4 text-center text-red-500">
          Error loading students: ${err.message}
        </td>
      </tr>
    `;
  }
}



  // Filter change event
  if (yearFilter) {
    yearFilter.addEventListener("change", renderStudentsTable);
  }

  // Initial load
  renderStudentsTable();
});
