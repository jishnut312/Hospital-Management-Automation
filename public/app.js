/* =============================================
   MediCore HMS — Frontend App
   ============================================= */

const API = '';  // same origin

// =================== AUTH ===================

function getUser() {
  try { return JSON.parse(localStorage.getItem('hms_user')) || {}; } catch { return {}; }
}

function logout() {
  localStorage.removeItem('hms_token');
  localStorage.removeItem('hms_user');
  window.location.href = '/';
}

// Guard — redirect to login if no token
if (!localStorage.getItem('hms_token')) {
  window.location.href = '/';
}

// =================== INIT ===================

document.addEventListener('DOMContentLoaded', async () => {
  const user = getUser();
  const initials = (user.name || 'A').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('user-name').textContent   = user.name || 'Admin';
  document.getElementById('user-role').textContent   = user.role || 'Staff';

  // Nav click handlers
  document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });

  // Load initial data
  await loadDashboard();
  await loadPatients();
  await loadDoctors();
  await loadAppointments();
  await loadBills();

  // Populate select dropdowns in modals
  populatePatientSelects();
  populateDoctorSelect();

  // Search
  document.getElementById('patient-search').addEventListener('input', filterPatients);

  // Filter tabs
  document.getElementById('appt-filter').addEventListener('click', e => {
    if (e.target.classList.contains('filter-tab')) {
      document.querySelectorAll('#appt-filter .filter-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderAppointments(e.target.dataset.filter);
    }
  });
  document.getElementById('bill-filter').addEventListener('click', e => {
    if (e.target.classList.contains('filter-tab')) {
      document.querySelectorAll('#bill-filter .filter-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      renderBills(e.target.dataset.filter);
    }
  });

  // Form submissions
  document.getElementById('patient-form').addEventListener('submit', submitPatient);
  document.getElementById('doctor-form').addEventListener('submit', submitDoctor);
  document.getElementById('appt-form').addEventListener('submit', submitAppointment);
  document.getElementById('bill-form').addEventListener('submit', submitBill);

  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
});

// =================== NAVIGATION ===================

function navigateTo(section) {
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const navEl = document.getElementById('nav-' + section);
  if (navEl) navEl.classList.add('active');

  // Show section
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById('section-' + section);
  if (sec) sec.classList.add('active');

  // Update topbar
  const titles = {
    dashboard:    ['Dashboard', 'Overview of hospital operations'],
    patients:     ['Patients', 'Manage patient records'],
    appointments: ['Appointments', 'Schedule and manage appointments'],
    doctors:      ['Doctors', 'Medical staff directory'],
    billing:      ['Billing', 'Invoices and payment tracking'],
  };
  const [title, sub] = titles[section] || ['Dashboard', ''];
  document.getElementById('topbar-title').textContent = title;
  document.getElementById('topbar-sub').textContent   = sub;
}

// =================== MODAL HELPERS ===================

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  // Clear alerts
  const alertEl = document.querySelector('#' + id + ' .alert');
  if (alertEl) { alertEl.className = 'alert'; alertEl.textContent = ''; }
}

function showModalAlert(modalId, msg, type = 'error') {
  const el = document.getElementById(modalId + '-alert');
  if (!el) return;
  el.className = 'alert alert-' + type + ' show';
  el.textContent = msg;
}

// =================== DASHBOARD ===================

let dashData = {};

async function loadDashboard() {
  try {
    const res  = await fetch(API + '/api/dashboard');
    dashData   = await res.json();
    document.getElementById('stat-patients').textContent     = dashData.totalPatients;
    document.getElementById('stat-appointments').textContent = dashData.appointmentsToday;
    document.getElementById('stat-doctors').textContent      = dashData.doctorsOnDuty;
    document.getElementById('stat-bills').textContent        = dashData.pendingBills;
  } catch (e) { console.error('Dashboard load error', e); }
}

// =================== PATIENTS ===================

let allPatients = [];

async function loadPatients() {
  const res = await fetch(API + '/api/patients');
  allPatients = await res.json();
  renderPatients(allPatients);
}

