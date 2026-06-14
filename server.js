const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// =================== IN-MEMORY DATA STORE ===================

let patients = [
  { id: 1, name: 'James Wilson',   age: 45, gender: 'Male',   blood: 'A+', phone: '555-1001', condition: 'Hypertension',  status: 'Active' },
  { id: 2, name: 'Sarah Connor',   age: 32, gender: 'Female', blood: 'O-', phone: '555-1002', condition: 'Diabetes',       status: 'Active' },
  { id: 3, name: 'Robert Chen',    age: 61, gender: 'Male',   blood: 'B+', phone: '555-1003', condition: 'Arthritis',      status: 'Active' },
  { id: 4, name: 'Emily Brown',    age: 27, gender: 'Female', blood: 'AB+',phone: '555-1004', condition: 'Migraine',       status: 'Discharged' },
  { id: 5, name: 'Michael Torres', age: 53, gender: 'Male',   blood: 'A-', phone: '555-1005', condition: 'Cardiac Issue',  status: 'Active' },
];

let doctors = [
  { id: 1, name: 'Dr. Amelia Hart',    specialty: 'Cardiology',    phone: '555-2001', email: 'hart@hospital.com',    available: true },
  { id: 2, name: 'Dr. Brian Patel',    specialty: 'Neurology',     phone: '555-2002', email: 'patel@hospital.com',   available: true },
  { id: 3, name: 'Dr. Clara Nguyen',   specialty: 'Orthopedics',   phone: '555-2003', email: 'nguyen@hospital.com',  available: false },
  { id: 4, name: 'Dr. David Kim',      specialty: 'Pediatrics',    phone: '555-2004', email: 'kim@hospital.com',     available: true },
  { id: 5, name: 'Dr. Elena Rossi',    specialty: 'Dermatology',   phone: '555-2005', email: 'rossi@hospital.com',   available: true },
];

let appointments = [
  { id: 1, patientId: 1, patientName: 'James Wilson',   doctorId: 1, doctorName: 'Dr. Amelia Hart',  date: '2026-06-10', time: '09:00', status: 'Scheduled', notes: 'Routine checkup' },
  { id: 2, patientId: 2, patientName: 'Sarah Connor',   doctorId: 2, doctorName: 'Dr. Brian Patel',  date: '2026-06-10', time: '10:30', status: 'Scheduled', notes: 'Follow-up' },
  { id: 3, patientId: 3, patientName: 'Robert Chen',    doctorId: 3, doctorName: 'Dr. Clara Nguyen', date: '2026-06-09', time: '14:00', status: 'Completed', notes: 'X-ray review' },
  { id: 4, patientId: 4, patientName: 'Emily Brown',    doctorId: 4, doctorName: 'Dr. David Kim',    date: '2026-06-08', time: '11:00', status: 'Cancelled', notes: '' },
  { id: 5, patientId: 5, patientName: 'Michael Torres', doctorId: 1, doctorName: 'Dr. Amelia Hart',  date: '2026-06-11', time: '08:30', status: 'Scheduled', notes: 'ECG required' },
];

let bills = [
  { id: 1, patientId: 1, patientName: 'James Wilson',   amount: 450.00,  status: 'Paid',    date: '2026-06-01', description: 'Consultation + ECG' },
  { id: 2, patientId: 2, patientName: 'Sarah Connor',   amount: 220.50,  status: 'Pending', date: '2026-06-05', description: 'Blood tests' },
  { id: 3, patientId: 3, patientName: 'Robert Chen',    amount: 1200.00, status: 'Pending', date: '2026-06-07', description: 'X-ray + Consultation' },
  { id: 4, patientId: 4, patientName: 'Emily Brown',    amount: 180.00,  status: 'Paid',    date: '2026-05-28', description: 'MRI Scan' },
  { id: 5, patientId: 5, patientName: 'Michael Torres', amount: 3500.00, status: 'Pending', date: '2026-06-07', description: 'Surgery - Pre-op' },
];

const USERS = [
  { username: 'admin', password: 'password123', role: 'Admin', name: 'Dr. Admin' },
  { username: 'nurse', password: 'nurse123',    role: 'Nurse', name: 'Nurse Mary' },
];

let nextId = { patients: 6, doctors: 6, appointments: 6, bills: 6 };

// =================== AUTH ===================

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'username and password required' });
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: 'demo-token-' + user.username, role: user.role, name: user.name });
});

// =================== DASHBOARD ===================

