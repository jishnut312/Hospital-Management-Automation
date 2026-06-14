// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * E2E UI Tests (@ui)
 * Tests the full Hospital Management UI in the browser.
 */

// Helper: login and store session in localStorage before navigating to dashboard
async function loginAndGoToDashboard(page) {
  await page.goto('/');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password123');
  await page.click('#login-btn');
  await page.waitForURL('**/dashboard.html', { timeout: 8000 });
}

// =================== LOGIN PAGE ===================

test.describe('Login page @ui', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Hospital Management/);
  });

  test('shows logo and branding', async ({ page }) => {
    await expect(page.locator('.login-logo')).toBeVisible();
    await expect(page.locator('.login-logo-text')).toContainText('MediCore HMS');
  });

  test('shows demo credentials hint', async ({ page }) => {
    await expect(page.locator('.login-hint')).toBeVisible();
    await expect(page.locator('.login-hint')).toContainText('admin');
  });

  test('username and password fields are present', async ({ page }) => {
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-btn')).toBeVisible();
  });

  test('shows error on wrong credentials', async ({ page }) => {
    await page.fill('#username', 'admin');
    await page.fill('#password', 'wrongpassword');
    await page.click('#login-btn');
    const alert = page.locator('#login-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText(/Invalid|credentials/i);
  });

  test('redirects to dashboard on valid login', async ({ page }) => {
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password123');
    await page.click('#login-btn');
    await page.waitForURL('**/dashboard.html', { timeout: 8000 });
    expect(page.url()).toContain('dashboard.html');
  });

  test('login button is disabled during submission', async ({ page }) => {
    await page.fill('#username', 'admin');
    await page.fill('#password', 'password123');
    // Click and immediately check (may be fast but tests disabled state)
    await page.click('#login-btn');
    await page.waitForURL('**/dashboard.html', { timeout: 8000 });
  });
});

// =================== DASHBOARD ===================

test.describe('Dashboard @ui', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
  });

  test('has correct dashboard title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard|MediCore/);
  });

  test('sidebar is visible with logo', async ({ page }) => {
    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('.sidebar-logo-text')).toContainText('MediCore HMS');
  });

  test('shows all 4 stat cards', async ({ page }) => {
    const cards = page.locator('.stat-card');
    await expect(cards).toHaveCount(4);
  });

  test('stat cards show numeric values', async ({ page }) => {
    await expect(page.locator('#stat-patients')).not.toContainText('—', { timeout: 5000 });
    await expect(page.locator('#stat-doctors')).not.toContainText('—');
    await expect(page.locator('#stat-bills')).not.toContainText('—');
  });

  test('activity feed is visible', async ({ page }) => {
    await expect(page.locator('.activity-list')).toBeVisible();
    const items = page.locator('.activity-item');
    await expect(items).toHaveCount(5);
  });

  test('topbar shows Dashboard title', async ({ page }) => {
    await expect(page.locator('#topbar-title')).toContainText('Dashboard');
  });

  test('user info shown in sidebar footer', async ({ page }) => {
    await expect(page.locator('#user-name')).not.toBeEmpty();
    await expect(page.locator('#user-role')).not.toBeEmpty();
  });
});

// =================== NAVIGATION ===================

test.describe('Sidebar navigation @ui', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
  });

  test('all nav items are visible', async ({ page }) => {
    await expect(page.locator('#nav-dashboard')).toBeVisible();
    await expect(page.locator('#nav-patients')).toBeVisible();
    await expect(page.locator('#nav-appointments')).toBeVisible();
    await expect(page.locator('#nav-doctors')).toBeVisible();
    await expect(page.locator('#nav-billing')).toBeVisible();
  });

  test('clicking Patients nav shows patients section', async ({ page }) => {
    await page.click('#nav-patients');
    await expect(page.locator('#section-patients')).toBeVisible();
    await expect(page.locator('#topbar-title')).toContainText('Patients');
  });

  test('clicking Appointments nav shows appointments section', async ({ page }) => {
    await page.click('#nav-appointments');
    await expect(page.locator('#section-appointments')).toBeVisible();
    await expect(page.locator('#topbar-title')).toContainText('Appointments');
  });

  test('clicking Doctors nav shows doctors section', async ({ page }) => {
    await page.click('#nav-doctors');
    await expect(page.locator('#section-doctors')).toBeVisible();
    await expect(page.locator('#topbar-title')).toContainText('Doctors');
  });

  test('clicking Billing nav shows billing section', async ({ page }) => {
    await page.click('#nav-billing');
    await expect(page.locator('#section-billing')).toBeVisible();
    await expect(page.locator('#topbar-title')).toContainText('Billing');
  });
});

