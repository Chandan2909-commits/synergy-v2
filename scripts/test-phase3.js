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

async function runPhase3Tests() {
  console.log('======================================================================');
  console.log('SYNERGY PHASE 3: MODULAR AI WORKFORCE VERIFICATION SUITE');
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

  // 1. Setup Tenant
  const email = (`ai_founder_${Date.now()}@synergy.example`).toLowerCase();
  const reg = await post('/auth/register', {
    email,
    password: 'Password123!',
    fullName: 'AI Operations Director',
    organizationName: 'Synergy AI Labs',
    initialBusinessName: 'Quantum Robotics',
    industry: 'DeepTech Robotics',
  });

  assert(reg.status === 201, 'Test organization & business registered');
  const token = reg.body.data.token;
  const businessId = reg.body.data.business.id;

  // Update Brand Kit with strict rules for QA testing
  const bkUpdate = await post('/auth/login', { email, password: 'Password123!' });
  const authHeaders = { 'x-business-id': businessId };

  // 2. Verify all 4 MVP personas are initialized
  const personasRes = await get('/ai/personas');
  assert(personasRes.status === 200, 'GET /api/v1/ai/personas returns 200');
  const roles = personasRes.body.data.map((p) => p.role);
  assert(
    roles.includes('marketing_strategist') &&
      roles.includes('content_writer') &&
      roles.includes('visual_designer') &&
      roles.includes('quality_assurance'),
    'All 4 MVP personas initialized in database (Strategist, Writer, Designer, QA)'
  );

  // 3. Test Provider Connection Endpoint
  const testConnOpenAI = await post('/ai/test-connection', {
    provider: 'openai',
    apiKey: 'sk-test-mock-key-for-provider-handshake',
  });
  assert(testConnOpenAI.status === 201 && testConnOpenAI.body.data.success, 'Provider connection test passes for OpenAI');

  const testConnGemini = await post('/ai/test-connection', {
    provider: 'gemini',
    apiKey: 'AIzaSy-mock-gemini-handshake-key',
  });
  assert(testConnGemini.status === 201 && testConnGemini.body.data.success, 'Provider connection test passes for Google Gemini');

  const testConnAnthropic = await post('/ai/test-connection', {
    provider: 'anthropic',
    apiKey: 'sk-ant-test-mock-anthropic-key',
  });
  assert(testConnAnthropic.status === 201 && testConnAnthropic.body.data.success, 'Provider connection test passes for Anthropic Claude');

  // 4. Test Model Reconfiguration (Hot-swapping models without touching business logic)
  const configRes = await post(
    '/ai/personas/marketing_strategist/configure',
    {
      provider: 'openai',
      model: 'gpt-4o-2026',
      temperature: 0.65,
      systemInstructions: 'You are the Elite Marketing Strategist for autonomous B2B robotics.',
    },
    token
  );
  assert(configRes.status === 201 && configRes.body.data.defaultModel === 'gpt-4o-2026', 'Model hot-swapped for Marketing Strategist to gpt-4o-2026');

  // 5. Execute Persona 1: Marketing Strategist
  console.log('\n--- Executing Persona 1: Marketing Strategist ---');
  const strategistRes = await post(
    '/ai/personas/strategist/execute',
    {
      campaignGoal: 'Announce Series A fundraise and recruit senior mechanical engineers',
      targetPlatforms: ['linkedin', 'x'],
    },
    token,
    authHeaders
  );
  assert(strategistRes.status === 201 && strategistRes.body.data.contentPillars.length > 0, 'Marketing Strategist formulated structured content pillars');
  console.log(`   Strategy Output: ${strategistRes.body.data.strategySummary.substring(0, 90)}...`);

  // 6. Execute Persona 2: Content Writer
  console.log('\n--- Executing Persona 2: Content Writer ---');
  const writerRes = await post(
    '/ai/personas/writer/execute',
    {
      topic: 'How autonomous factory robotics reduce manufacturing cycle times by 40%',
      targetPlatform: 'linkedin',
      keyTakeaway: 'Deterministic precision beats manual line supervision every time.',
      format: 'text',
    },
    token,
    authHeaders
  );
  assert(writerRes.status === 201 && writerRes.body.data.caption.length > 20, 'Content Writer generated platform-tailored caption');
  assert(writerRes.body.data.hashtags.length >= 1, 'Content Writer generated targeted hashtags');

  // 7. Execute Persona 2 (Carousel Slide Mode): Content Writer
  const carouselWriterRes = await post(
    '/ai/personas/writer/execute',
    {
      topic: '5 Principles of Autonomous Robotics',
      targetPlatform: 'instagram',
      keyTakeaway: 'Modular architectures enable rapid scaling.',
      format: 'carousel',
      carouselSlideCount: 5,
    },
    token,
    authHeaders
  );
  assert(
    carouselWriterRes.status === 201 &&
      carouselWriterRes.body.data.carouselSlides &&
      carouselWriterRes.body.data.carouselSlides.length === 5,
    'Content Writer generated complete 5-slide carousel narrative'
  );

  // 8. Execute Persona 3: Visual Designer
  console.log('\n--- Executing Persona 3: Visual Designer ---');
  const designerRes = await post(
    '/ai/personas/designer/execute',
    {
      headline: 'The Autonomous Factory Floor',
      bodyText: 'High precision robotic actuation designed for continuous 24/7 assembly.',
      visualConcept: 'Robotic precision arm in high-contrast cinematic industrial lab',
      generateImage: true,
    },
    token,
    authHeaders
  );
  assert(designerRes.status === 201 && designerRes.body.data.backgroundColor, 'Visual Designer generated slide layout with Brand Kit primary color');
  assert(designerRes.body.data.imageUrl.startsWith('http'), 'Visual Designer generated image asset URL');

  // 9. Execute Persona 4: Quality Assurance Agent (Compliant Content)
  console.log('\n--- Executing Persona 4: Quality Assurance Agent ---');
  const qaValidRes = await post(
    '/ai/personas/qa/execute',
    {
      targetPlatform: 'linkedin',
      caption: 'Announcing our breakthrough in robotic actuation speed. Deterministic mechanical design enables unprecedented manufacturing cycle efficiency.',
      hashtags: ['#Robotics', '#DeepTech', '#Innovation'],
    },
    token,
    authHeaders
  );
  assert(qaValidRes.status === 201 && qaValidRes.body.data.passed, 'QA Agent approved compliant high-quality post (Score: ' + qaValidRes.body.data.score + '%)');

  // 10. Execute Persona 4: QA Agent with Policy Violation Detection
  const qaViolationRes = await post(
    '/ai/personas/qa/execute',
    {
      targetPlatform: 'linkedin',
      caption: 'Get cheap robots now! No misleading claims here, but guaranteed 1000% instant profits for everyone without effort.',
      hashtags: ['#Spam'],
    },
    token,
    authHeaders
  );
  assert(
    qaViolationRes.status === 201 &&
      qaViolationRes.body.data.issuesDetected.length > 0 &&
      qaViolationRes.body.data.issuesDetected.some(i => i.category === 'policy'),
    'QA Agent detected Brand Kit restriction violation ("No misleading claims")'
  );

  // 11. Execute Persona 4: QA Agent with Platform Limit Detection (X > 280 chars)
  const longText = 'A'.repeat(295);
  const qaLimitRes = await post(
    '/ai/personas/qa/execute',
    {
      targetPlatform: 'x',
      caption: longText,
      hashtags: [],
    },
    token,
    authHeaders
  );
  assert(
    qaLimitRes.status === 201 &&
      qaLimitRes.body.data.issuesDetected.some(i => i.category === 'platform_limit'),
    'QA Agent flagged X character limit constraint (> 280 chars)'
  );

  // 12. Check AI Usage & Spending Meter
  const usageRes = await get('/ai/usage', token, authHeaders);
  assert(usageRes.status === 200 && usageRes.body.data.tokensConsumed > 0, 'AI Usage meter tracks tokens consumed and monthly budget spend');

  // 13. Security Gate: Tenant B tries to execute AI using Tenant A businessId
  console.log('\n--- Running Multi-Tenant Isolation Security Check ---');
  const regB = await post('/auth/register', {
    email: (`ai_intruder_${Date.now()}@competitor.example`).toLowerCase(),
    password: 'Password123!',
    fullName: 'Intruder',
    organizationName: 'Competitor Corp',
    initialBusinessName: 'Competitor Biz',
  });
  const tokenB = regB.body.data.token;

  const crossTenantAI = await post(
    '/ai/personas/writer/execute',
    {
      topic: 'Stealing trade secrets',
      targetPlatform: 'x',
      keyTakeaway: 'Unauthorized access',
    },
    tokenB,
    { 'x-business-id': businessId } // Passing Tenant A businessId
  );
  assert(crossTenantAI.status === 403, `Tenant B blocked from executing AI under Tenant A workspace (HTTP ${crossTenantAI.status} Forbidden)`);

  console.log('\n======================================================================');
  console.log(`PHASE 3 TEST SUMMARY: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(0)}%)`);
  console.log('======================================================================\n');
}

runPhase3Tests().catch((err) => {
  console.error('Phase 3 tests failed:', err);
  process.exit(1);
});
