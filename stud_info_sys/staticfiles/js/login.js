document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    if (email == "admin@gmail.com" && password== "admin123") {
      localStorage.setItem("userEmail", email);

      window.location.href = "semester.html";
    } else {
      const messageElement = document.getElementById("wrong-credentials");
      messageElement.textContent = "Incorrect admin credentials.";
    }
  });
});