app.get('/api/dashboard', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  res.json({
    totalPatients:       patients.length,
    appointmentsToday:   appointments.filter(a => a.date === today).length,
    doctorsOnDuty:       doctors.filter(d => d.available).length,
    pendingBills:        bills.filter(b => b.status === 'Pending').length,
    pendingBillsAmount:  bills.filter(b => b.status === 'Pending').reduce((s, b) => s + b.amount, 0),
  });
});

// =================== PATIENTS ===================

app.get('/api/patients', (req, res) => res.json(patients));

app.get('/api/patients/:id', (req, res) => {
  const p = patients.find(p => p.id === +req.params.id);
  if (!p) return res.status(404).json({ error: 'Patient not found' });
  res.json(p);
});

app.post('/api/patients', (req, res) => {
  const { name, age, gender, blood, phone, condition } = req.body;
  if (!name || !age || !gender)
    return res.status(400).json({ error: 'name, age and gender are required' });
  const p = { id: nextId.patients++, name, age: +age, gender, blood: blood || 'Unknown',
               phone: phone || '', condition: condition || '', status: 'Active' };
  patients.push(p);
  res.status(201).json(p);
});

app.delete('/api/patients/:id', (req, res) => {
  const idx = patients.findIndex(p => p.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Patient not found' });
  patients.splice(idx, 1);
  res.json({ message: `Patient ${req.params.id} deleted` });
});

// =================== DOCTORS ===================

app.get('/api/doctors', (req, res) => res.json(doctors));

app.get('/api/doctors/:id', (req, res) => {
  const d = doctors.find(d => d.id === +req.params.id);
  if (!d) return res.status(404).json({ error: 'Doctor not found' });
  res.json(d);
});

app.post('/api/doctors', (req, res) => {
  const { name, specialty, phone, email } = req.body;
  if (!name || !specialty)
    return res.status(400).json({ error: 'name and specialty are required' });
  const d = { id: nextId.doctors++, name, specialty, phone: phone || '',
               email: email || '', available: true };
  doctors.push(d);
  res.status(201).json(d);
});

// =================== APPOINTMENTS ===================

app.get('/api/appointments', (req, res) => res.json(appointments));

app.post('/api/appointments', (req, res) => {
  const { patientId, doctorId, date, time, notes } = req.body;
  if (!patientId || !doctorId || !date || !time)
    return res.status(400).json({ error: 'patientId, doctorId, date, and time are required' });
  const patient = patients.find(p => p.id === +patientId);
  const doctor  = doctors.find(d => d.id === +doctorId);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  if (!doctor)  return res.status(404).json({ error: 'Doctor not found' });
  const a = { id: nextId.appointments++, patientId: +patientId, patientName: patient.name,
               doctorId: +doctorId, doctorName: doctor.name, date, time,
               status: 'Scheduled', notes: notes || '' };
  appointments.push(a);
  res.status(201).json(a);
});

app.patch('/api/appointments/:id', (req, res) => {
  const a = appointments.find(a => a.id === +req.params.id);
  if (!a) return res.status(404).json({ error: 'Appointment not found' });
  const { status, notes } = req.body;
  const valid = ['Scheduled', 'Completed', 'Cancelled'];
  if (status && !valid.includes(status))
    return res.status(400).json({ error: 'Invalid status' });
  if (status) a.status = status;
  if (notes !== undefined) a.notes = notes;
  res.json(a);
});

// =================== BILLS ===================

app.get('/api/bills', (req, res) => res.json(bills));

app.post('/api/bills', (req, res) => {
  const { patientId, amount, description } = req.body;
  if (!patientId || !amount)
    return res.status(400).json({ error: 'patientId and amount are required' });
  const patient = patients.find(p => p.id === +patientId);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  const b = { id: nextId.bills++, patientId: +patientId, patientName: patient.name,
               amount: +amount, status: 'Pending',
               date: new Date().toISOString().slice(0, 10),
               description: description || '' };
  bills.push(b);
  res.status(201).json(b);
});

app.patch('/api/bills/:id/pay', (req, res) => {
  const b = bills.find(b => b.id === +req.params.id);
  if (!b) return res.status(404).json({ error: 'Bill not found' });
  if (b.status === 'Paid') return res.status(409).json({ error: 'Bill already paid' });
  b.status = 'Paid';
  res.json(b);
});

// =================== START ===================

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Hospital server running at http://localhost:${PORT}`));
