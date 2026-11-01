/**
 * Synergy v2 - Phase 6 Verification Test Suite
 * Automated tests for Content Calendar & Publishing Engine:
 * Post scheduling, idempotency, duplicate prevention, calendar views,
 * status transition state machine, drag-and-drop rescheduling, cancellation,
 * background publishing worker, execution lock, audit logs, and cross-tenant isolation.
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

async function runPhase6Tests() {
  console.log('====================================================');
  console.log('SYNERGY PHASE 6 - CALENDAR & PUBLISHING ENGINE');
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
      email: `founder_calendar_${ts}@synergy-onix.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Elena Rostova',
      organizationName: `Apex Media Group ${ts}`,
      businessName: 'Apex Capital Brand',
    },
  });
  assert(regA.status === 201 && regA.data.data.token, 'Tenant A registered successfully');
  const tokenA = regA.data.data.token;
  const businessIdA = regA.data.data.business.id;

  // Test 3: Connect Social Accounts (Instagram, LinkedIn, X)
  console.log('\n--- Setting up Connected Social Channels ---');
  const connIg = await request('/social/accounts/connect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'instagram',
      platformAccountId: `ig_${ts}`,
      accountName: '@ApexCapital',
      accessToken: 'test_token_ig_valid_secret',
    },
  });
  assert(connIg.status === 201 && connIg.data.data.success, 'Instagram connected');
  const igAccountId = connIg.data.data.account.id;

  const connLi = await request('/social/accounts/connect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'linkedin',
      platformAccountId: `urn:li:person:${ts}`,
      accountName: 'Apex Capital Holdings',
      accessToken: 'test_token_li_valid_secret',
    },
  });
  assert(connLi.status === 201 && connLi.data.data.success, 'LinkedIn connected');
  const liAccountId = connLi.data.data.account.id;

  // Test 4: Generate Content Drafts
  console.log('\n--- Generating Production Content Drafts ---');
  const genRes = await request('/content/generate-pipeline', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      objective: 'Capital allocation frameworks for next-generation intelligence infrastructure',
      targetPlatforms: ['instagram', 'linkedin', 'x'],
      format: 'carousel',
      carouselSlideCount: 5,
    },
  });
  assert(genRes.status === 201 && genRes.data.data.content, 'Content draft generated with multi-persona pipeline');
  const contentId1 = genRes.data.data.content.id;

  const draftRes2 = await request('/content/draft', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      title: 'Q4 Macro Market Outlook',
      masterCopy: 'Executive summary on Q4 venture debt and capital efficiency.',
      targetPlatforms: ['linkedin'],
    },
  });
  const contentId2 = draftRes2.data.data.id;

  // Test 5: Post Scheduling & Idempotency Key
  console.log('\n--- Testing Scheduling & Idempotency ---');
  const futureDate = new Date(Date.now() + 3600 * 24 * 3 * 1000).toISOString(); // 3 days in future

  const scheduleRes = await request('/publishing/schedule', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      contentId: contentId1,
      socialAccountId: igAccountId,
      scheduledTime: futureDate,
    },
  });
  assert(scheduleRes.status === 201 && scheduleRes.data.data.id, 'Post scheduled successfully for Instagram');
  const scheduledPostId1 = scheduleRes.data.data.id;
  assert(scheduleRes.data.data.idempotencyKey.includes(`idemp_${contentId1}_${igAccountId}`), 'Deterministic idempotency key generated');

  // Double-scheduling attempt (idempotency defense)
  const dupScheduleRes = await request('/publishing/schedule', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      contentId: contentId1,
      socialAccountId: igAccountId,
      scheduledTime: futureDate,
    },
  });
  assert(
    dupScheduleRes.status === 201 &&
      (dupScheduleRes.data.data.message?.includes('already scheduled') || dupScheduleRes.data.data.id === scheduledPostId1),
    'Duplicate schedule request prevented via idempotency key'
  );

  // Test 6: Content Calendar Feed API
  console.log('\n--- Testing Calendar Feed API ---');
  const calRes = await request('/calendar?view=month', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(calRes.status === 200, 'Calendar feed returned 200 OK');
  assert(calRes.data.data.business.timezone, 'Calendar returns business timezone');
  assert(calRes.data.data.summary.scheduledCount >= 1, 'Calendar aggregates scheduled posts');
  assert(calRes.data.data.summary.draftsCount >= 1, 'Calendar aggregates drafts');

  // Test 7: Post Status State Machine Enforcement (Phase 6.2)
  console.log('\n--- Testing Post Status State Machine (Section 6.2) ---');
  // 7a. Valid transition: draft -> pending_approval
  const validTrans1 = await request(`/calendar/content/${contentId2}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { status: 'pending_approval' },
  });
  assert(validTrans1.status === 200 && validTrans1.data.data.status === 'pending_approval', 'Valid transition: draft -> pending_approval');

  // 7b. Valid transition: pending_approval -> approved
  const validTrans2 = await request(`/calendar/content/${contentId2}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { status: 'approved' },
  });
  assert(validTrans2.status === 200 && validTrans2.data.data.status === 'approved', 'Valid transition: pending_approval -> approved');

  // 7c. Invalid transition: approved cannot jump directly to failed
  const invalidTrans = await request(`/calendar/content/${contentId2}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { status: 'failed' },
  });
  assert(invalidTrans.status === 400, 'Invalid transition rejected with HTTP 400 Bad Request');

  // Test 8: Reschedule Post (Drag-and-Drop API)
  console.log('\n--- Testing Drag-and-Drop Rescheduling ---');
  const newDate = new Date(Date.now() + 3600 * 24 * 5 * 1000).toISOString(); // 5 days in future
  const rescheduleRes = await request(`/publishing/scheduled/${scheduledPostId1}/reschedule`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { scheduledTime: newDate },
  });
  assert(
    rescheduleRes.status === 201 && new Date(rescheduleRes.data.data.scheduledTime).getTime() === new Date(newDate).getTime(),
    'Post rescheduled to new future date'
  );

  // Test 9: Cancel Scheduled Post
  console.log('\n--- Testing Post Cancellation ---');
  const cancelRes = await request(`/publishing/scheduled/${scheduledPostId1}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(cancelRes.status === 201 && cancelRes.data.data.status === 'cancelled', 'Scheduled post cancelled');

  // Test 10: Publishing Worker Execution & Due Post Processing
  console.log('\n--- Testing Background Publishing Worker Execution ---');
  // Schedule a post due right now (or 2 seconds in past)
  const duePastDate = new Date(Date.now() - 5000).toISOString();
  const scheduleDueRes = await request('/publishing/schedule', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      contentId: contentId2,
      socialAccountId: liAccountId,
      scheduledTime: duePastDate,
    },
  });
  assert(scheduleDueRes.status === 201 && scheduleDueRes.data.data.id, 'Due post scheduled for LinkedIn publication');
  const duePostId = scheduleDueRes.data.data.id;

  // Trigger worker processing
  const processRes = await request('/publishing/process-due', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(processRes.status === 201 && processRes.data.data.processedCount >= 1, 'Worker identified and locked due post');
  assert(processRes.data.data.successfulCount >= 1, 'Worker published due post via LinkedIn adapter');

  // Verify post status updated to published
  const scheduledList = await request('/publishing/scheduled?status=published', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(
    scheduledList.status === 200 && scheduledList.data.data.some((p) => p.id === duePostId),
    'Post status transitioned to published in database'
  );

  // Test 11: Publishing Audit Logs
  console.log('\n--- Testing Publishing Audit Logs ---');
  const logsRes = await request('/publishing/logs', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(logsRes.status === 200 && logsRes.data.data.length >= 1, 'Publishing audit log recorded with status code & execution timestamp');
  assert(logsRes.data.data[0].statusCode === 200, 'Audit log records HTTP 200 success response');

  // Test 12: Cross-Tenant Security Isolation
  console.log('\n--- Testing Cross-Tenant Security Isolation ---');
  const regB = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founder_rival_${ts}@synergy-rival.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Victor Sterling',
      organizationName: `Sterling Media ${ts}`,
      businessName: 'Sterling Enterprises',
    },
  });
  const tokenB = regB.data.data.token;
  const businessIdB = regB.data.data.business.id;

  // Tenant B attempts to access Tenant A's calendar feed
  const crossCalRes = await request('/calendar', {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
  });
  assert(crossCalRes.status === 403, 'Cross-tenant calendar access blocked with HTTP 403 Forbidden');

  // Tenant B attempts to reschedule Tenant A's post
  const crossRescheduleRes = await request(`/publishing/scheduled/${duePostId}/reschedule`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdB },
    body: { scheduledTime: newDate },
  });
  assert(crossRescheduleRes.status === 403, 'Cross-tenant rescheduling blocked with HTTP 403 Forbidden');

  // Tenant B attempts to cancel Tenant A's post
  const crossCancelRes = await request(`/publishing/scheduled/${duePostId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdB },
  });
  assert(crossCancelRes.status === 403, 'Cross-tenant cancellation blocked with HTTP 403 Forbidden');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 6 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase6Tests().catch((err) => {
  console.error('Phase 6 tests failed:', err);
  process.exit(1);
});
