# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> POST /api/login @api >> nurse credentials also work
- Location: tests\api.spec.js:47:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
  1   | // @ts-check
  2   | const { test, expect } = require('@playwright/test');
  3   | 
  4   | /**
  5   |  * API Tests (@api)
  6   |  * Uses Playwright's request context — no browser needed.
  7   |  */
  8   | 
  9   | const BASE = process.env.API_BASE_URL || 'https://jishnut77.pythonanywhere.com';
  10  | 
  11  | // =================== AUTH ===================
  12  | 
  13  | test.describe('POST /api/login @api', () => {
  14  |   test('returns token on valid credentials', async ({ request }) => {
  15  |     const res = await request.post(`${BASE}/api/login`, {
  16  |       data: { username: 'admin', password: 'password123' }
  17  |     });
  18  |     expect(res.status()).toBe(200);
  19  |     const body = await res.json();
  20  |     expect(body).toHaveProperty('token');
  21  |     expect(body).toHaveProperty('role');
  22  |     expect(body).toHaveProperty('name');
  23  |     expect(body.token).toContain('admin');
  24  |   });
  25  | 
  26  |   test('returns 401 for wrong password', async ({ request }) => {
  27  |     const res = await request.post(`${BASE}/api/login`, {
  28  |       data: { username: 'admin', password: 'wrongpass' }
  29  |     });
  30  |     expect(res.status()).toBe(401);
  31  |     const body = await res.json();
  32  |     expect(body).toHaveProperty('error');
  33  |   });
  34  | 
  35  |   test('returns 401 for unknown user', async ({ request }) => {
  36  |     const res = await request.post(`${BASE}/api/login`, {
  37  |       data: { username: 'ghost', password: 'anything' }
  38  |     });
  39  |     expect(res.status()).toBe(401);
  40  |   });
  41  | 
  42  |   test('returns 400 when fields are missing', async ({ request }) => {
  43  |     const res = await request.post(`${BASE}/api/login`, { data: {} });
  44  |     expect(res.status()).toBe(400);
  45  |   });
  46  | 
  47  |   test('nurse credentials also work', async ({ request }) => {
  48  |     const res = await request.post(`${BASE}/api/login`, {
  49  |       data: { username: 'nurse', password: 'nurse123' }
  50  |     });
> 51  |     expect(res.status()).toBe(200);
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  52  |     const body = await res.json();
  53  |     expect(body.role).toBe('Nurse');
  54  |   });
  55  | });
  56  | 
  57  | // =================== DASHBOARD ===================
  58  | 
  59  | test.describe('GET /api/dashboard @api', () => {
  60  |   test('returns 200 with stats object', async ({ request }) => {
  61  |     const res = await request.get(`${BASE}/api/dashboard`);
  62  |     expect(res.status()).toBe(200);
  63  |     const body = await res.json();
  64  |     expect(body).toHaveProperty('totalPatients');
  65  |     expect(body).toHaveProperty('appointmentsToday');
  66  |     expect(body).toHaveProperty('doctorsOnDuty');
  67  |     expect(body).toHaveProperty('pendingBills');
  68  |     expect(body).toHaveProperty('pendingBillsAmount');
  69  |   });
  70  | 
  71  |   test('totalPatients is a positive number', async ({ request }) => {
  72  |     const res  = await request.get(`${BASE}/api/dashboard`);
  73  |     const body = await res.json();
  74  |     expect(typeof body.totalPatients).toBe('number');
  75  |     expect(body.totalPatients).toBeGreaterThan(0);
  76  |   });
  77  | 
  78  |   test('doctorsOnDuty is a non-negative number', async ({ request }) => {
  79  |     const res  = await request.get(`${BASE}/api/dashboard`);
  80  |     const body = await res.json();
  81  |     expect(body.doctorsOnDuty).toBeGreaterThanOrEqual(0);
  82  |   });
  83  | });
  84  | 
  85  | // =================== PATIENTS ===================
  86  | 
  87  | test.describe('GET /api/patients @api', () => {
  88  |   test('returns 200 with array', async ({ request }) => {
  89  |     const res = await request.get(`${BASE}/api/patients`);
  90  |     expect(res.status()).toBe(200);
  91  |     const body = await res.json();
  92  |     expect(Array.isArray(body)).toBeTruthy();
  93  |     expect(body.length).toBeGreaterThan(0);
  94  |   });
  95  | 
  96  |   test('each patient has required fields', async ({ request }) => {
  97  |     const res      = await request.get(`${BASE}/api/patients`);
  98  |     const patients = await res.json();
  99  |     for (const p of patients) {
  100 |       expect(p).toHaveProperty('id');
  101 |       expect(p).toHaveProperty('name');
  102 |       expect(p).toHaveProperty('age');
  103 |       expect(p).toHaveProperty('gender');
  104 |       expect(p).toHaveProperty('status');
  105 |     }
  106 |   });
  107 | 
  108 |   test('returns JSON content-type', async ({ request }) => {
  109 |     const res = await request.get(`${BASE}/api/patients`);
  110 |     expect(res.headers()['content-type']).toContain('application/json');
  111 |   });
  112 | });
  113 | 
  114 | test.describe('GET /api/patients/:id @api', () => {
  115 |   test('returns patient by valid id', async ({ request }) => {
  116 |     const res = await request.get(`${BASE}/api/patients/1`);
  117 |     expect(res.status()).toBe(200);
  118 |     const body = await res.json();
  119 |     expect(body.id).toBe(1);
  120 |     expect(body.name).toBeTruthy();
  121 |   });
  122 | 
  123 |   test('returns 404 for unknown id', async ({ request }) => {
  124 |     const res = await request.get(`${BASE}/api/patients/9999`);
  125 |     expect(res.status()).toBe(404);
  126 |     const body = await res.json();
  127 |     expect(body).toHaveProperty('error');
  128 |   });
  129 | });
  130 | 
  131 | test.describe('POST /api/patients @api', () => {
  132 |   test('creates patient with valid data', async ({ request }) => {
  133 |     const res = await request.post(`${BASE}/api/patients`, {
  134 |       data: { name: 'Test Patient', age: 30, gender: 'Female', blood: 'B+', condition: 'Flu' }
  135 |     });
  136 |     expect(res.status()).toBe(201);
  137 |     const body = await res.json();
  138 |     expect(body.name).toBe('Test Patient');
  139 |     expect(body.gender).toBe('Female');
  140 |     expect(body.status).toBe('Active');
  141 |     expect(body).toHaveProperty('id');
  142 |   });
  143 | 
  144 |   test('returns 400 when name is missing', async ({ request }) => {
  145 |     const res = await request.post(`${BASE}/api/patients`, {
  146 |       data: { age: 25, gender: 'Male' }
  147 |     });
  148 |     expect(res.status()).toBe(400);
  149 |     const body = await res.json();
  150 |     expect(body).toHaveProperty('error');
  151 |   });
```