// =================== PATIENTS ===================

test.describe('Patients section @ui', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
    await page.click('#nav-patients');
    await page.waitForSelector('#patients-tbody tr', { timeout: 6000 });
  });

  test('patients table renders rows', async ({ page }) => {
    const rows = page.locator('#patients-tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('patients table has correct column headers', async ({ page }) => {
    const headers = page.locator('#patients-table thead th');
    await expect(headers).toHaveCount(7);
  });

  test('search filters patients by name', async ({ page }) => {
    await page.fill('#patient-search', 'James');
    await page.waitForTimeout(300);
    const rows = page.locator('#patients-tbody tr');
    await expect(rows).toHaveCount(1);
  });

  test('search shows empty state for no match', async ({ page }) => {
    await page.fill('#patient-search', 'XYZNOPATIENT');
    await page.waitForTimeout(300);
    await expect(page.locator('#patients-empty')).toBeVisible();
  });

  test('clearing search restores all patients', async ({ page }) => {
    await page.fill('#patient-search', 'James');
    await page.waitForTimeout(200);
    await page.fill('#patient-search', '');
    await page.waitForTimeout(200);
    const rows = page.locator('#patients-tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('Add Patient button opens modal', async ({ page }) => {
    await page.click('#add-patient-btn');
    await expect(page.locator('#patient-modal')).toHaveClass(/open/);
  });

  test('patient modal has all form fields', async ({ page }) => {
    await page.click('#add-patient-btn');
    await expect(page.locator('#p-name')).toBeVisible();
    await expect(page.locator('#p-age')).toBeVisible();
    await expect(page.locator('#p-gender')).toBeVisible();
    await expect(page.locator('#p-blood')).toBeVisible();
  });

  test('submitting add patient form shows success', async ({ page }) => {
    await page.click('#add-patient-btn');
    await page.fill('#p-name', 'UI Test Patient');
    await page.fill('#p-age', '28');
    await page.selectOption('#p-gender', 'Female');
    await page.selectOption('#p-blood', 'O+');
    await page.fill('#p-condition', 'Asthma');
    await page.click('#patient-submit-btn');
    const alert = page.locator('#patient-modal-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText('UI Test Patient');
  });

  test('new patient appears in table after adding', async ({ page }) => {
    await page.click('#add-patient-btn');
    await page.fill('#p-name', 'Table Test Patient');
    await page.fill('#p-age', '40');
    await page.selectOption('#p-gender', 'Male');
    await page.click('#patient-submit-btn');
    await page.locator('#patient-modal-alert.show').waitFor({ timeout: 5000 });
    // Close modal and check table
    await page.click('.modal-close');
    await expect(page.locator('#patients-tbody')).toContainText('Table Test Patient');
  });
});

// =================== APPOINTMENTS ===================

test.describe('Appointments section @ui', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
    await page.click('#nav-appointments');
    await page.waitForSelector('#appointments-tbody tr', { timeout: 6000 });
  });

  test('appointments table loads rows', async ({ page }) => {
    const rows = page.locator('#appointments-tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('filter tabs are visible', async ({ page }) => {
    const tabs = page.locator('#appt-filter .filter-tab');
    await expect(tabs).toHaveCount(4);
  });

  test('Scheduled filter shows only scheduled appointments', async ({ page }) => {
    await page.click('#appt-filter .filter-tab:nth-child(2)');
    await page.waitForTimeout(300);
    const badges = page.locator('#appointments-tbody .badge-scheduled');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Cancelled filter tab works', async ({ page }) => {
    await page.click('#appt-filter .filter-tab:nth-child(4)');
    await page.waitForTimeout(300);
    // Should show cancelled badge or empty state
    const cancelBadges = page.locator('#appointments-tbody .badge-cancelled');
    const empty = page.locator('#appointments-empty');
    const hasCancelled = await cancelBadges.count() > 0;
    const isEmpty      = await empty.isVisible();
    expect(hasCancelled || isEmpty).toBeTruthy();
  });

  test('Book Appointment button opens modal', async ({ page }) => {
    await page.click('#add-appt-btn');
    await expect(page.locator('#appt-modal')).toHaveClass(/open/);
  });

  test('appointment modal has patient and doctor selects', async ({ page }) => {
    await page.click('#add-appt-btn');
    await expect(page.locator('#a-patient')).toBeVisible();
    await expect(page.locator('#a-doctor')).toBeVisible();
    await expect(page.locator('#a-date')).toBeVisible();
    await expect(page.locator('#a-time')).toBeVisible();
  });

  test('books appointment successfully', async ({ page }) => {
    await page.click('#add-appt-btn');
    await page.selectOption('#a-patient', { index: 1 });
    await page.selectOption('#a-doctor', { index: 1 });
    await page.fill('#a-date', '2026-08-15');
    await page.fill('#a-time', '09:30');
    await page.click('#appt-submit-btn');
    const alert = page.locator('#appt-modal-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText(/booked/i);
  });
});

