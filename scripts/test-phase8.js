/**
 * Synergy v2 - Phase 8 Verification Test Suite
 * Automated tests for MVP Analytics:
 * Metric synchronization, historical snapshot storage, metric availability checks,
 * overview KPI calculations, platform comparison (Instagram vs LinkedIn vs X),
 * Pure SVG trend splines & conversion funnel, top-performing posts,
 * Analytics Agent strategic insights, and cross-tenant isolation.
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

async function runPhase8Tests() {
  console.log('====================================================');
  console.log('SYNERGY PHASE 8 - MVP ANALYTICS VERIFICATION');
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
      email: `founder_analytics_${ts}@synergy-onix.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Cassandra Blake',
      organizationName: `Blake Quantitative Growth ${ts}`,
      businessName: 'Blake Metrics Capital',
    },
  });
  assert(regA.status === 201 && regA.data.data.token, 'Tenant A registered successfully');
  const tokenA = regA.data.data.token;
  const businessIdA = regA.data.data.business.id;

  // Test 3: Connect Social Channels
  console.log('\n--- Connecting Social Channels for Analytics ---');
  const connIg = await request('/social/accounts/connect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'instagram',
      platformAccountId: `ig_${ts}`,
      accountName: '@BlakeCapital',
      accessToken: 'valid_test_token_analytics',
    },
  });
  assert(connIg.status === 201 && connIg.data.data.success, 'Instagram channel connected');
  const igAccountId = connIg.data.data.account.id;

  const connLi = await request('/social/accounts/connect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'linkedin',
      platformAccountId: `urn:li:person:${ts}`,
      accountName: 'Blake Metrics Global',
      accessToken: 'valid_test_token_analytics',
    },
  });
  assert(connLi.status === 201 && connLi.data.data.success, 'LinkedIn channel connected');
  const liAccountId = connLi.data.data.account.id;

  // Test 4: Publish Posts to Generate Data Sources
  console.log('\n--- Publishing Sample Posts to Populate Metrics ---');
  const genRes = await request('/content/generate-pipeline', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      objective: 'Quantitative analysis of AI-augmented marketing operations in Series B SaaS',
      targetPlatforms: ['instagram', 'linkedin'],
      format: 'carousel',
      carouselSlideCount: 5,
    },
  });
  assert(genRes.status === 201 && genRes.data.data.content, 'Content draft generated');
  const contentId = genRes.data.data.content.id;

  // Schedule and process due post to create published records
  const schedRes = await request('/publishing/schedule', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      contentId,
      socialAccountId: liAccountId,
      scheduledTime: new Date(Date.now() - 5000).toISOString(),
    },
  });
  assert(schedRes.status === 201, 'Post scheduled into publishing queue');

  const pubProcessRes = await request('/publishing/process-due', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(pubProcessRes.status === 201 && pubProcessRes.data.data.successfulCount >= 1, 'Post published to generate real analytics data source');

  // Test 5: Metrics Synchronization API (Section 8.2)
  console.log('\n--- Testing Metrics Synchronization ---');
  const syncRes = await request('/analytics/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {},
  });
  assert(syncRes.status === 201 && syncRes.data.data.success, 'Metrics synchronized from platform adapters');
  assert(syncRes.data.data.snapshotsRecorded >= 1, 'Historical snapshots created in database');

  // Test 6: Query Raw Snapshots
  const snapRes = await request('/analytics/snapshots', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(snapRes.status === 200 && snapRes.data.data.length >= 1, 'Retrieved raw analytics snapshots from database');
  assert(snapRes.data.data[0].source === 'platform_api' || snapRes.data.data[0].source === 'account_profile', 'Snapshots store metric source traceability');

  // Test 7: Analytics Overview Dashboard (Section 8.3)
  console.log('\n--- Testing Analytics Dashboard Overview ---');
  const overviewRes = await request('/analytics/overview?period=7d', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(overviewRes.status === 200, 'Overview dashboard returned 200 OK');
  const kpi = overviewRes.data.data.kpiSummary;

  // KPI Assertions
  assert(kpi.totalPublished >= 1, 'Tracks total published posts');
  assert(kpi.totalImpressions > 0, 'Aggregates total impressions');
  assert(kpi.totalReach > 0, 'Aggregates total reach');
  assert(kpi.totalEngagement > 0, 'Aggregates total engagement (likes + comments + shares)');
  assert(kpi.engagementRate >= 0, 'Calculates engagement rate percentage');

  // Platform Comparison (Section 8.1 & 8.3)
  const breakdown = overviewRes.data.data.platformBreakdown;
  assert(breakdown && breakdown.length === 3, 'Returns platform breakdown for Instagram, LinkedIn, and X');

  const igMetrics = breakdown.find((b) => b.platform === 'instagram');
  const liMetrics = breakdown.find((b) => b.platform === 'linkedin');
  assert(igMetrics && liMetrics, 'Both Instagram and LinkedIn platform breakdowns present');

  // Metric Availability Verification (Section 8.1: distinguish zero from unavailable)
  assert(igMetrics.metrics.clicks.isAvailable === false, 'Instagram post clicks explicitly identified as unavailable on platform');
  assert(liMetrics.metrics.clicks.isAvailable === true, 'LinkedIn clicks identified as available');

  // Pure SVG Infographic Data
  assert(overviewRes.data.data.trendSplines.length === 7, 'Returns 7-point trend splines for pure SVG Bézier chart');
  assert(overviewRes.data.data.conversionFunnel.length === 5, 'Returns 5-step conversion pipeline funnel');
  assert(overviewRes.data.data.qualityScore.score >= 90, 'Speedometer quality score calculated');
  assert(overviewRes.data.data.audienceSentiment.positivePercent > 50, 'Audience sentiment distribution returned');

  // Top Performing Posts
  assert(overviewRes.data.data.topPosts.length >= 1, 'Top performing posts listed');

  // Test 8: Analytics Agent Strategic Insights (Section 8.4)
  console.log('\n--- Testing Analytics Agent Recommendations ---');
  const insightsRes = await request('/analytics/insights', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(insightsRes.status === 200, 'Analytics Agent insights returned 200 OK');
  assert(insightsRes.data.data.insights.length >= 3, 'Returns top performing content findings & schedule recommendations');
  assert(insightsRes.data.data.suggestedNextPillars.length >= 2, 'Recommends next strategic content pillars for the Lead Strategist');

  // Test 9: Cross-Tenant Security Isolation
  console.log('\n--- Testing Cross-Tenant Security Isolation ---');
  const regB = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founder_snoop_${ts}@competitor-capital.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Gordy Vance',
      organizationName: `Vance Competitor Group ${ts}`,
      businessName: 'Vance Capital',
    },
  });
  const tokenB = regB.data.data.token;
  const businessIdB = regB.data.data.business.id;

  // Tenant B attempts to read Tenant A's analytics overview
  const crossOverviewRes = await request('/analytics/overview', {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
  });
  assert(crossOverviewRes.status === 403, 'Cross-tenant analytics overview access blocked with HTTP 403 Forbidden');

  // Tenant B attempts to read Tenant A's snapshots
  const crossSnapRes = await request('/analytics/snapshots', {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
  });
  assert(crossSnapRes.status === 403, 'Cross-tenant snapshot access blocked with HTTP 403 Forbidden');

  // Tenant B attempts to trigger sync on Tenant A
  const crossSyncRes = await request('/analytics/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
    body: {},
  });
  assert(crossSyncRes.status === 403, 'Cross-tenant sync attempt blocked with HTTP 403 Forbidden');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 8 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase8Tests().catch((err) => {
  console.error('Phase 8 tests failed:', err);
  process.exit(1);
});
