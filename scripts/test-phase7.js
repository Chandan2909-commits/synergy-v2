/**
 * Synergy v2 - Phase 7 Verification Test Suite
 * Automated tests for Agentic Orchestration and Autonomous Marketing:
 * Central AI Orchestrator, structured task messages, multi-persona sequence
 * (Strategist -> Writer -> Designer -> QA -> Approval Policy -> Scheduler),
 * approval modes (Manual, Conditional, Full Auto), budget safety guards,
 * emergency shutdown, execution history, and cross-tenant isolation.
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

async function runPhase7Tests() {
  console.log('====================================================');
  console.log('SYNERGY PHASE 7 - AGENTIC ORCHESTRATION VERIFICATION');
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
      email: `founder_agentic_${ts}@synergy-onix.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Aria Thorne',
      organizationName: `Thorne Autonomous Ventures ${ts}`,
      businessName: 'Thorne AI Labs',
    },
  });
  assert(regA.status === 201 && regA.data.data.token, 'Tenant A registered successfully');
  const tokenA = regA.data.data.token;
  const businessIdA = regA.data.data.business.id;

  // Test 3: Connect Social Channel (LinkedIn)
  const connLi = await request('/social/accounts/connect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      platform: 'linkedin',
      platformAccountId: `urn:li:person:${ts}`,
      accountName: 'Thorne AI Labs Official',
      accessToken: 'valid_test_token_orchestrator',
    },
  });
  assert(connLi.status === 201 && connLi.data.data.success, 'LinkedIn channel connected for autonomous dispatch');

  // Test 4: Create Workflow with Conditional Approval Mode
  console.log('\n--- Creating Workflow Configuration ---');
  const createWfRes = await request('/orchestration/workflows', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      name: 'Weekly Autonomous Thought Leadership',
      description: 'End-to-end B2B campaign production and publishing sequence',
      triggerType: 'cron',
      cronSchedule: '0 10 * * 0',
      targetPlatforms: ['linkedin'],
      approvalMode: 'conditional',
      monthlyAiBudgetUsd: 100.0,
    },
  });
  assert(createWfRes.status === 201 && createWfRes.data.data.id, 'Workflow created in database');
  const workflowId1 = createWfRes.data.data.id;

  // Test 5: Trigger Autonomous Workflow with Conditional Approval
  console.log('\n--- Triggering Workflow: Conditional Mode ---');
  const triggerRes1 = await request(`/orchestration/workflows/${workflowId1}/trigger`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      objective: 'Why autonomous agent swarms will replace conventional digital marketing agencies by 2027',
    },
  });
  assert(triggerRes1.status === 201, 'Autonomous workflow executed successfully (HTTP 201)');
  const exec1 = triggerRes1.data.data.execution;
  assert(exec1 && exec1.status === 'success', 'Execution status marked success');
  assert(triggerRes1.data.data.steps && triggerRes1.data.data.steps.length === 5, 'All 5 orchestrator steps executed (Strategist -> Writer -> Designer -> QA -> Approval)');
  assert(triggerRes1.data.data.scheduledPosts.length >= 1, 'Conditional approval auto-scheduled post into queue (score >= 85%)');

  // Verify task structure per Section 7.2
  const firstStep = triggerRes1.data.data.steps[0];
  assert(firstStep.taskId && firstStep.persona === 'marketing_strategist', 'Task contains taskId and persona ID');
  assert(firstStep.tokensConsumed > 0 && firstStep.costUsd > 0, 'Task tracks tokens and cost accounting');

  // Test 6: Workflow with Manual Approval Mode
  console.log('\n--- Testing Manual Approval Mode ---');
  const createManualWf = await request('/orchestration/workflows', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      name: 'High-Stakes Brand Launch',
      targetPlatforms: ['linkedin'],
      approvalMode: 'manual',
      monthlyAiBudgetUsd: 50.0,
    },
  });
  const manualWfId = createManualWf.data.data.id;

  const triggerManualRes = await request(`/orchestration/workflows/${manualWfId}/trigger`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      objective: 'Announcing our strategic partnership with global venture consortium',
    },
  });
  assert(triggerManualRes.status === 201, 'Manual workflow executed');
  assert(triggerManualRes.data.data.execution.status === 'requires_approval', 'Execution marked requires_approval');
  assert(triggerManualRes.data.data.content.status === 'pending_approval', 'Content held in pending_approval for human sign-off');
  assert(triggerManualRes.data.data.scheduledPosts.length === 0, 'No posts auto-scheduled under manual approval policy');

  // Test 7: Workflow with Full Auto Approval Mode
  console.log('\n--- Testing Full Auto Approval Mode ---');
  const createAutoWf = await request('/orchestration/workflows', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      name: 'Daily Social Tips',
      targetPlatforms: ['linkedin'],
      approvalMode: 'full_auto',
      monthlyAiBudgetUsd: 75.0,
    },
  });
  const autoWfId = createAutoWf.data.data.id;

  const triggerAutoRes = await request(`/orchestration/workflows/${autoWfId}/trigger`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      objective: 'Three daily productivity hacks for asynchronous engineering teams',
    },
  });
  assert(triggerAutoRes.status === 201, 'Full auto workflow executed');
  assert(triggerAutoRes.data.data.execution.status === 'success', 'Full auto execution marked success');
  assert(
    triggerAutoRes.data.data.content.status === 'approved' ||
      triggerAutoRes.data.data.content.status === 'scheduled',
    'Content automatically approved without human intervention and queued'
  );
  assert(triggerAutoRes.data.data.scheduledPosts.length >= 1, 'Post immediately dispatched to scheduled publishing queue');

  // Test 8: Direct Ad-Hoc Autonomous Execution
  console.log('\n--- Testing Direct Ad-Hoc Autonomous Execution ---');
  const adhocRes = await request('/orchestration/execute-autonomous', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      objective: 'Rapid deployment playbooks for autonomous revenue operations',
      targetPlatforms: ['linkedin'],
      approvalMode: 'conditional',
    },
  });
  assert(adhocRes.status === 201 && adhocRes.data.data.success, 'Ad-hoc autonomous campaign created and evaluated');

  // Test 9: Reliability - Budget Safety Limits (Section 7.7)
  console.log('\n--- Testing Budget Limits Guard ---');
  const lowBudgetWf = await request('/orchestration/workflows', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      name: 'Strict Budget Workflow',
      targetPlatforms: ['linkedin'],
      monthlyAiBudgetUsd: 0.0001, // ultra low budget limit
    },
  });
  const lowBudgetId = lowBudgetWf.data.data.id;

  // Artificially simulate spent budget
  await request(`/orchestration/workflows/${lowBudgetId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { monthlyAiBudgetUsd: 0.0001 },
  });

  // First run spends budget
  await request(`/orchestration/workflows/${lowBudgetId}/trigger`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { objective: 'First run' },
  });

  // Second run must be blocked by budget limit
  const budgetBlockedRes = await request(`/orchestration/workflows/${lowBudgetId}/trigger`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { objective: 'Second run should fail' },
  });
  const budgetErr = budgetBlockedRes.data.error?.message || budgetBlockedRes.data.message || '';
  assert(
    budgetBlockedRes.status === 400 && budgetErr.includes('Monthly AI spending limit'),
    'Execution blocked when monthly AI spending limit exceeded'
  );

  // Test 10: Reliability - Emergency Shutdown
  console.log('\n--- Testing Emergency Shutdown ---');
  const stopRes = await request('/orchestration/emergency-stop', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(stopRes.status === 201 && stopRes.data.data.deactivatedCount >= 1, 'Emergency stop deactivated all active workflows');

  // Triggering inactive workflow is rejected
  const inactiveTriggerRes = await request(`/orchestration/workflows/${workflowId1}/trigger`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { objective: 'Should fail' },
  });
  assert(inactiveTriggerRes.status === 400, 'Triggering inactive workflow blocked');

  // Test 11: Workflow Execution History & Audit Logs
  console.log('\n--- Testing Execution History Audit ---');
  const historyRes = await request(`/orchestration/workflows/${workflowId1}/executions`, {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(historyRes.status === 200 && historyRes.data.data.length >= 1, 'Retrieved execution history list');

  const detailRes = await request(`/orchestration/executions/${exec1.id}`, {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(detailRes.status === 200 && detailRes.data.data.stepResults.length === 5, 'Retrieved detailed execution audit with step results');

  // Test 12: Cross-Tenant Security Isolation
  console.log('\n--- Testing Cross-Tenant Security Isolation ---');
  const regB = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founder_spyo_${ts}@rival-group.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Logan Roy',
      organizationName: `Waystar Media ${ts}`,
      businessName: 'Waystar AI',
    },
  });
  const tokenB = regB.data.data.token;
  const businessIdB = regB.data.data.business.id;

  // Tenant B attempts to read Tenant A's workflows
  const crossWfRes = await request('/orchestration/workflows', {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
  });
  assert(crossWfRes.status === 403, 'Cross-tenant workflow listing blocked (HTTP 403 Forbidden)');

  // Tenant B attempts to trigger Tenant A's workflow
  const crossTriggerRes = await request(`/orchestration/workflows/${workflowId1}/trigger`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdB },
    body: { objective: 'Malicious trigger' },
  });
  assert(crossTriggerRes.status === 403, 'Cross-tenant trigger blocked with HTTP 403 Forbidden');

  // Tenant B attempts to view Tenant A's execution history
  const crossExecRes = await request(`/orchestration/executions/${exec1.id}`, {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdB },
  });
  assert(crossExecRes.status === 403, 'Cross-tenant execution audit view blocked with HTTP 403 Forbidden');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 7 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase7Tests().catch((err) => {
  console.error('Phase 7 tests failed:', err);
  process.exit(1);
});
