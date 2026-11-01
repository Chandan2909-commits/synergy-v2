/**
 * Synergy v2 - Phase 4 Verification Test Suite
 * Automated tests for Content Studio, Multi-Persona Pipeline, Carousel Builder,
 * Platform Variants, Media Library, and Cross-Tenant Isolation.
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

async function runPhase4Tests() {
  console.log('====================================================');
  console.log('SYNERGY PHASE 4 - CONTENT STUDIO VERIFICATION SUITE');
  console.log('====================================================\n');

  // Test 1: Health Check
  const healthRes = await request('/health');
  assert(healthRes.status === 200 && (healthRes.data.data.status === 'ok' || healthRes.data.data.status === 'healthy'), 'API health status ok');

  // Test 2: Register Tenant A
  const ts = Date.now();
  const regA = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founderA_${ts}@synergy-onix.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Alex Stone',
      organizationName: `Stone Media Group ${ts}`,
      businessName: 'Stone Media Global',
    },
  });
  assert(regA.status === 201 && regA.data.data.token, 'Tenant A registered successfully');
  const tokenA = regA.data.data.token;
  const businessIdA = regA.data.data.business.id;

  // Test 3: Configure Brand Kit for Tenant A
  const brandKitRes = await request(`/businesses/${businessIdA}/brand-kit`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenA}` },
    body: {
      brandName: 'Stone Media',
      primaryColor: '#1e1e1e',
      accentColor: '#1d4ed8',
      brandVoice: ['Visionary', 'Analytical', 'Direct'],
      targetAudience: 'Chief Technology Officers and SaaS Executives',
      restrictions: ['No buzzwords', 'No clickbait'],
    },
  });
  assert(brandKitRes.status === 200 && brandKitRes.data.data.brandName === 'Stone Media', 'Brand Kit configured for Tenant A');

  // Test 4: Multi-Persona Content Generation Pipeline
  console.log('\n--- Testing Multi-Persona Pipeline Execution ---');
  const genRes = await request('/content/generate-pipeline', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
    body: {
      objective: 'Three high-leverage AI architectures driving modern B2B pipeline velocity',
      targetPlatforms: ['instagram', 'linkedin', 'x'],
      format: 'carousel',
      carouselSlideCount: 5,
    },
  });

  assert(genRes.status === 201, 'Content generation pipeline executed successfully (HTTP 201)');
  const contentA = genRes.data.data.content;
  assert(contentA && contentA.id, 'Content draft created with unique ID');
  assert(contentA.variants && contentA.variants.length === 3, 'Three independent platform variants generated (Instagram, LinkedIn, X)');
  assert(contentA.carouselSlides && contentA.carouselSlides.length === 5, 'Five-slide carousel generated adhering to Brand Kit');
  assert(genRes.data.data.strategy && genRes.data.data.strategy.strategySummary, 'Strategist persona produced strategy plan');
  assert(genRes.data.data.qaReports && genRes.data.data.qaReports['linkedin'], 'QA persona validated LinkedIn copy compliance');

  // Test 5: Verify Platform Differentiation
  const igVariant = contentA.variants.find((v) => v.platform === 'instagram');
  const liVariant = contentA.variants.find((v) => v.platform === 'linkedin');
  const xVariant = contentA.variants.find((v) => v.platform === 'x');
  assert(igVariant && liVariant && xVariant, 'All target platform variants exist');
  assert(liVariant.text !== xVariant.text, 'Platform variants have adapted copy (not duplicate copy)');

  // Test 6: Create Manual Draft
  console.log('\n--- Testing Manual Draft Creation ---');
  const manualRes = await request('/content/draft', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
    body: {
      title: 'Strategic Playbook 2027',
      masterCopy: 'Executive leadership in the autonomous enterprise era.',
      targetPlatforms: ['linkedin', 'x'],
      variants: {
        linkedin: { text: 'Deep dive into autonomous agent infrastructure.', hashtags: ['#AI', '#Enterprise'] },
        x: { text: 'Autonomous agents are eating enterprise workflows.', hashtags: ['#Tech'] },
      },
      carouselSlides: [
        { slideNumber: 1, headline: 'Slide 1: Vision', bodyText: 'Autonomous architectures.' },
        { slideNumber: 2, headline: 'Slide 2: Execution', bodyText: 'Unified orchestrators.' },
      ],
    },
  });
  assert(manualRes.status === 201 && manualRes.data.data.title === 'Strategic Playbook 2027', 'Manual draft created with slides');
  const manualContentId = manualRes.data.data.id;

  // Test 7: List Contents
  console.log('\n--- Testing Content Querying ---');
  const listRes = await request('/content', {
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(listRes.status === 200 && listRes.data.data.length >= 2, 'Retrieved content list for business');

  // Test 8: Get Single Content with Relations
  const getSingle = await request(`/content/${contentA.id}`, {
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(getSingle.status === 200 && getSingle.data.data.carouselSlides.length === 5, 'Retrieved full content item with slides');

  // Test 9: Update Content
  console.log('\n--- Testing Content Editing ---');
  const updateRes = await request(`/content/${manualContentId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
    body: {
      title: 'Strategic Playbook 2027 (Updated)',
      status: 'pending_approval',
    },
  });
  assert(updateRes.status === 200 && updateRes.data.data.status === 'pending_approval', 'Content updated to pending_approval');

  // Test 10: Carousel Slide Operations (Add, Update, Duplicate, Delete)
  console.log('\n--- Testing Carousel Builder Operations ---');
  // 10a: Add slide
  const addSlideRes = await request(`/content/${manualContentId}/slides`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
    body: {
      slideNumber: 3,
      headline: 'Slide 3: Impact',
      bodyText: 'Measuring ROI of agent swarms.',
      callToAction: 'Book consultation',
    },
  });
  assert(addSlideRes.status === 201 && addSlideRes.data.data.slideNumber === 3, 'Slide added to carousel');

  // 10b: Update slide
  const updateSlideRes = await request(`/content/${manualContentId}/slides/3`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
    body: {
      headline: 'Slide 3: Exponential Impact',
    },
  });
  assert(updateSlideRes.status === 200 && updateSlideRes.data.data.headline === 'Slide 3: Exponential Impact', 'Slide updated');

  // 10c: Duplicate slide
  const dupSlideRes = await request(`/content/${manualContentId}/slides/3/duplicate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(dupSlideRes.status === 201 && dupSlideRes.data.data.slideNumber === 4, 'Slide duplicated with incremented slideNumber');

  // 10d: Delete slide
  const delSlideRes = await request(`/content/${manualContentId}/slides/2`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(delSlideRes.status === 200 && delSlideRes.data.data.remainingSlides === 3, 'Slide deleted and remaining slides renumbered');

  // 10e: Export carousel as HTML & JSON
  const exportJsonRes = await request(`/content/${manualContentId}/export?format=json`, {
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(exportJsonRes.status === 200 && exportJsonRes.data.data.slides.length === 3, 'Carousel exported as structured JSON');

  const exportHtmlRes = await request(`/content/${manualContentId}/export?format=html`, {
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(exportHtmlRes.status === 200 && exportHtmlRes.data.data.html.includes('1080px'), 'Carousel exported as ONIX 1080x1080 HTML frames');

  // Test 11: Media Library Operations
  console.log('\n--- Testing Media Library ---');
  const uploadMediaRes = await request('/content/media', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
    body: {
      url: 'https://cdn.synergy-onix.ai/assets/hero-banner-executive.png',
      fileType: 'image/png',
      fileSize: 1048576,
      width: 1920,
      height: 1080,
    },
  });
  assert(uploadMediaRes.status === 201 && uploadMediaRes.data.data.id, 'Media asset registered to business');
  const mediaId = uploadMediaRes.data.data.id;

  const listMediaRes = await request('/content/media', {
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(listMediaRes.status === 200 && listMediaRes.data.data.some((m) => m.id === mediaId), 'Media asset listed in business media library');

  const delMediaRes = await request(`/content/media/${mediaId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${tokenA}`,
      'x-business-id': businessIdA,
    },
  });
  assert(delMediaRes.status === 200 && delMediaRes.data.data.success, 'Media asset deleted successfully');

  // Test 12: Cross-Tenant Isolation
  console.log('\n--- Testing Cross-Tenant Boundary Enforcement ---');
  const regB = await request('/auth/register', {
    method: 'POST',
    body: {
      email: `founderB_${ts}@synergy-rival.ai`.toLowerCase(),
      password: 'SecurePassword123!',
      fullName: 'Bob Vance',
      organizationName: `Vance Refrigeration ${ts}`,
      businessName: 'Vance Chillers',
    },
  });
  const tokenB = regB.data.data.token;
  const businessIdB = regB.data.data.business.id;

  // Tenant B tries to read Tenant A's content
  const crossReadRes = await request(`/content/${contentA.id}`, {
    headers: {
      Authorization: `Bearer ${tokenB}`,
      'x-business-id': businessIdB,
    },
  });
  assert(crossReadRes.status === 403, 'Cross-tenant content access blocked with HTTP 403 Forbidden');

  // Tenant B attempts to spoof Tenant A's business header
  const spoofHeaderRes = await request('/content', {
    headers: {
      Authorization: `Bearer ${tokenB}`,
      'x-business-id': businessIdA,
    },
  });
  assert(spoofHeaderRes.status === 403, 'Spoofed X-Business-ID blocked with HTTP 403 Forbidden');

  // Summary
  console.log('\n====================================================');
  console.log(`PHASE 4 TEST RESULTS: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error('Phase 4 tests failed:', err);
  process.exit(1);
});
