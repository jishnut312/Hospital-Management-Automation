# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> POST /api/patients @api >> returns 400 when gender is missing
- Location: tests\api.spec.js:153:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 404
```

# Test source

```ts
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
  152 | 
  153 |   test('returns 400 when gender is missing', async ({ request }) => {
  154 |     const res = await request.post(`${BASE}/api/patients`, {
  155 |       data: { name: 'No Gender', age: 25 }
  156 |     });
> 157 |     expect(res.status()).toBe(400);
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
  158 |   });
  159 | });
  160 | 
  161 | // =================== DOCTORS ===================
  162 | 
  163 | test.describe('GET /api/doctors @api', () => {
  164 |   test('returns array of doctors', async ({ request }) => {
  165 |     const res  = await request.get(`${BASE}/api/doctors`);
  166 |     expect(res.status()).toBe(200);
  167 |     const body = await res.json();
  168 |     expect(Array.isArray(body)).toBeTruthy();
  169 |     expect(body.length).toBeGreaterThan(0);
  170 |   });
  171 | 
  172 |   test('each doctor has id, name, specialty, available', async ({ request }) => {
  173 |     const res     = await request.get(`${BASE}/api/doctors`);
  174 |     const doctors = await res.json();
  175 |     for (const d of doctors) {
  176 |       expect(d).toHaveProperty('id');
  177 |       expect(d).toHaveProperty('name');
  178 |       expect(d).toHaveProperty('specialty');
  179 |       expect(d).toHaveProperty('available');
  180 |     }
  181 |   });
  182 | });
  183 | 
  184 | test.describe('POST /api/doctors @api', () => {
  185 |   test('creates doctor with valid data', async ({ request }) => {
  186 |     const res = await request.post(`${BASE}/api/doctors`, {
  187 |       data: { name: 'Dr. New Doc', specialty: 'Surgery', email: 'new@hospital.com' }
  188 |     });
  189 |     expect(res.status()).toBe(201);
  190 |     const body = await res.json();
  191 |     expect(body.name).toBe('Dr. New Doc');
  192 |     expect(body.specialty).toBe('Surgery');
  193 |     expect(body.available).toBe(true);
  194 |   });
  195 | 
  196 |   test('returns 400 when specialty is missing', async ({ request }) => {
  197 |     const res = await request.post(`${BASE}/api/doctors`, {
  198 |       data: { name: 'Dr. Incomplete' }
  199 |     });
  200 |     expect(res.status()).toBe(400);
  201 |   });
  202 | });
  203 | 
  204 | // =================== APPOINTMENTS ===================
  205 | 
  206 | test.describe('GET /api/appointments @api', () => {
  207 |   test('returns array of appointments', async ({ request }) => {
  208 |     const res  = await request.get(`${BASE}/api/appointments`);
  209 |     expect(res.status()).toBe(200);
  210 |     const body = await res.json();
  211 |     expect(Array.isArray(body)).toBeTruthy();
  212 |     expect(body.length).toBeGreaterThan(0);
  213 |   });
  214 | 
  215 |   test('each appointment has required fields', async ({ request }) => {
  216 |     const res  = await request.get(`${BASE}/api/appointments`);
  217 |     const appts = await res.json();
  218 |     for (const a of appts) {
  219 |       expect(a).toHaveProperty('id');
  220 |       expect(a).toHaveProperty('patientName');
  221 |       expect(a).toHaveProperty('doctorName');
  222 |       expect(a).toHaveProperty('date');
  223 |       expect(a).toHaveProperty('status');
  224 |     }
  225 |   });
  226 | });
  227 | 
  228 | test.describe('POST /api/appointments @api', () => {
  229 |   test('books appointment with valid data', async ({ request }) => {
  230 |     const res = await request.post(`${BASE}/api/appointments`, {
  231 |       data: { patientId: 1, doctorId: 1, date: '2026-07-01', time: '10:00', notes: 'Test' }
  232 |     });
  233 |     expect(res.status()).toBe(201);
  234 |     const body = await res.json();
  235 |     expect(body.patientName).toBeTruthy();
  236 |     expect(body.doctorName).toBeTruthy();
  237 |     expect(body.status).toBe('Scheduled');
  238 |   });
  239 | 
  240 |   test('returns 400 when date is missing', async ({ request }) => {
  241 |     const res = await request.post(`${BASE}/api/appointments`, {
  242 |       data: { patientId: 1, doctorId: 1, time: '10:00' }
  243 |     });
  244 |     expect(res.status()).toBe(400);
  245 |   });
  246 | 
  247 |   test('returns 404 for unknown patient', async ({ request }) => {
  248 |     const res = await request.post(`${BASE}/api/appointments`, {
  249 |       data: { patientId: 9999, doctorId: 1, date: '2026-07-01', time: '10:00' }
  250 |     });
  251 |     expect(res.status()).toBe(404);
  252 |   });
  253 | });
  254 | 
  255 | test.describe('PATCH /api/appointments/:id @api', () => {
  256 |   test('updates appointment status to Completed', async ({ request }) => {
  257 |     const res = await request.patch(`${BASE}/api/appointments/1`, {
```