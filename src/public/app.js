// Student Management System - Client Controller
const API_BASE = '/api/v1/students';

let currentStudents = [];
let editingRollNumber = null;

// DOM Elements
const studentsTableBody = document.getElementById('studentsTableBody');
const searchInput = document.getElementById('searchInput');
const courseFilter = document.getElementById('courseFilter');
const sortBy = document.getElementById('sortBy');
const sortOrder = document.getElementById('sortOrder');
const recordCountLabel = document.getElementById('recordCountLabel');

// KPI Elements
const kpiTotal = document.getElementById('kpiTotal');
const kpiAvg = document.getElementById('kpiAvg');
const kpiTop = document.getElementById('kpiTop');
const kpiPass = document.getElementById('kpiPass');

// Modals
const studentModal = document.getElementById('studentModal');
const workflowModal = document.getElementById('workflowModal');
const studentForm = document.getElementById('studentForm');
const modalTitle = document.getElementById('modalTitle');
const rollNumberInput = document.getElementById('rollNumberInput');
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const courseInput = document.getElementById('courseInput');
const semesterInput = document.getElementById('semesterInput');
const marksInput = document.getElementById('marksInput');
const formErrorMessage = document.getElementById('formErrorMessage');
const rollHint = document.getElementById('rollHint');

// Buttons
const addStudentBtn = document.getElementById('addStudentBtn');
const resetSeedBtn = document.getElementById('resetSeedBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelFormBtn = document.getElementById('cancelFormBtn');
const workflowBtn = document.getElementById('workflowBtn');
const closeWorkflowModalBtn = document.getElementById('closeWorkflowModalBtn');
const closeWorkflowBottomBtn = document.getElementById('closeWorkflowBottomBtn');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();
  fetchStatistics();
  setupEventListeners();
});

function setupEventListeners() {
  // Search & Filters
  searchInput.addEventListener('input', debounce(() => fetchStudents(), 300));
  courseFilter.addEventListener('change', () => fetchStudents());
  sortBy.addEventListener('change', () => fetchStudents());
  sortOrder.addEventListener('change', () => fetchStudents());

  // Modal actions
  addStudentBtn.addEventListener('click', openAddModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelFormBtn.addEventListener('click', closeModal);
  studentForm.addEventListener('submit', handleFormSubmit);

  // Workflow Modal
  workflowBtn.addEventListener('click', () => workflowModal.classList.add('active'));
  closeWorkflowModalBtn.addEventListener('click', () => workflowModal.classList.remove('active'));
  closeWorkflowBottomBtn.addEventListener('click', () => workflowModal.classList.remove('active'));

  // Reset Button
  resetSeedBtn.addEventListener('click', handleResetSeed);

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === studentModal) closeModal();
    if (e.target === workflowModal) workflowModal.classList.remove('active');
  });
}

// Fetch all students matching current filters
async function fetchStudents() {
  try {
    const params = new URLSearchParams();
    if (searchInput.value.trim()) params.append('search', searchInput.value.trim());
    if (courseFilter.value) params.append('course', courseFilter.value);
    if (sortBy.value) params.append('sortBy', sortBy.value);
    if (sortOrder.value) params.append('order', sortOrder.value);

    const res = await fetch(`${API_BASE}?${params.toString()}`);
    const result = await res.json();

    if (result.success) {
      currentStudents = result.data;
      renderTable(currentStudents);
      recordCountLabel.textContent = `Showing ${currentStudents.length} of ${result.total} records`;
    } else {
      showToast(result.error?.message || 'Failed to load students', 'error');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    showToast('Network error while connecting to server', 'error');
  }
}

// Fetch analytics KPI data
async function fetchStatistics() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const result = await res.json();
    if (result.success) {
      const stats = result.data;
      kpiTotal.textContent = stats.totalStudents;
      kpiAvg.textContent = `${stats.averageMarks}%`;
      kpiTop.textContent = stats.highestMarks
        ? `${stats.highestMarks.name} (${stats.highestMarks.marks}%)`
        : 'N/A';
      kpiPass.textContent = `${stats.passingPercentage}%`;
    }
  } catch (err) {
    console.error('Failed to fetch statistics:', err);
  }
}