function renderPatients(list) {
  const tbody = document.getElementById('patients-tbody');
  const empty = document.getElementById('patients-empty');
  tbody.innerHTML = '';
  if (!list.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.forEach(p => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr data-patient-id="${p.id}">
        <td><span style="color:var(--text-muted);font-size:.75rem">#${p.id}</span></td>
        <td><strong>${esc(p.name)}</strong></td>
        <td>${p.age}</td>
        <td>${esc(p.gender)}</td>
        <td><code style="font-size:.78rem;color:var(--accent)">${esc(p.blood)}</code></td>
        <td style="color:var(--text-muted)">${esc(p.condition)}</td>
        <td><span class="badge badge-${p.status.toLowerCase()}">${esc(p.status)}</span></td>
      </tr>`);
  });
}

function filterPatients() {
  const q = document.getElementById('patient-search').value.toLowerCase();
  renderPatients(allPatients.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.condition.toLowerCase().includes(q) ||
    p.gender.toLowerCase().includes(q)
  ));
}

async function submitPatient(e) {
  e.preventDefault();
  const btn = document.getElementById('patient-submit-btn');
  btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const res = await fetch(API + '/api/patients', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:      document.getElementById('p-name').value.trim(),
        age:       document.getElementById('p-age').value,
        gender:    document.getElementById('p-gender').value,
        blood:     document.getElementById('p-blood').value,
        phone:     document.getElementById('p-phone').value.trim(),
        condition: document.getElementById('p-condition').value.trim(),
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showModalAlert('patient-modal', `Patient "${data.name}" registered! (ID: ${data.id})`, 'success');
    document.getElementById('patient-form').reset();
    await loadPatients();
    populatePatientSelects();
  } catch (err) {
    showModalAlert('patient-modal', err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Register Patient';
  }
}

// =================== DOCTORS ===================

let allDoctors = [];

async function loadDoctors() {
  const res  = await fetch(API + '/api/doctors');
  allDoctors = await res.json();
  renderDoctors(allDoctors);
}

function renderDoctors(list) {
  const tbody = document.getElementById('doctors-tbody');
  tbody.innerHTML = '';
  list.forEach(d => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr data-doctor-id="${d.id}">
        <td><span style="color:var(--text-muted);font-size:.75rem">#${d.id}</span></td>
        <td><strong>${esc(d.name)}</strong></td>
        <td><span class="badge badge-admin">${esc(d.specialty)}</span></td>
        <td style="color:var(--text-muted)">${esc(d.phone)}</td>
        <td style="color:var(--text-muted)">${esc(d.email)}</td>
        <td><span class="badge ${d.available ? 'badge-available' : 'badge-busy'}">${d.available ? 'Available' : 'Busy'}</span></td>
      </tr>`);
  });
}