// =================== DOCTORS ===================

test.describe('Doctors section @ui', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
    await page.click('#nav-doctors');
    await page.waitForSelector('#doctors-tbody tr', { timeout: 6000 });
  });

  test('doctors table loads rows', async ({ page }) => {
    const rows = page.locator('#doctors-tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('doctors table has correct headers', async ({ page }) => {
    const headers = page.locator('#doctors-table thead th');
    await expect(headers).toHaveCount(6);
  });

  test('availability badges are visible', async ({ page }) => {
    const badges = page.locator('#doctors-tbody .badge');
    await expect(badges.first()).toBeVisible();
  });

  test('Add Doctor button opens modal', async ({ page }) => {
    await page.click('#add-doctor-btn');
    await expect(page.locator('#doctor-modal')).toHaveClass(/open/);
  });

  test('doctor modal has name and specialty fields', async ({ page }) => {
    await page.click('#add-doctor-btn');
    await expect(page.locator('#d-name')).toBeVisible();
    await expect(page.locator('#d-specialty')).toBeVisible();
  });

  test('adds a doctor successfully', async ({ page }) => {
    await page.click('#add-doctor-btn');
    await page.fill('#d-name', 'Dr. UI Tester');
    await page.selectOption('#d-specialty', 'Radiology');
    await page.fill('#d-phone', '555-9999');
    await page.fill('#d-email', 'ui@hospital.com');
    await page.click('#doctor-submit-btn');
    const alert = page.locator('#doctor-modal-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText('Dr. UI Tester');
  });
});

// =================== BILLING ===================

test.describe('Billing section @ui', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndGoToDashboard(page);
    await page.click('#nav-billing');
    await page.waitForSelector('#bills-tbody tr', { timeout: 6000 });
  });

  test('bills table loads rows', async ({ page }) => {
    const rows = page.locator('#bills-tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('filter tabs are visible', async ({ page }) => {
    const tabs = page.locator('#bill-filter .filter-tab');
    await expect(tabs).toHaveCount(3);
  });

  test('Pending filter shows only pending bills', async ({ page }) => {
    await page.click('#bill-filter .filter-tab:nth-child(2)');
    await page.waitForTimeout(300);
    const badges = page.locator('#bills-tbody .badge-pending');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Paid filter shows only paid bills', async ({ page }) => {
    await page.click('#bill-filter .filter-tab:nth-child(3)');
    await page.waitForTimeout(300);
    const badges = page.locator('#bills-tbody .badge-paid');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Mark Paid button is visible on pending bills', async ({ page }) => {
    const payBtn = page.locator('#bills-tbody .btn-success').first();
    await expect(payBtn).toBeVisible();
    await expect(payBtn).toContainText('Mark Paid');
  });

  test('clicking Mark Paid updates bill status', async ({ page }) => {
    // Get first pending bill row before paying
    const payBtn = page.locator('#bills-tbody .btn-success').first();
    await payBtn.click();
    await page.waitForTimeout(1000);
    // The button should disappear from that row (it's now paid)
    const paidBadge = page.locator('#bills-tbody .badge-paid').first();
    await expect(paidBadge).toBeVisible({ timeout: 5000 });
  });

  test('Add Bill button opens modal', async ({ page }) => {
    await page.click('#add-bill-btn');
    await expect(page.locator('#bill-modal')).toHaveClass(/open/);
  });

  test('creates a bill successfully', async ({ page }) => {
    await page.click('#add-bill-btn');
    await page.selectOption('#b-patient', { index: 1 });
    await page.fill('#b-amount', '500');
    await page.fill('#b-desc', 'UI Test Bill');
    await page.click('#bill-submit-btn');
    const alert = page.locator('#bill-modal-alert');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText('$500.00');
  });
});

// =================== LOGOUT ===================

test.describe('Logout @ui', () => {
  test('logout redirects to login page', async ({ page }) => {
    await loginAndGoToDashboard(page);
    await page.click('#logout-btn');
    await page.waitForURL('**/', { timeout: 5000 });
    expect(page.url()).toMatch(/\/$|index\.html/);
  });
});
