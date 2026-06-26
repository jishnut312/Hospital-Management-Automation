# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui.spec.js >> Login page @ui >> has correct page title
- Location: tests\ui.spec.js:25:3

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Hospital Management/
Received string:  "E-Hospitality |"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    13 × unexpected value "E-Hospitality |"

```

```yaml
- banner:
  - navigation:
    - link " E-Hospitality":
      - /url: /
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem:
        - link "About":
          - /url: /accounts/about/
      - listitem:
        - link "Departments":
          - /url: /accounts/departments/
      - listitem:
        - link "Contact":
          - /url: /accounts/contact/
    - list:
      - listitem:
        - link " Login":
          - /url: /accounts/login/
      - listitem:
        - link " Register":
          - /url: /accounts/register/
- main:
  - heading "Welcome to E-Hospitality" [level=1]
  - paragraph: Your comprehensive healthcare management solution.
  - link " Login":
    - /url: /accounts/login/
  - link " Register":
    - /url: /accounts/register/
  - separator
  - text: 
  - heading "About Us" [level=2]
  - paragraph: E-Hospitality provides seamless healthcare management for patients, doctors, and administrators, enhancing care and streamlining operations.
  - link "Learn More":
    - /url: /accounts/about/
  - text: 
  - heading "Departments" [level=2]
  - paragraph: Access our wide range of medical departments with highly skilled professionals for all your healthcare needs.
  - link "View Departments":
    - /url: /accounts/departments/
  - text: 
  - heading "Contact Us" [level=2]
  - paragraph: Our support team is ready to assist you with any questions or inquiries about our services.
  - link "Get in Touch":
    - /url: /accounts/contact/
- contentinfo:
  - heading "E-Hospitality" [level=5]
  - paragraph: A complete healthcare management solution for patients and providers.
  - heading "Quick Links" [level=5]
  - list:
    - listitem:
      - link "Home":
        - /url: /
    - listitem:
      - link "Login":
        - /url: /accounts/login/
    - listitem:
      - link "Register":
        - /url: /accounts/register/
  - heading "Contact" [level=5]
  - paragraph: 123 Medical Drive Hospital City, HC 12345
  - paragraph: "Email: info@ehospitality.com"
  - paragraph: "Phone: (123) 456-7890"
  - separator
  - paragraph: © 2026 E-Hospitality. All rights reserved.