async function submitDoctor(e) {
  e.preventDefault();
  const btn = document.getElementById('doctor-submit-btn');
  btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const res = await fetch(API + '/api/doctors', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:      document.getElementById('d-name').value.trim(),
        specialty: document.getElementById('d-specialty').value,
        phone:     document.getElementById('d-phone').value.trim(),
        email:     document.getElementById('d-email').value.trim(),
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showModalAlert('doctor-modal', `Doctor "${data.name}" added!`, 'success');
    document.getElementById('doctor-form').reset();
    await loadDoctors();
    populateDoctorSelect();
  } catch (err) {
    showModalAlert('doctor-modal', err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Add Doctor';
  }
}

// =================== APPOINTMENTS ===================

let allAppointments = [];

async function loadAppointments() {
  const res       = await fetch(API + '/api/appointments');
  allAppointments = await res.json();
  renderAppointments('All');
}

function renderAppointments(filter = 'All') {
  const list  = filter === 'All' ? allAppointments : allAppointments.filter(a => a.status === filter);
  const tbody = document.getElementById('appointments-tbody');
  const empty = document.getElementById('appointments-empty');
  tbody.innerHTML = '';
  if (!list.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.forEach(a => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr data-appt-id="${a.id}">
        <td><span style="color:var(--text-muted);font-size:.75rem">#${a.id}</span></td>
        <td><strong>${esc(a.patientName)}</strong></td>
        <td style="color:var(--text-muted)">${esc(a.doctorName)}</td>
        <td>${esc(a.date)}</td>
        <td>${esc(a.time)}</td>
        <td><span class="badge badge-${a.status.toLowerCase()}">${esc(a.status)}</span></td>
        <td>
          ${a.status === 'Scheduled' ? `
            <button class="btn btn-success btn-sm" onclick="updateApptStatus(${a.id},'Completed')">Complete</button>
            <button class="btn btn-danger btn-sm" style="margin-left:4px" onclick="updateApptStatus(${a.id},'Cancelled')">Cancel</button>
          ` : '—'}
        </td>
      </tr>`);
  });
}

async function updateApptStatus(id, status) {
  const res = await fetch(API + '/api/appointments/' + id, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (res.ok) {
    await loadAppointments();
    const activeFilter = document.querySelector('#appt-filter .filter-tab.active')?.dataset.filter || 'All';
    renderAppointments(activeFilter);
  }
}

async function submitAppointment(e) {
  e.preventDefault();
  const btn = document.getElementById('appt-submit-btn');
  btn.disabled = true; btn.textContent = 'Booking…';
  try {
    const res = await fetch(API + '/api/appointments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: document.getElementById('a-patient').value,
        doctorId:  document.getElementById('a-doctor').value,
        date:      document.getElementById('a-date').value,
        time:      document.getElementById('a-time').value,
        notes:     document.getElementById('a-notes').value.trim(),
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showModalAlert('appt-modal', `Appointment booked for "${data.patientName}"!`, 'success');
    document.getElementById('appt-form').reset();
    await loadAppointments();
  } catch (err) {
    showModalAlert('appt-modal', err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Book Appointment';
  }
}

// =================== BILLING ===================

let allBills = [];

async function loadBills() {
  const res = await fetch(API + '/api/bills');
  allBills  = await res.json();
  renderBills('All');
}

function renderBills(filter = 'All') {
  const list  = filter === 'All' ? allBills : allBills.filter(b => b.status === filter);
  const tbody = document.getElementById('bills-tbody');
  const empty = document.getElementById('bills-empty');
  tbody.innerHTML = '';
  if (!list.length) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  list.forEach(b => {
    tbody.insertAdjacentHTML('beforeend', `
      <tr data-bill-id="${b.id}">
        <td><span style="color:var(--text-muted);font-size:.75rem">#${b.id}</span></td>
        <td><strong>${esc(b.patientName)}</strong></td>
        <td style="color:var(--text-muted)">${esc(b.description)}</td>
        <td><strong>$${Number(b.amount).toFixed(2)}</strong></td>
        <td style="color:var(--text-muted)">${esc(b.date)}</td>
        <td><span class="badge badge-${b.status.toLowerCase()}">${esc(b.status)}</span></td>
        <td>
          ${b.status === 'Pending'
            ? `<button class="btn btn-success btn-sm" id="pay-btn-${b.id}" onclick="payBill(${b.id})">Mark Paid</button>`
            : '—'}
        </td>
      </tr>`);
  });
}

async function payBill(id) {
  const btn = document.getElementById('pay-btn-' + id);
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  const res = await fetch(API + '/api/bills/' + id + '/pay', { method: 'PATCH' });
  if (res.ok) {
    await loadBills();
    const activeFilter = document.querySelector('#bill-filter .filter-tab.active')?.dataset.filter || 'All';
    renderBills(activeFilter);
    await loadDashboard();
  }
}

async function submitBill(e) {
  e.preventDefault();
  const btn = document.getElementById('bill-submit-btn');
  btn.disabled = true; btn.textContent = 'Creating…';
  try {
    const res = await fetch(API + '/api/bills', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId:   document.getElementById('b-patient').value,
        amount:      document.getElementById('b-amount').value,
        description: document.getElementById('b-desc').value.trim(),
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    showModalAlert('bill-modal', `Bill created for "${data.patientName}" — $${Number(data.amount).toFixed(2)}`, 'success');
    document.getElementById('bill-form').reset();
    await loadBills();
    await loadDashboard();
  } catch (err) {
    showModalAlert('bill-modal', err.message);
  } finally {
    btn.disabled = false; btn.textContent = 'Create Bill';
  }
}

// =================== SELECT HELPERS ===================

function populatePatientSelects() {
  ['a-patient', 'b-patient'].forEach(selId => {
    const sel = document.getElementById(selId);
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = '<option value="">Select patient</option>';
    allPatients.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id; opt.textContent = `${p.name} (#${p.id})`;
      sel.appendChild(opt);
    });
    if (cur) sel.value = cur;
  });
}

function populateDoctorSelect() {
  const sel = document.getElementById('a-doctor');
  if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">Select doctor</option>';
  allDoctors.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id; opt.textContent = `${d.name} — ${d.specialty}`;
    sel.appendChild(opt);
  });
  if (cur) sel.value = cur;
}

// =================== UTILS ===================

function esc(str) {
  return String(str ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
