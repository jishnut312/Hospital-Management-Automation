# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.js >> POST /api/bills @api >> creates bill with valid data
- Location: tests\api.spec.js:304:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 404
```

# Test source

```ts
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
> 308 |     expect(res.status()).toBe(201);
      |                          ^ Error: expect(received).toBe(expected) // Object.is equality
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
  334 |       data: { patientId: 1, amount: 99, description: 'Pay test' }
  335 |     });
  336 |     const newBill = await createRes.json();
  337 | 
  338 |     const payRes = await request.patch(`${BASE}/api/bills/${newBill.id}/pay`);
  339 |     expect(payRes.status()).toBe(200);
  340 |     const body = await payRes.json();
  341 |     expect(body.status).toBe('Paid');
  342 |   });
  343 | 
  344 |   test('returns 409 when bill is already paid', async ({ request }) => {
  345 |     // Bill #1 is already Paid in seed data
  346 |     const res = await request.patch(`${BASE}/api/bills/1/pay`);
  347 |     expect(res.status()).toBe(409);
  348 |   });
  349 | 
  350 |   test('returns 404 for unknown bill', async ({ request }) => {
  351 |     const res = await request.patch(`${BASE}/api/bills/9999/pay`);
  352 |     expect(res.status()).toBe(404);
  353 |   });
  354 | });
  355 | 
```