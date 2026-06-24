// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * API Tests (@api)
 * Uses Playwright's request context — no browser needed.
 */

const BASE = process.env.API_BASE_URL || 'https://jishnut77.pythonanywhere.com';

// =================== AUTH ===================

test.describe('POST /api/login @api', () => {
  test('returns token on valid credentials', async ({ request }) => {
    const res = await request.post(`${BASE}/api/login`, {
      data: { username: 'admin', password: 'password123' }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('name');
    expect(body.token).toContain('admin');
  });

  test('returns 401 for wrong password', async ({ request }) => {
    const res = await request.post(`${BASE}/api/login`, {
      data: { username: 'admin', password: 'wrongpass' }
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 401 for unknown user', async ({ request }) => {
    const res = await request.post(`${BASE}/api/login`, {
      data: { username: 'ghost', password: 'anything' }
    });
    expect(res.status()).toBe(401);
  });

  test('returns 400 when fields are missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/login`, { data: {} });
    expect(res.status()).toBe(400);
  });

  test('nurse credentials also work', async ({ request }) => {
    const res = await request.post(`${BASE}/api/login`, {
      data: { username: 'nurse', password: 'nurse123' }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.role).toBe('Nurse');
  });
});

// =================== DASHBOARD ===================

test.describe('GET /api/dashboard @api', () => {
  test('returns 200 with stats object', async ({ request }) => {
    const res = await request.get(`${BASE}/api/dashboard`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('totalPatients');
    expect(body).toHaveProperty('appointmentsToday');
    expect(body).toHaveProperty('doctorsOnDuty');
    expect(body).toHaveProperty('pendingBills');
    expect(body).toHaveProperty('pendingBillsAmount');
  });

  test('totalPatients is a positive number', async ({ request }) => {
    const res  = await request.get(`${BASE}/api/dashboard`);
    const body = await res.json();
    expect(typeof body.totalPatients).toBe('number');
    expect(body.totalPatients).toBeGreaterThan(0);
  });

  test('doctorsOnDuty is a non-negative number', async ({ request }) => {
    const res  = await request.get(`${BASE}/api/dashboard`);
    const body = await res.json();
    expect(body.doctorsOnDuty).toBeGreaterThanOrEqual(0);
  });
});

// =================== PATIENTS ===================

test.describe('GET /api/patients @api', () => {
  test('returns 200 with array', async ({ request }) => {
    const res = await request.get(`${BASE}/api/patients`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('each patient has required fields', async ({ request }) => {
    const res      = await request.get(`${BASE}/api/patients`);
    const patients = await res.json();
    for (const p of patients) {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('age');
      expect(p).toHaveProperty('gender');
      expect(p).toHaveProperty('status');
    }
  });

  test('returns JSON content-type', async ({ request }) => {
    const res = await request.get(`${BASE}/api/patients`);
    expect(res.headers()['content-type']).toContain('application/json');
  });
});

test.describe('GET /api/patients/:id @api', () => {
  test('returns patient by valid id', async ({ request }) => {
    const res = await request.get(`${BASE}/api/patients/1`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.name).toBeTruthy();
  });

  test('returns 404 for unknown id', async ({ request }) => {
    const res = await request.get(`${BASE}/api/patients/9999`);
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });
});

test.describe('POST /api/patients @api', () => {
  test('creates patient with valid data', async ({ request }) => {
    const res = await request.post(`${BASE}/api/patients`, {
      data: { name: 'Test Patient', age: 30, gender: 'Female', blood: 'B+', condition: 'Flu' }
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.name).toBe('Test Patient');
    expect(body.gender).toBe('Female');
    expect(body.status).toBe('Active');
    expect(body).toHaveProperty('id');
  });

  test('returns 400 when name is missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/patients`, {
      data: { age: 25, gender: 'Male' }
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error');
  });

  test('returns 400 when gender is missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/patients`, {
      data: { name: 'No Gender', age: 25 }
    });
    expect(res.status()).toBe(400);
  });
});

// =================== DOCTORS ===================

test.describe('GET /api/doctors @api', () => {
  test('returns array of doctors', async ({ request }) => {
    const res  = await request.get(`${BASE}/api/doctors`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('each doctor has id, name, specialty, available', async ({ request }) => {
    const res     = await request.get(`${BASE}/api/doctors`);
    const doctors = await res.json();
    for (const d of doctors) {
      expect(d).toHaveProperty('id');
      expect(d).toHaveProperty('name');
      expect(d).toHaveProperty('specialty');
      expect(d).toHaveProperty('available');
    }
  });
});

test.describe('POST /api/doctors @api', () => {
  test('creates doctor with valid data', async ({ request }) => {
    const res = await request.post(`${BASE}/api/doctors`, {
      data: { name: 'Dr. New Doc', specialty: 'Surgery', email: 'new@hospital.com' }
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.name).toBe('Dr. New Doc');
    expect(body.specialty).toBe('Surgery');
    expect(body.available).toBe(true);
  });

  test('returns 400 when specialty is missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/doctors`, {
      data: { name: 'Dr. Incomplete' }
    });
    expect(res.status()).toBe(400);
  });
});

// =================== APPOINTMENTS ===================

test.describe('GET /api/appointments @api', () => {
  test('returns array of appointments', async ({ request }) => {
    const res  = await request.get(`${BASE}/api/appointments`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('each appointment has required fields', async ({ request }) => {
    const res  = await request.get(`${BASE}/api/appointments`);
    const appts = await res.json();
    for (const a of appts) {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('patientName');
      expect(a).toHaveProperty('doctorName');
      expect(a).toHaveProperty('date');
      expect(a).toHaveProperty('status');
    }
  });
});

test.describe('POST /api/appointments @api', () => {
  test('books appointment with valid data', async ({ request }) => {
    const res = await request.post(`${BASE}/api/appointments`, {
      data: { patientId: 1, doctorId: 1, date: '2026-07-01', time: '10:00', notes: 'Test' }
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.patientName).toBeTruthy();
    expect(body.doctorName).toBeTruthy();
    expect(body.status).toBe('Scheduled');
  });

  test('returns 400 when date is missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/appointments`, {
      data: { patientId: 1, doctorId: 1, time: '10:00' }
    });
    expect(res.status()).toBe(400);
  });

  test('returns 404 for unknown patient', async ({ request }) => {
    const res = await request.post(`${BASE}/api/appointments`, {
      data: { patientId: 9999, doctorId: 1, date: '2026-07-01', time: '10:00' }
    });
    expect(res.status()).toBe(404);
  });
});

test.describe('PATCH /api/appointments/:id @api', () => {
  test('updates appointment status to Completed', async ({ request }) => {
    const res = await request.patch(`${BASE}/api/appointments/1`, {
      data: { status: 'Completed' }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('Completed');
  });

  test('returns 400 for invalid status', async ({ request }) => {
    const res = await request.patch(`${BASE}/api/appointments/1`, {
      data: { status: 'InvalidStatus' }
    });
    expect(res.status()).toBe(400);
  });

  test('returns 404 for unknown appointment', async ({ request }) => {
    const res = await request.patch(`${BASE}/api/appointments/9999`, {
      data: { status: 'Cancelled' }
    });
    expect(res.status()).toBe(404);
  });
});

// =================== BILLS ===================

test.describe('GET /api/bills @api', () => {
  test('returns array of bills', async ({ request }) => {
    const res  = await request.get(`${BASE}/api/bills`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('each bill has id, patientName, amount, status', async ({ request }) => {
    const res   = await request.get(`${BASE}/api/bills`);
    const bills = await res.json();
    for (const b of bills) {
      expect(b).toHaveProperty('id');
      expect(b).toHaveProperty('patientName');
      expect(b).toHaveProperty('amount');
      expect(b).toHaveProperty('status');
    }
  });
});

test.describe('POST /api/bills @api', () => {
  test('creates bill with valid data', async ({ request }) => {
    const res = await request.post(`${BASE}/api/bills`, {
      data: { patientId: 2, amount: 350.00, description: 'Lab Tests' }
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.amount).toBe(350);
    expect(body.status).toBe('Pending');
    expect(body).toHaveProperty('id');
  });

  test('returns 400 when amount is missing', async ({ request }) => {
    const res = await request.post(`${BASE}/api/bills`, {
      data: { patientId: 1 }
    });
    expect(res.status()).toBe(400);
  });

  test('returns 404 for unknown patient', async ({ request }) => {
    const res = await request.post(`${BASE}/api/bills`, {
      data: { patientId: 9999, amount: 100 }
    });
    expect(res.status()).toBe(404);
  });
});

test.describe('PATCH /api/bills/:id/pay @api', () => {
  test('marks a pending bill as paid', async ({ request }) => {
    // Create a fresh bill to pay
    const createRes = await request.post(`${BASE}/api/bills`, {
      data: { patientId: 1, amount: 99, description: 'Pay test' }
    });
    const newBill = await createRes.json();

    const payRes = await request.patch(`${BASE}/api/bills/${newBill.id}/pay`);
    expect(payRes.status()).toBe(200);
    const body = await payRes.json();
    expect(body.status).toBe('Paid');
  });

  test('returns 409 when bill is already paid', async ({ request }) => {
    // Bill #1 is already Paid in seed data
    const res = await request.patch(`${BASE}/api/bills/1/pay`);
    expect(res.status()).toBe(409);
  });

  test('returns 404 for unknown bill', async ({ request }) => {
    const res = await request.patch(`${BASE}/api/bills/9999/pay`);
    expect(res.status()).toBe(404);
  });
});
