const form = document.getElementById('employeeForm');

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');

  if (editId) {
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    const employee = employees.find(e => e.id == editId);
    if (employee) {
      document.getElementById('firstName').value = employee.firstName;
      document.getElementById('lastName').value = employee.lastName;
      document.getElementById('email').value = employee.email;
      document.getElementById('department').value = employee.department;
      document.getElementById('role').value = employee.role;
    }
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const department = document.getElementById('department').value;
  const role = document.getElementById('role').value;

  if (!firstName || !lastName || !email || !department || !role) {
    alert('Please fill in all fields.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Invalid email format.');
    return;
  }

  const employees = JSON.parse(localStorage.getItem("employees")) || [];
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('id');

  if (editId) {
    const index = employees.findIndex(e => e.id == editId);
    if (index !== -1) {
      employees[index] = {
        id: parseInt(editId),
        firstName,
        lastName,
        email,
        department,
        role
      };
    }
  } else {
    const newEmployee = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      department,
      role
    };
    employees.push(newEmployee);
  }

  localStorage.setItem("employees", JSON.stringify(employees));
  window.location.href = 'dashboard.html';
});

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