```

# Test source

```ts
  1   | // @ts-check
  2   | const { test, expect } = require('@playwright/test');
  3   | 
  4   | /**
  5   |  * E2E UI Tests (@ui)
  6   |  * Tests the full Hospital Management UI in the browser.
  7   |  */
  8   | 
  9   | // Helper: login and store session in localStorage before navigating to dashboard
  10  | async function loginAndGoToDashboard(page) {
  11  |   await page.goto('/');
  12  |   await page.fill('#username', 'admin');
  13  |   await page.fill('#password', 'password123');
  14  |   await page.click('#login-btn');
  15  |   await page.waitForURL('**/dashboard.html', { timeout: 8000 });
  16  | }
  17  | 
  18  | // =================== LOGIN PAGE ===================
  19  | 
  20  | test.describe('Login page @ui', () => {
  21  |   test.beforeEach(async ({ page }) => {
  22  |     await page.goto('/');
  23  |   });
  24  | 
  25  |   test('has correct page title', async ({ page }) => {
> 26  |     await expect(page).toHaveTitle(/Hospital Management/);
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
  27  |   });
  28  | 
  29  |   test('shows logo and branding', async ({ page }) => {
  30  |     await expect(page.locator('.login-logo')).toBeVisible();
  31  |     await expect(page.locator('.login-logo-text')).toContainText('MediCore HMS');
  32  |   });
  33  | 
  34  |   test('shows demo credentials hint', async ({ page }) => {
  35  |     await expect(page.locator('.login-hint')).toBeVisible();
  36  |     await expect(page.locator('.login-hint')).toContainText('admin');
  37  |   });
  38  | 
  39  |   test('username and password fields are present', async ({ page }) => {
  40  |     await expect(page.locator('#username')).toBeVisible();
  41  |     await expect(page.locator('#password')).toBeVisible();
  42  |     await expect(page.locator('#login-btn')).toBeVisible();
  43  |   });
  44  | 
  45  |   test('shows error on wrong credentials', async ({ page }) => {
  46  |     await page.fill('#username', 'admin');
  47  |     await page.fill('#password', 'wrongpassword');
  48  |     await page.click('#login-btn');
  49  |     const alert = page.locator('#login-alert');
  50  |     await expect(alert).toBeVisible({ timeout: 5000 });
  51  |     await expect(alert).toContainText(/Invalid|credentials/i);
  52  |   });
  53  | 
  54  |   test('redirects to dashboard on valid login', async ({ page }) => {
  55  |     await page.fill('#username', 'admin');
  56  |     await page.fill('#password', 'password123');
  57  |     await page.click('#login-btn');
  58  |     await page.waitForURL('**/dashboard.html', { timeout: 8000 });
  59  |     expect(page.url()).toContain('dashboard.html');
  60  |   });
  61  | 
  62  |   test('login button is disabled during submission', async ({ page }) => {
  63  |     await page.fill('#username', 'admin');
  64  |     await page.fill('#password', 'password123');
  65  |     // Click and immediately check (may be fast but tests disabled state)
  66  |     await page.click('#login-btn');
  67  |     await page.waitForURL('**/dashboard.html', { timeout: 8000 });
  68  |   });
  69  | });
  70  | 
  71  | // =================== DASHBOARD ===================
  72  | 
  73  | test.describe('Dashboard @ui', () => {
  74  |   test.beforeEach(async ({ page }) => {
  75  |     await loginAndGoToDashboard(page);
  76  |   });
  77  | 
  78  |   test('has correct dashboard title', async ({ page }) => {
  79  |     await expect(page).toHaveTitle(/Dashboard|MediCore/);
  80  |   });
  81  | 
  82  |   test('sidebar is visible with logo', async ({ page }) => {
  83  |     await expect(page.locator('.sidebar')).toBeVisible();
  84  |     await expect(page.locator('.sidebar-logo-text')).toContainText('MediCore HMS');
  85  |   });
  86  | 
  87  |   test('shows all 4 stat cards', async ({ page }) => {
  88  |     const cards = page.locator('.stat-card');
  89  |     await expect(cards).toHaveCount(4);
  90  |   });
  91  | 
  92  |   test('stat cards show numeric values', async ({ page }) => {
  93  |     await expect(page.locator('#stat-patients')).not.toContainText('—', { timeout: 5000 });
  94  |     await expect(page.locator('#stat-doctors')).not.toContainText('—');
  95  |     await expect(page.locator('#stat-bills')).not.toContainText('—');
  96  |   });
  97  | 
  98  |   test('activity feed is visible', async ({ page }) => {
  99  |     await expect(page.locator('.activity-list')).toBeVisible();
  100 |     const items = page.locator('.activity-item');
  101 |     await expect(items).toHaveCount(5);
  102 |   });
  103 | 
  104 |   test('topbar shows Dashboard title', async ({ page }) => {
  105 |     await expect(page.locator('#topbar-title')).toContainText('Dashboard');
  106 |   });
  107 | 
  108 |   test('user info shown in sidebar footer', async ({ page }) => {
  109 |     await expect(page.locator('#user-name')).not.toBeEmpty();
  110 |     await expect(page.locator('#user-role')).not.toBeEmpty();
  111 |   });
  112 | });
  113 | 
  114 | // =================== NAVIGATION ===================
  115 | 
  116 | test.describe('Sidebar navigation @ui', () => {
  117 |   test.beforeEach(async ({ page }) => {
  118 |     await loginAndGoToDashboard(page);
  119 |   });
  120 | 
  121 |   test('all nav items are visible', async ({ page }) => {
  122 |     await expect(page.locator('#nav-dashboard')).toBeVisible();
  123 |     await expect(page.locator('#nav-patients')).toBeVisible();
  124 |     await expect(page.locator('#nav-appointments')).toBeVisible();
  125 |     await expect(page.locator('#nav-doctors')).toBeVisible();
  126 |     await expect(page.locator('#nav-billing')).toBeVisible();
```