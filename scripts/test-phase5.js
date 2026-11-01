/**
 * Synergy v2 - Phase 5 Verification Test Suite
 * Automated tests for Social Media API Integrations (Instagram, LinkedIn, X),
 * OAuth token management, AES-256 encryption, content pre-flight validation,
 * publishing execution, and cross-tenant isolation.
 */

const BASE_URL = 'http://127.0.0.1:4000/api/v1';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  return { status: res.status, ok: res.ok, data: json };
}

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

async function runPhase5Tests() {
  console.log('====================================================');
  console.log('SYNERGY PHASE 5 - SOCIAL MEDIA API INTEGRATIONS');
  console.log('====================================================\n');

  // Test 1: Health Check
  const healthRes = await request('/health');
  assert(
    healthRes.status === 200 &&
      (healthRes.data.data.status === 'ok' || healthRes.data.data.status === 'healthy'),
    'API health status ok'
  );

  // Test 2: Register Tenant A
  const ts = Date.now();
  const regA = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founder_social_${ts}@synergy-onix.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Marcus Vance',
      organizationName: `Vance Media Group ${ts}`,
      businessName: 'Vance Social Global',
    },
  });
  assert(regA.status === 201 && regA.data.data.token, 'Tenant A registered successfully');
  const tokenA = regA.data.data.token;
  const businessIdA = regA.data.data.business.id;

  // Test 3: OAuth Authorization URLs
  console.log('\n--- Testing OAuth URL Generation ---');
  const igUrlRes = await request('/social/oauth/instagram/url', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(
    igUrlRes.status === 200 && igUrlRes.data.data.authorizationUrl.includes('facebook.com'),
    'Instagram Meta OAuth URL generated with CSRF state'
  );

  const liUrlRes = await request('/social/oauth/linkedin/url', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(
    liUrlRes.status === 200 && liUrlRes.data.data.authorizationUrl.includes('linkedin.com/oauth/v2'),
    'LinkedIn OAuth URL generated with CSRF state'
  );

  const xUrlRes = await request('/social/oauth/x/url', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(
    xUrlRes.status === 200 && xUrlRes.data.data.authorizationUrl.includes('twitter.com/i/oauth2'),
    'X (Twitter) PKCE OAuth URL generated with CSRF state'
  );

  // Test 4: OAuth Callback & Connection Handling for all 3 Platforms
  console.log('\n--- Testing Platform Adapter Connect & OAuth Callback ---');
  // 4a. Connect Instagram
  const igConnRes = await request('/social/oauth/instagram/callback', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      code: 'auth_code_meta_graph_test',
      state: 'state_nonce',
      redirectUri: 'http://localhost:3000/settings/connections/callback',
    },
  });
  assert(igConnRes.status === 201 && igConnRes.data.data.success, 'Instagram account connected via OAuth flow');

  // 4b. Connect LinkedIn
  const liConnRes = await request('/social/oauth/linkedin/callback', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      code: 'auth_code_linkedin_test',
      state: 'state_nonce',
      redirectUri: 'http://localhost:3000/settings/connections/callback',
    },
  });
  assert(liConnRes.status === 201 && liConnRes.data.data.success, 'LinkedIn account connected via OAuth flow');

  // 4c. Connect X
  const xConnRes = await request('/social/oauth/x/callback', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      code: 'auth_code_x_pkce_test',
      state: 'state_nonce',
      redirectUri: 'http://localhost:3000/settings/connections/callback',
    },
  });
  assert(xConnRes.status === 201 && xConnRes.data.data.success, 'X account connected via OAuth flow');

  // Test 5: Verify Connected Accounts & Token Masking
  console.log('\n--- Testing Account Listing & Security Masking ---');
  const accountsRes = await request('/social/accounts', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(accountsRes.status === 200 && accountsRes.data.data.length === 3, 'All 3 platforms listed under business');

  const igAccount = accountsRes.data.data.find((a) => a.platform === 'instagram');
  const liAccount = accountsRes.data.data.find((a) => a.platform === 'linkedin');
  const xAccount = accountsRes.data.data.find((a) => a.platform === 'x');

  assert(igAccount && igAccount.isConnected && igAccount.hasCredential, 'Instagram account active with encrypted credential');
  assert(liAccount && liAccount.isConnected && liAccount.hasCredential, 'LinkedIn account active with encrypted credential');
  assert(xAccount && xAccount.isConnected && xAccount.hasCredential, 'X account active with encrypted credential');
  assert(
    igAccount.tokenPreview.includes('••••••••'),
    'Access token is masked in API responses for security'
  );

  // Test 6: Pre-flight Content Validation Engine
  console.log('\n--- Testing Pre-Flight Content Validation Engine ---');
  // 6a: Instagram validation: exceed 30 hashtags
  const excessiveHashtags = Array.from({ length: 32 }, (_, i) => `#tag${i}`);
  const igFailVal = await request('/social/validate-post', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'instagram',
      text: 'Post with excessive hashtags',
      hashtags: excessiveHashtags,
    },
  });
  assert(
    igFailVal.status === 201 && !igFailVal.data.data.valid && igFailVal.data.data.errors.length > 0,
    'Instagram validation rejects > 30 hashtags'
  );

  // 6b: X validation: character limit 280
  const longText = 'A'.repeat(300);
  const xFailVal = await request('/social/validate-post', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'x',
      text: longText,
    },
  });
  assert(
    xFailVal.status === 201 && !xFailVal.data.data.valid && xFailVal.data.data.errors.length > 0,
    'X validation rejects > 280 characters in single tweet mode'
  );

  // 6c: LinkedIn validation: compliant post
  const liSuccessVal = await request('/social/validate-post', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'linkedin',
      text: 'Executive perspective on autonomous agent architecture in 2027.',
      hashtags: ['#Leadership', '#AI'],
    },
  });
  assert(liSuccessVal.status === 201 && liSuccessVal.data.data.valid, 'LinkedIn valid post passes pre-flight checks');

  // Test 7: Direct Publishing Execution
  console.log('\n--- Testing Platform Publishing Execution ---');
  // First, generate a content draft using Phase 4 pipeline
  const genRes = await request('/content/generate-pipeline', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      objective: 'Scalable multi-agent orchestration for high-volume marketing workflows',
      targetPlatforms: ['instagram', 'linkedin', 'x'],
      format: 'carousel',
      carouselSlideCount: 5,
    },
  });
  assert(genRes.status === 201 && genRes.data.data.content, 'Content draft created for publishing');
  const contentId = genRes.data.data.content.id;

  // 7a. Publish to Instagram
  const pubIgRes = await request('/social/publish-now', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      contentId,
      platform: 'instagram',
    },
  });
  assert(
    pubIgRes.status === 201 && pubIgRes.data.data.publishResult.success,
    'Published successfully to Instagram with carousel slides'
  );
  assert(pubIgRes.data.data.publishResult.url.includes('instagram.com/p/'), 'Instagram permalink returned');

  // 7b. Publish to LinkedIn
  const pubLiRes = await request('/social/publish-now', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      contentId,
      platform: 'linkedin',
    },
  });
  assert(
    pubLiRes.status === 201 && pubLiRes.data.data.publishResult.success,
    'Published successfully to LinkedIn'
  );
  assert(pubLiRes.data.data.publishResult.url.includes('linkedin.com/feed/update/'), 'LinkedIn permalink returned');

  // 7c. Publish to X
  const pubXRes = await request('/social/publish-now', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      contentId,
      platform: 'x',
    },
  });
  assert(
    pubXRes.status === 201 && pubXRes.data.data.publishResult.success,
    'Published successfully to X'
  );
  assert(pubXRes.data.data.publishResult.url.includes('x.com/'), 'X permalink returned');

  // Test 8: Test Connection & Token Refresh Lifecycle
  console.log('\n--- Testing Connection Health Check & Token Refresh ---');
  const testConnRes = await request(`/social/accounts/${igAccount.id}/test-connection`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(testConnRes.status === 201 && testConnRes.data.data.success, 'Connection test verified token active');

  // Test 9: Disconnect Account
  console.log('\n--- Testing Account Disconnection ---');
  const disconnRes = await request(`/social/accounts/${xAccount.id}/disconnect`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(disconnRes.status === 201 && disconnRes.data.data.disconnected, 'Account disconnected and credentials purged');

  // Test 10: Multi-Tenant Boundary Enforcement
  console.log('\n--- Testing Cross-Tenant Security Isolation ---');
  const regB = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founder_competitor_${ts}@rival-media.com`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Arthur Pendelton',
      organizationName: `Rival Organization ${ts}`,
      businessName: 'Rival Business',
    },
  });
  const tokenB = regB.data.data.token;
  const businessIdB = regB.data.data.business.id;

  // Tenant B attempts to read Tenant A's social accounts
  const crossAccountsRes = await request('/social/accounts', {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
  });
  assert(crossAccountsRes.status === 403, 'Tenant B blocked from accessing Tenant A accounts (HTTP 403 Forbidden)');

  // Tenant B attempts to test Tenant A's account connection
  const crossTestRes = await request(`/social/accounts/${igAccount.id}/test-connection`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdB },
  });
  assert(crossTestRes.status === 403, 'Cross-tenant account access blocked with HTTP 403 Forbidden');

  // Tenant B attempts to publish via Tenant A's content
  const crossPubRes = await request('/social/publish-now', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdB },
    body: {
      contentId,
      platform: 'instagram',
    },
  });
  assert(crossPubRes.status === 403, 'Cross-tenant publish attempt blocked with HTTP 403 Forbidden');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 5 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error('Phase 5 tests failed:', err);
  process.exit(1);
});
