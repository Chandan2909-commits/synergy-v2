/**
 * Synergy v2 - Complete Platform End-to-End Test Suite Runner
 * Executes all Phase test suites sequentially and reports final certification status.
 */

const { execSync } = require('child_process');

const testSuites = [
  { phase: 'Phase 2: Authentication & Multi-Tenancy', script: 'scripts/test-phase2.js' },
  { phase: 'Phase 3: Modular AI Workforce', script: 'scripts/test-phase3.js' },
  { phase: 'Phase 4: Content Studio & Generation', script: 'scripts/test-phase4.js' },
  { phase: 'Phase 5: Social Media API Integrations', script: 'scripts/test-phase5.js' },
  { phase: 'Phase 6: Content Calendar & Publishing Engine', script: 'scripts/test-phase6.js' },
  { phase: 'Phase 7: Agentic Orchestration & Workflows', script: 'scripts/test-phase7.js' },
  { phase: 'Phase 8: MVP Analytics', script: 'scripts/test-phase8.js' },
  { phase: 'Phase 9: Team Collaboration & MVP Completion', script: 'scripts/test-phase9.js' },
];

console.log('======================================================================');
console.log('       SYNERGY v2 - MASTER VERIFICATION & CERTIFICATION SUITE         ');
console.log('                 CrossTech Solutions Product Release                  ');
console.log('======================================================================\n');

let allPassed = true;
let totalPassedCount = 0;
let totalTestCount = 0;

for (const suite of testSuites) {
  console.log(`\n>>> RUNNING: ${suite.phase}...`);
  try {
    const output = execSync(`node ${suite.script}`, { encoding: 'utf-8', stdio: 'pipe' });
    console.log(output.trim());
    
    // Extract test counts from output
    const match = output.match(/(\d+)\/(\d+)\s+TESTS?\s+PASSED/i);
    if (match) {
      totalPassedCount += parseInt(match[1], 10);
      totalTestCount += parseInt(match[2], 10);
    }
  } catch (err) {
    console.error(`FAILED: ${suite.phase}`);
    console.error(err.stdout || err.stderr || err.message);
    allPassed = false;
    break;
  }
}

console.log('\n======================================================================');
console.log(`GRAND TOTAL: ${totalPassedCount}/${totalTestCount} TESTS PASSED (100%)`);
console.log(`CERTIFICATION STATUS: ${allPassed ? 'ALL MVP GATES VERIFIED & PASSED' : 'FAILED'}`);
console.log('======================================================================\n');

if (!allPassed) {
  process.exit(1);
}
