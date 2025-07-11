let employees = JSON.parse(localStorage.getItem("employees")) || [
  { id: 1, firstName: "Alice", lastName: "Smith", email: "alice@example.com", department: "HR", role: "Manager" },
  { id: 2, firstName: "Bob", lastName: "Johnson", email: "bob@example.com", department: "IT", role: "Developer" },
  { id: 3, firstName: "Charlie", lastName: "Lee", email: "charlie@example.com", department: "Finance", role: "Analyst" }
];

let filteredEmployees = [...employees];
let currentPage = 1;
let pageSize = 10;

document.getElementById("filterBtn").addEventListener("click", () => {
  document.getElementById("filterSidebar").classList.toggle("hidden");
});

document.getElementById("searchInput").addEventListener("input", searchEmployees);
document.getElementById("sortSelect").addEventListener("change", sortEmployees);
document.getElementById("showSelect").addEventListener("change", e => {
  pageSize = parseInt(e.target.value);
  currentPage = 1;
  renderEmployees();
});
document.getElementById("applyFilter").addEventListener("click", applyFilters);
document.getElementById("resetFilter").addEventListener("click", () => {
  document.getElementById("filterFirstName").value = "";
  document.getElementById("filterDepartment").value = "";
  document.getElementById("filterRole").value = "";
  filteredEmployees = [...employees];
  currentPage = 1;
  renderEmployees();
});

function searchEmployees(e) {
  const term = e.target.value.toLowerCase();
  filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(term) ||
    emp.lastName.toLowerCase().includes(term) ||
    emp.email.toLowerCase().includes(term)
  );
  currentPage = 1;
  renderEmployees();
}

function sortEmployees(e) {
  const sortBy = e.target.value;
  if (sortBy) {
    filteredEmployees.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }
  renderEmployees();
}

function applyFilters() {
  const firstName = document.getElementById("filterFirstName").value.toLowerCase();
  const department = document.getElementById("filterDepartment").value.toLowerCase();
  const role = document.getElementById("filterRole").value.toLowerCase();

  filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(firstName) &&
    emp.department.toLowerCase().includes(department) &&
    emp.role.toLowerCase().includes(role)
  );
  currentPage = 1;
  renderEmployees();
}

function renderEmployees() {
  const list = document.getElementById("employeeList");
  list.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filteredEmployees.slice(start, end);

  if (pageItems.length === 0) {
    list.innerHTML = "<p>No employees found.</p>";
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  pageItems.forEach(emp => {
    list.innerHTML += `
      <div class="employee-card">
        <p><strong>${emp.firstName} ${emp.lastName}</strong></p>
        <p>Email: ${emp.email}</p>
        <p>Department: ${emp.department}</p>
        <p>Role: ${emp.role}</p>
        <button onclick="editEmployee(${emp.id})">Edit</button>
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      </div>
    `;
  });

  renderPaginationControls();
}

function renderPaginationControls() {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let controls = `<button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(-1)">Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    controls += `<button ${i === currentPage ? "disabled" : ""} onclick="goToPage(${i})">${i}</button>`;
  }

  controls += `<button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(1)">Next</button>`;

  pagination.innerHTML = controls;
}

function changePage(dir) {
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);
  currentPage += dir;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;
  renderEmployees();
}

function goToPage(num) {
  currentPage = num;
  renderEmployees();
}

function editEmployee(id) {
  window.location.href = `form.html?id=${id}`;
}

function deleteEmployee(id) {
  employees = employees.filter(emp => emp.id !== id);
  localStorage.setItem("employees", JSON.stringify(employees));
  filteredEmployees = [...employees];
  renderEmployees();
}

renderEmployees();