// Render student table rows
function renderTable(students) {
  if (!students || students.length === 0) {
    studentsTableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; padding: 32px; color: #64748b;">
          <i class="fa-regular fa-folder-open" style="font-size: 32px; margin-bottom: 8px; display: block;"></i>
          No student records found matching the criteria.
        </td>
      </tr>
    `;
    return;
  }

  studentsTableBody.innerHTML = students
    .map((student) => {
      const gradeClass = getGradeClass(student.grade);
      const isPass = student.status === 'PASS';

      return `
        <tr>
          <td><strong>${escapeHtml(student.roll_number)}</strong></td>
          <td>${escapeHtml(student.name)}</td>
          <td>${student.age}</td>
          <td>${escapeHtml(student.course)}</td>
          <td>Semester ${student.semester}</td>
          <td><strong>${Number(student.marks).toFixed(2)}</strong></td>
          <td><span class="badge ${gradeClass}">${student.grade}</span></td>
          <td>
            <span class="status-badge ${isPass ? 'status-pass' : 'status-fail'}">
              <i class="fa-solid ${isPass ? 'fa-check' : 'fa-xmark'}"></i> ${student.status}
            </span>
          </td>
          <td style="text-align: center; white-space: nowrap;">
            <button class="table-btn edit" onclick="openEditModal('${escapeHtml(student.roll_number)}')" title="Edit student">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="table-btn delete" onclick="confirmDeleteStudent('${escapeHtml(student.roll_number)}', '${escapeHtml(student.name)}')" title="Delete student">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function getGradeClass(grade) {
  switch (grade) {
    case 'A+': return 'badge-grade-aplus';
    case 'A': return 'badge-grade-a';
    case 'B': return 'badge-grade-b';
    case 'C': return 'badge-grade-c';
    case 'D': return 'badge-grade-d';
    default: return 'badge-grade-f';
  }
}

// Modal handling
function openAddModal() {
  editingRollNumber = null;
  studentForm.reset();
  formErrorMessage.classList.add('hidden');
  modalTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Add New Student';
  rollNumberInput.disabled = false;
  rollHint.textContent = 'Unique identifier (immutable once created)';
  studentModal.classList.add('active');
  rollNumberInput.focus();
}

window.openEditModal = async function (rollNumber) {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(rollNumber)}`);
    const result = await res.json();
    if (!result.success) {
      showToast(result.error?.message || 'Failed to fetch student details', 'error');
      return;
    }

    const s = result.data;
    editingRollNumber = s.roll_number;
    formErrorMessage.classList.add('hidden');
    modalTitle.innerHTML = `<i class="fa-solid fa-user-pen"></i> Edit Student: ${escapeHtml(s.roll_number)}`;
    
    rollNumberInput.value = s.roll_number;
    rollNumberInput.disabled = true;
    rollHint.textContent = 'Roll number cannot be changed (primary key)';

    nameInput.value = s.name;
    ageInput.value = s.age;
    courseInput.value = s.course;
    semesterInput.value = s.semester;
    marksInput.value = s.marks;

    studentModal.classList.add('active');
    nameInput.focus();
  } catch (err) {
    console.error('Edit fetch error:', err);
    showToast('Failed to load student details', 'error');
  }
};

function closeModal() {
  studentModal.classList.remove('active');
  formErrorMessage.classList.add('hidden');
  editingRollNumber = null;
}

// Add/Edit Submit Handler
async function handleFormSubmit(e) {
  e.preventDefault();
  formErrorMessage.classList.add('hidden');

  const payload = {
    name: nameInput.value.trim(),
    age: parseInt(ageInput.value, 10),
    course: courseInput.value.trim(),
    semester: parseInt(semesterInput.value, 10),
    marks: parseFloat(marksInput.value),
  };

  const isEdit = editingRollNumber !== null;
  const url = isEdit ? `${API_BASE}/${encodeURIComponent(editingRollNumber)}` : API_BASE;
  const method = isEdit ? 'PUT' : 'POST';

  if (!isEdit) {
    payload.roll_number = rollNumberInput.value.trim();
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!result.success) {
      const errorMsg = result.error?.details
        ? result.error.details.map((d) => d.message).join('<br>')
        : result.error?.message || 'Operation failed';
      formErrorMessage.innerHTML = errorMsg;
      formErrorMessage.classList.remove('hidden');
      return;
    }

    showToast(result.message, 'success');
    closeModal();
    fetchStudents();
    fetchStatistics();
  } catch (err) {
    console.error('Submit error:', err);
    formErrorMessage.textContent = 'Server connection error. Please try again.';
    formErrorMessage.classList.remove('hidden');
  }
}

// Delete Handler
window.confirmDeleteStudent = async function (rollNumber, name) {
  if (confirm(`Are you sure you want to delete student "${name}" (Roll No: ${rollNumber})? This action cannot be undone.`)) {
    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(rollNumber)}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (result.success) {
        showToast(result.message, 'success');
        fetchStudents();
        fetchStatistics();
      } else {
        showToast(result.error?.message || 'Failed to delete record', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error deleting student', 'error');
    }
  }
};

// Reset Seed Data
async function handleResetSeed() {
  if (confirm('Reset student records back to the default sample dataset? Any added students will be replaced.')) {
    try {
      const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
      const result = await res.json();
      if (result.success) {
        showToast('Sample dataset restored successfully!', 'info');
        fetchStudents();
        fetchStatistics();
      } else {
        showToast(result.error?.message || 'Failed to reset seed data', 'error');
      }
    } catch (err) {
      showToast('Error resetting database', 'error');
    }
  }
}

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}
