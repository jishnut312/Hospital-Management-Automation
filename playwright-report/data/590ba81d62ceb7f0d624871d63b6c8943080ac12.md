# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> POST /api/appointments @api >> books appointment with valid data
- Location: tests\api.spec.js:229:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 404
```

# Test source

```ts
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
  157 |     expect(res.status()).toBe(400);
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
> 233 |     expect(res.status()).toBe(201);
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
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
  258 |       data: { status: 'Completed' }
  259 |     });
  260 |     expect(res.status()).toBe(200);
  261 |     const body = await res.json();
  262 |     expect(body.status).toBe('Completed');
  263 |   });
  264 | 
  265 |   test('returns 400 for invalid status', async ({ request }) => {
  266 |     const res = await request.patch(`${BASE}/api/appointments/1`, {
  267 |       data: { status: 'InvalidStatus' }
  268 |     });
  269 |     expect(res.status()).toBe(400);
  270 |   });
  271 | 
  272 |   test('returns 404 for unknown appointment', async ({ request }) => {
  273 |     const res = await request.patch(`${BASE}/api/appointments/9999`, {
  274 |       data: { status: 'Cancelled' }
  275 |     });
  276 |     expect(res.status()).toBe(404);
  277 |   });
  278 | });
  279 | 
  280 | // =================== BILLS ===================
  281 | 
  282 | test.describe('GET /api/bills @api', () => {
  283 |   test('returns array of bills', async ({ request }) => {
  284 |     const res  = await request.get(`${BASE}/api/bills`);
  285 |     expect(res.status()).toBe(200);
  286 |     const body = await res.json();
  287 |     expect(Array.isArray(body)).toBeTruthy();
  288 |     expect(body.length).toBeGreaterThan(0);
  289 |   });
  290 | 
  291 |   test('each bill has id, patientName, amount, status', async ({ request }) => {
  292 |     const res   = await request.get(`${BASE}/api/bills`);
  293 |     const bills = await res.json();
  294 |     for (const b of bills) {
  295 |       expect(b).toHaveProperty('id');
  296 |       expect(b).toHaveProperty('patientName');
  297 |       expect(b).toHaveProperty('amount');
  298 |       expect(b).toHaveProperty('status');
  299 |     }
  300 |   });
  301 | });
  302 | 
  303 | test.describe('POST /api/bills @api', () => {
  304 |   test('creates bill with valid data', async ({ request }) => {
  305 |     const res = await request.post(`${BASE}/api/bills`, {
  306 |       data: { patientId: 2, amount: 350.00, description: 'Lab Tests' }
  307 |     });
  308 |     expect(res.status()).toBe(201);
  309 |     const body = await res.json();
  310 |     expect(body.amount).toBe(350);
  311 |     expect(body.status).toBe('Pending');
  312 |     expect(body).toHaveProperty('id');
  313 |   });
  314 | 
  315 |   test('returns 400 when amount is missing', async ({ request }) => {
  316 |     const res = await request.post(`${BASE}/api/bills`, {
  317 |       data: { patientId: 1 }
  318 |     });
  319 |     expect(res.status()).toBe(400);
  320 |   });
  321 | 
  322 |   test('returns 404 for unknown patient', async ({ request }) => {
  323 |     const res = await request.post(`${BASE}/api/bills`, {
  324 |       data: { patientId: 9999, amount: 100 }
  325 |     });
  326 |     expect(res.status()).toBe(404);
  327 |   });
  328 | });
  329 | 
  330 | test.describe('PATCH /api/bills/:id/pay @api', () => {
  331 |   test('marks a pending bill as paid', async ({ request }) => {
  332 |     // Create a fresh bill to pay
  333 |     const createRes = await request.post(`${BASE}/api/bills`, {
```