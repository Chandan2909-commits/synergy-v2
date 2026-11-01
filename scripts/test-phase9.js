/**
 * Synergy v2 - Phase 9 Verification Test Suite
 * Automated tests for Team Collaboration & MVP Completion:
 * Employee invitation lifecycle, membership management, RBAC role updates,
 * content approval workflow (submit, request changes, reject, approve),
 * notifications, system audit logs, and cross-tenant isolation.
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

async function runPhase9Tests() {
  console.log('====================================================');
  console.log('SYNERGY PHASE 9 - TEAM COLLABORATION & MVP SUITE');
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
      email: `founder_team_${ts}@synergy-onix.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Gabriel Mercer',
      organizationName: `Mercer Enterprise Group ${ts}`,
      businessName: 'Mercer Media Operations',
    },
  });
  assert(regA.status === 201 && regA.data.data.token, 'Tenant A registered successfully');
  const tokenA = regA.data.data.token;
  const businessIdA = regA.data.data.business.id;

  // Test 3: Issue Employee Invitations (Section 9.1)
  console.log('\n--- Testing Employee Invitation Lifecycle ---');
  const inviteRes1 = await request('/team/invitations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      email: `creator_${ts}@synergy-onix.ai`,
      role: 'content_creator',
    },
  });
  assert(inviteRes1.status === 201 && inviteRes1.data.data.token, 'Employee invitation generated with secure token');
  const inviteToken1 = inviteRes1.data.data.token;

  const inviteRes2 = await request('/team/invitations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      email: `revokeme_${ts}@synergy-onix.ai`,
      role: 'viewer',
    },
  });
  const inviteId2 = inviteRes2.data.data.invitationId;

  // List pending invitations
  const listInvites = await request('/team/invitations', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(listInvites.status === 200 && listInvites.data.data.length >= 2, 'Pending invitations listed for organization');

  // Revoke invitation
  const revokeRes = await request(`/team/invitations/${inviteId2}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(revokeRes.status === 200 && revokeRes.data.data.success, 'Invitation revoked successfully');

  // Accept invitation via token (public endpoint)
  const acceptRes = await request(`/team/invitations/${inviteToken1}/accept`, {
    method: 'POST',
    body: {
      fullName: 'Samantha Reed',
      password: 'SecurePassword123!',
    },
  });
  assert(acceptRes.status === 201 && acceptRes.data.data.success, 'Invitation accepted and member account created');
  const newUserId = acceptRes.data.data.user.id;

  // Test 4: Business Membership & RBAC Role Management (Section 9.1)
  console.log('\n--- Testing Team Membership & RBAC Role Updates ---');
  const membersRes = await request('/team/members', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(membersRes.status === 200 && membersRes.data.data.length >= 2, 'Team members listed with user details');

  const newMemberRecord = membersRes.data.data.find((m) => m.userId === newUserId);
  assert(newMemberRecord && newMemberRecord.role === 'content_creator', 'Accepted user assigned content_creator role');

  // Update member role to marketing_manager
  const updateRoleRes = await request(`/team/members/${newMemberRecord.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { role: 'marketing_manager' },
  });
  assert(updateRoleRes.status === 200 && updateRoleRes.data.data.role === 'marketing_manager', 'Member role updated to marketing_manager');

  // Test 5: Interactive Content Approval Workflow (Section 9.2)
  console.log('\n--- Testing Content Approval State Transitions ---');
  // Generate a draft
  const draftRes = await request('/content/draft', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: {
      title: 'Enterprise Q4 AI Adoption Index',
      masterCopy: 'Detailed report on enterprise agent adoption rates across Fortune 500.',
      targetPlatforms: ['linkedin'],
    },
  });
  assert(draftRes.status === 201, 'Content draft created for approval workflow');
  const contentId = draftRes.data.data.id;

  // 5a. Submit for approval -> status: pending_approval
  const submitRes = await request(`/team/approvals/${contentId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { notes: 'Ready for executive review before Friday announcement' },
  });
  assert(submitRes.status === 201 && submitRes.data.data.status === 'pending_approval', 'Content submitted for approval');

  // 5b. Request changes -> status: draft
  const changesRes = await request(`/team/approvals/${contentId}/request-changes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { notes: 'Please verify adoption figures in paragraph 3' },
  });
  assert(changesRes.status === 201 && changesRes.data.data.status === 'draft', 'Content returned to draft on changes requested');

  // 5c. Re-submit
  await request(`/team/approvals/${contentId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });

  // 5d. Reject -> status: draft
  const rejectRes = await request(`/team/approvals/${contentId}/reject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { reason: 'Data references superseded report' },
  });
  assert(rejectRes.status === 201 && rejectRes.data.data.status === 'draft', 'Content rejected and marked draft');

  // 5e. Re-submit & Approve -> status: approved
  await request(`/team/approvals/${contentId}/submit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });

  const approveRes = await request(`/team/approvals/${contentId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
    body: { notes: 'Approved by managing director' },
  });
  assert(approveRes.status === 201 && approveRes.data.data.status === 'approved', 'Content approved for publication');

  // 5f. Query Approval History Trail
  const historyRes = await request(`/team/approvals/${contentId}/history`, {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(historyRes.status === 200 && historyRes.data.data.length >= 4, 'Full approval audit trail recorded');
  const actions = historyRes.data.data.map((h) => h.action);
  assert(actions.includes('submitted') && actions.includes('approved') && actions.includes('rejected'), 'Approval trail contains all transition events');

  // Test 6: Team Notifications (Section 9.1)
  console.log('\n--- Testing Team Notifications ---');
  const notifRes = await request('/team/notifications', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(notifRes.status === 200 && notifRes.data.data.length >= 1, 'Notifications retrieved for user');
  const notifId = notifRes.data.data[0].id;

  const markReadRes = await request(`/team/notifications/${notifId}/read`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(markReadRes.status === 201 && markReadRes.data.data.read === true, 'Notification marked as read');

  // Test 7: System Audit Logs (Section 9.3 & 9.5)
  console.log('\n--- Testing Unified System Audit Logs ---');
  const auditRes = await request('/team/audit-logs', {
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(auditRes.status === 200 && auditRes.data.data.length >= 3, 'Audit logs retrieved for business workspace');
  const loggedActions = auditRes.data.data.map((a) => a.action);
  assert(loggedActions.includes('MEMBER_INVITED'), 'Audit log recorded MEMBER_INVITED');
  assert(loggedActions.includes('CONTENT_APPROVED'), 'Audit log recorded CONTENT_APPROVED');

  // Test 8: Member Removal
  console.log('\n--- Testing Member Removal ---');
  const removeRes = await request(`/team/members/${newMemberRecord.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}`, 'x-business-id': businessIdA },
  });
  assert(removeRes.status === 200 && removeRes.data.data.success, 'Member removed from business');

  // Test 9: Cross-Tenant Security Isolation
  console.log('\n--- Testing Cross-Tenant Security Isolation ---');
  const regB = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founder_team_rival_${ts}@synergy-rival.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Kendall Roy',
      organizationName: `Roy Strategic Holdings ${ts}`,
      businessName: 'Roy Media Operations',
    },
  });
  const tokenB = regB.data.data.token;
  const businessIdB = regB.data.data.business.id;

  // Tenant B attempts to read Tenant A's team members
  const crossMembersRes = await request('/team/members', {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
  });
  assert(crossMembersRes.status === 403, 'Cross-tenant member access blocked with HTTP 403 Forbidden');

  // Tenant B attempts to approve Tenant A's content
  const crossApproveRes = await request(`/team/approvals/${contentId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdB },
  });
  assert(crossApproveRes.status === 404 || crossApproveRes.status === 403, 'Cross-tenant approval blocked');

  // Tenant B attempts to read Tenant A's audit logs
  const crossAuditRes = await request('/team/audit-logs', {
    headers: { Authorization: `Bearer ${tokenB}`, 'x-business-id': businessIdA },
  });
  assert(crossAuditRes.status === 403, 'Cross-tenant audit log access blocked with HTTP 403 Forbidden');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 9 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase9Tests().catch((err) => {
  console.error('Phase 9 tests failed:', err);
  process.exit(1);
});
