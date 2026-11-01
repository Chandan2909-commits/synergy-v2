const http = require('http');

function post(path, body, token, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 4000,
        path: `/api/v1${path}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path, token, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 4000,
        path: `/api/v1${path}`,
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function put(path, body, token, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 4000,
        path: `/api/v1${path}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('======================================================================');
  console.log('SYNERGY PHASE 2: AUTHENTICATION & MULTI-TENANCY VERIFICATION SUITE');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Register Tenant A
  const emailA = (`foundera_${Date.now()}@aura.example`).toLowerCase();
  const regA = await post('/auth/register', {
    email: emailA,
    password: 'Password123!',
    fullName: 'Founder Alpha',
    organizationName: 'Alpha Retail Group',
    initialBusinessName: 'Aura Streetwear',
    industry: 'Fashion & Apparel',
  });

  assert(regA.status === 201 && regA.body.success, 'Tenant A successfully registers');
  const tokenA = regA.body.data.token;
  const userA = regA.body.data.user;
  const orgA = regA.body.data.organization;
  const bizA1 = regA.body.data.business;
  assert(tokenA && userA.id && orgA.id && bizA1.id, 'Tenant A receives token, Org ID, and initial Business ID');

  // 2. Login Tenant A
  const loginA = await post('/auth/login', {
    email: emailA,
    password: 'Password123!',
  });
  assert(loginA.status === 201 && loginA.body.data.token, 'Tenant A successfully logs in with password');

  // 3. Get User A profile (/auth/me)
  const meA = await get('/auth/me', tokenA);
  assert(meA.status === 200 && meA.body.data.email === emailA, 'Tenant A profile authenticated via JWT');
  assert(meA.body.data.memberships[0].organization.businesses.length >= 1, 'Profile returns organization and owned businesses');

  // 4. Create second business for Tenant A (Multi-business capability)
  const bizA2Res = await post('/businesses', {
    name: 'Novacode Software',
    description: 'B2B Developer Productivity Platform',
    industry: 'Enterprise Software',
    timezone: 'America/San_Francisco',
  }, tokenA, { 'x-organization-id': orgA.id });
  assert(bizA2Res.status === 201 && bizA2Res.body.data.name === 'Novacode Software', 'Tenant A creates second business workspace (Novacode Software)');
  const bizA2 = bizA2Res.body.data;

  // 5. List businesses for Tenant A
  const listBizA = await get('/businesses', tokenA, { 'x-organization-id': orgA.id });
  assert(listBizA.status === 200 && listBizA.body.data.length === 2, 'Tenant A can switch between multiple business workspaces (Aura & Novacode)');

  // 6. Get Brand Kit for Business A1
  const bkA1 = await get(`/businesses/${bizA1.id}/brand-kit`, tokenA, { 'x-business-id': bizA1.id });
  assert(bkA1.status === 200 && bkA1.body.data.brandName === 'Aura Streetwear', 'Brand Kit successfully initialized for Business A1');

  // 7. Update Brand Kit for Business A1
  const updateBk = await put(`/businesses/${bizA1.id}/brand-kit`, {
    brandName: 'Aura Streetwear Luxury',
    tagline: 'Elevated conscious fashion',
    primaryColor: '#000000',
    brandVoice: ['Minimalist', 'High-Contrast', 'Visionary'],
    targetAudience: 'Global urban tastemakers',
  }, tokenA, { 'x-business-id': bizA1.id });
  assert(updateBk.status === 200 && updateBk.body.data.brandName === 'Aura Streetwear Luxury', 'Brand Kit updated and persisted');

  // 8. Register Tenant B (Completely isolated tenant)
  const emailB = `founderB_${Date.now()}@bistro.example`;
  const regB = await post('/auth/register', {
    email: emailB,
    password: 'Password123!',
    fullName: 'Founder Bravo',
    organizationName: 'Bravo Hospitality',
    initialBusinessName: 'Artisan Bistro',
    industry: 'Dining & Hospitality',
  });
  assert(regB.status === 201, 'Tenant B successfully registers');
  const tokenB = regB.body.data.token;
  const bizB1 = regB.body.data.business;

  // 9. SECURITY & TENANT ISOLATION TESTS
  console.log('\n--- Running Automated Cross-Tenant Security Gates ---');

  // Cross-tenant attempt 1: Tenant B tries to read Business A1 Brand Kit
  const crossTest1 = await get(`/businesses/${bizA1.id}/brand-kit`, tokenB, { 'x-business-id': bizA1.id });
  assert(crossTest1.status === 403, `Tenant B blocked from reading Tenant A business (HTTP ${crossTest1.status} Forbidden)`);

  // Cross-tenant attempt 2: Tenant B tries to read Business A2 (Novacode)
  const crossTest2 = await get(`/businesses/${bizA2.id}/brand-kit`, tokenB, { 'x-business-id': bizA2.id });
  assert(crossTest2.status === 403, `Tenant B blocked from reading Tenant A second business (HTTP ${crossTest2.status} Forbidden)`);

  // Cross-tenant attempt 3: Tenant A tries to read Business B1 Brand Kit
  const crossTest3 = await get(`/businesses/${bizB1.id}/brand-kit`, tokenA, { 'x-business-id': bizB1.id });
  assert(crossTest3.status === 403, `Tenant A blocked from reading Tenant B business (HTTP ${crossTest3.status} Forbidden)`);

  // 10. Invite Team Member to Org A
  const inviteRes = await post(`/organizations/${orgA.id}/invitations`, {
    email: 'marketer@crosstech.io',
    role: 'marketing_manager',
  }, tokenA);
  assert(inviteRes.status === 201 && inviteRes.body.data.token.startsWith('inv_'), 'Org Admin can issue secure invitations to employees');

  console.log('\n======================================================================');
  console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(0)}%)`);
  console.log('======================================================================\n');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
