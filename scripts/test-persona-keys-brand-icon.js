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

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
}

async function run() {
  console.log('======================================================================');
  console.log('VERIFYING BRAND ICON, PERSONA KEYS & SOCIAL INTEGRATION CREDENTIALS');
  console.log('======================================================================');

  const email = `test_admin_${Date.now()}@synergy.example.com`;
  const reg = await post('/auth/register', {
    email,
    password: 'Password123!',
    fullName: 'Executive Workspace Admin',
    organizationName: 'Global Retail Holdings',
    initialBusinessName: 'Aura Luxury',
    industry: 'Fashion & Retail',
  });

  assert(reg.status === 201, 'Workspace registered successfully');
  const token = reg.body.data.token;
  const businessId = reg.body.data.business.id;
  const headers = { 'x-business-id': businessId };

  // 1. Brand Kit Icon & Logo URL Test
  console.log('\n--- Testing Brand Kit Icon & Logo Fields ---');
  const updateBk = await put(
    `/businesses/${businessId}/brand-kit`,
    {
      brandName: 'Aura Luxury Apparel',
      tagline: 'Sustainable Luxury & Conscious Streetwear',
      websiteUrl: 'https://aura-luxury.example.com',
      logoUrl: 'https://cdn.example.com/aura/logo.svg',
      iconUrl: 'https://cdn.example.com/aura/icon-mark.svg',
      primaryColor: '#0f172a',
      accentColor: '#1d4ed8',
    },
    token,
    headers
  );

  assert(updateBk.status === 200, 'Brand Kit updated with icon and logo URL');
  assert(updateBk.body.data.iconUrl === 'https://cdn.example.com/aura/icon-mark.svg', 'Brand Kit persisted iconUrl correctly');
  assert(updateBk.body.data.logoUrl === 'https://cdn.example.com/aura/logo.svg', 'Brand Kit persisted logoUrl correctly');

  const readBk = await get(`/businesses/${businessId}/brand-kit`, token, headers);
  assert(readBk.status === 200 && readBk.body.data.iconUrl === 'https://cdn.example.com/aura/icon-mark.svg', 'GET /brand-kit returns persisted iconUrl');

  // 2. Individual Persona API Key & Spend Configuration Test
  console.log('\n--- Testing Persona-Specific API Key & Model Configuration ---');
  const configWriter = await post(
    '/ai/personas/content_writer/configure',
    {
      provider: 'gemini',
      model: 'gemini-1.5-flash-pro',
      apiKey: 'AIzaSy_custom_secret_key_for_writer_persona_9921',
      temperature: 0.85,
      systemInstructions: 'You are the Elite Writer persona specialized in viral TikTok & Instagram carousels.',
      monthlySpendLimitUsd: 75.0,
      isEnabled: true,
    },
    token
  );

  assert(configWriter.status === 201, 'Content Writer configured with individual API key');
  assert(configWriter.body.data.hasApiKey === true, 'Content Writer hasApiKey is true');
  assert(configWriter.body.data.apiKeyPreview.includes('••••'), 'Content Writer apiKey is masked in response');
  assert(configWriter.body.data.monthlySpendLimitUsd === 75, 'Content Writer monthly spend cap persisted');

  const personas = await get('/ai/personas');
  assert(personas.status === 200, 'GET /ai/personas returned 200');
  const writer = personas.body.data.find((p) => p.role === 'content_writer');
  assert(writer && writer.hasApiKey === true, 'GET /ai/personas shows writer hasApiKey');
  assert(writer && writer.apiKeyPreview && writer.apiKeyPreview.includes('••••'), 'GET /ai/personas shows masked apiKeyPreview');

  // 3. Social Platform Direct Credentials Test
  console.log('\n--- Testing Social Platform Direct API Key & Secret Storage ---');
  const connectInstagram = await post(
    '/social/accounts/connect',
    {
      platform: 'instagram',
      platformAccountId: 'ig_direct_98765',
      accountName: '@aura.luxury.official',
      accessToken: 'EAABwz_direct_meta_user_long_lived_token_12345',
      apiKey: 'meta_app_id_9876543210',
      apiSecret: 'meta_app_secret_abc123xyz789',
    },
    token,
    headers
  );

  assert(connectInstagram.status === 201 && connectInstagram.body.data.success, 'Instagram connected directly with App ID & Secret');

  const socialAccounts = await get('/social/accounts', token, headers);
  assert(socialAccounts.status === 200, 'GET /social/accounts returned 200');
  const igAcc = socialAccounts.body.data.find((a) => a.platformAccountId === 'ig_direct_98765');
  assert(igAcc && igAcc.hasCredential === true, 'Instagram account has encrypted credential');
  assert(igAcc && igAcc.tokenPreview && igAcc.tokenPreview.includes('••••'), 'Token preview is properly masked');
  assert(igAcc && igAcc.apiKeyPreview && igAcc.apiKeyPreview.includes('••••'), 'API Key preview is properly masked');

  console.log('\n======================================================================');
  console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED (100%)`);
  console.log('======================================================================');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

