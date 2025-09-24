
import { loadData, saveData } from "./utils/storage.js";
import { renderTable } from "./utils/functions.js";

// Peso formatter
function formatPeso(n) {
  if (typeof n !== "number") return n;
  return "₱" + n.toLocaleString("en-PH", { maximumFractionDigits: 2 });
}

// DOM Elements
const newTransactionBtn = document.getElementById("newTransactionBtn");

const studentIdModal = document.getElementById("studentIdModal");
const studentIdForm = document.getElementById("studentIdForm");
const studentIdInput = document.getElementById("studentIdInput");
const cancelStudentId = document.getElementById("cancelStudentId");

const transactionModal = document.getElementById("transactionModal");
const studentInfo = document.getElementById("studentInfo");
const enrolledCoursesBody = document.getElementById("enrolledCoursesBody");
const otherFeesEl = document.getElementById("otherFees");
const totalAmountEl = document.getElementById("totalAmount");
const paymentMode = document.getElementById("paymentMode");
const paymentType = document.getElementById("paymentType");
const cancelTransaction = document.getElementById("cancelTransaction");
const saveTransaction = document.getElementById("saveTransaction");

let selectedStudent = null;
let calculatedTotal = 0;

// Render Transactions Table
function renderTransactionsTable() {
  const transactions = loadData("transactions", []);

  renderTable(
    "billingTableBody",
    transactions,
    [
      "transactionId",   // Transaction ID
      "studentId",       // Student ID
      "year",            // Year
      "amount",          // Amount
      "transactionName", // Type of Payment (Full / Partial)
      "modeOfPayment",   // Mode of Payment (Cash / Online)
      "date"             // Date
    ],
    (item, index) => {
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.className = "deleteBtn text-red-600 hover:underline";
      btn.addEventListener("click", () => deleteTransaction(index));
      return btn;
    },
    {
      amount: (v) => formatPeso(v),
      date: (v) => v,
    }
  );
}

// Delete Transaction
function deleteTransaction(index) {
  const transactions = loadData("transactions", []);
  if (!confirm("Are you sure you want to delete this transaction?")) return;

  transactions.splice(index, 1);
  saveData("transactions", transactions);
  renderTransactionsTable();
}

// Student Validation
studentIdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = studentIdInput.value.trim();

  const students = loadData("students", []);
  const enrollments = loadData("enrollments", []);

  const found = students.find((s) => s.id === studentId);
  if (!found) {
    alert("Student ID not found!");
    return;
  }

  const enrollment = enrollments.find((e) => e.studentId === studentId);
  found.enrolledCourses = enrollment ? enrollment.courses : [];

  selectedStudent = found;
  studentIdInput.value = "";

  closeModal(studentIdModal);
  loadStudentPreview();
  openModal(transactionModal);
});

// Load Student Preview
function loadStudentPreview() {
  if (!selectedStudent) return;

  studentInfo.innerHTML = `
    <div class="bg-gray-50 p-3 rounded border">
      <p><strong>ID:</strong> ${selectedStudent.id}</p>
      <p><strong>Name:</strong> ${selectedStudent.name}</p>
      <p><strong>Year:</strong> ${selectedStudent.year}</p>
    </div>
  `;

  enrolledCoursesBody.innerHTML = "";
  calculatedTotal = 0;

  const list = Array.isArray(selectedStudent.enrolledCourses)
    ? selectedStudent.enrolledCourses
    : [];

  if (list.length === 0) {
    enrolledCoursesBody.innerHTML = `
      <tr><td colspan="4" class="border p-3 text-center text-gray-500">No enrolled courses found</td></tr>
    `;
  } else {
    list.forEach((course) => {
      const units = Number(course.units) || 0;
      const ppu = Number(course.pricePerUnit) || 0;
      const subtotal = units * ppu;
      calculatedTotal += subtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="border p-2">${course.name ?? course.code ?? "Course"}</td>
        <td class="border p-2">${units}</td>
        <td class="border p-2">${formatPeso(ppu)}</td>
        <td class="border p-2">${formatPeso(subtotal)}</td>
      `;
      enrolledCoursesBody.appendChild(row);
    });
  }

  const otherFees = 500;
  calculatedTotal += otherFees;

  otherFeesEl.textContent = `Other Fees: ${formatPeso(otherFees)}`;
  totalAmountEl.textContent = `Total: ${formatPeso(calculatedTotal)}`;

  paymentType.value = "full";
  paymentMode.value = "cash";
}

// Save Transaction
saveTransaction.addEventListener("click", () => {
  if (!selectedStudent) {
    alert("No student selected!");
    return;
  }

  const transactions = loadData("transactions", []);

  const typeLabel = paymentType.value === "full" ? "Full" : "Partial";
  const modeLabel = paymentMode.value === "cash" ? "Cash" : "Online Payment";

  const newTx = {
    transactionId: generateTxId(transactions),
    studentId: selectedStudent.id,
    year: selectedStudent.year,
    amount: calculatedTotal,
    transactionName: typeLabel,
    modeOfPayment: modeLabel,
    date: new Date().toLocaleString(),
  };

  transactions.push(newTx);
  saveData("transactions", transactions);

  closeModal(transactionModal);
  renderTransactionsTable();
  alert("Transaction saved successfully!");
});

// Utilities
function generateTxId(transactions) {
  const last =
    transactions
      .map((t) => t.transactionId)
      .filter(Boolean)
      .map((id) => Number(String(id).replace(/\D/g, "")) || 0)
      .sort((a, b) => b - a)[0] || 0;

  const next = (last + 1).toString().padStart(3, "0");
  return `TX${next}`;
}

// Modal helpers
function openModal(modal) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}
function closeModal(modal) {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Event Listeners
newTransactionBtn.addEventListener("click", () => openModal(studentIdModal));
cancelStudentId.addEventListener("click", () => closeModal(studentIdModal));
cancelTransaction.addEventListener("click", () => closeModal(transactionModal));

// Init
renderTransactionsTable();
