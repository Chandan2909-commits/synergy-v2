#!/usr/bin/env node

/**
 * ============================================================================
 * SYNERGY LOCAL COMPANION BRIDGE & SCHEDULER
 * ============================================================================
 * Enables the hosted Synergy Web App (Vercel/Cloud) to securely trigger
 * desktop browser automation directly on the user's local machine, both
 * immediately and on scheduled calendar timestamps.
 *
 * Benefits:
 * 1. 0% Datacenter IP Bans: All requests originate from your residential IP.
 * 2. 100% Privacy: Your Instagram session cookies never leave your laptop.
 * 3. Real Chrome GUI: Interactive 2FA and manual login handled natively.
 * 4. Precision Scheduler: Executes due posts automatically at exact moments.
 * ============================================================================
 */

import http from 'http';
import path from 'path';
import fs from 'fs';
import {
  checkVelocityStatus,
  publishToInstagram,
  recordInstagramLogin,
  ensureStorageDir,
  getScheduledPosts,
  saveScheduledPosts,
  addScheduledPost,
  updateScheduledPost,
  removeScheduledPost,
} from './instagram-engine.mjs';

const PORT = process.env.BRIDGE_PORT ? parseInt(process.env.BRIDGE_PORT, 10) : 4545;
const HOST = '127.0.0.1';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...CORS_HEADERS,
  });
  res.end(JSON.stringify(data));
}

// Active execution state tracker
let isLoginRunning = false;
let isPublishRunning = false;

// ============================================================================
// AUTOMATED SCHEDULER WORKER (Checks due posts and publishes one-by-one)
// ============================================================================

async function processScheduledQueue() {
  if (isPublishRunning || isLoginRunning) return; // Strict one-by-one execution

  const queue = getScheduledPosts();
  const now = Date.now();

  // Find posts that are due and not yet executed
  const duePosts = queue
    .filter((p) => p.status === 'scheduled' && new Date(p.scheduledFor).getTime() <= now)
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

  if (duePosts.length === 0) return;

  // Pick the earliest due post (process one-by-one)
  const job = duePosts[0];
  isPublishRunning = true;
  job.status = 'publishing';
  saveScheduledPosts(queue);

  console.log('\n======================================================================');
  console.log(`  ⏰ [SCHEDULED DISPATCH] Triggering post: "${job.title}"`);
  console.log(`  Scheduled Time:   ${job.scheduledFor}`);
  console.log(`  Slide Count:      ${job.slidePaths?.length || job.slides?.length || 1}`);
  console.log(`  Executing via:    Desktop Chrome with Stealth & Human Delays`);
  console.log('======================================================================');

  try {
    // Ensure slides exist on disk
    let paths = job.slidePaths || [];
    if (!paths.length || !fs.existsSync(paths[0])) {
      const tempDir = path.resolve(process.cwd(), 'storage', 'instagram', 'scheduled', job.id);
      fs.mkdirSync(tempDir, { recursive: true });
      paths = [];
      (job.slides || []).forEach((dataUrl, idx) => {
        const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const fp = path.join(tempDir, `slide_${idx + 1}.png`);
        fs.writeFileSync(fp, buffer);
        paths.push(fp);
      });
      job.slidePaths = paths;
    }

    const result = await publishToInstagram({
      imagePaths: paths,
      caption: job.caption,
      headless: false,
      stealthMode: true,
      onProgress: (msg) => console.log(`[Scheduled Worker ${job.id}] ${msg}`),
    });

    job.status = 'published';
    job.publishedAt = new Date().toISOString();
    job.result = result;
    saveScheduledPosts(queue);
    console.log(`[Scheduler] 🎉 Post "${job.title}" published successfully to Instagram!\n`);
  } catch (err) {
    job.status = 'failed';
    job.error = err.message;
    saveScheduledPosts(queue);
    console.error(`[Scheduler] ❌ Post "${job.title}" failed:`, err.message, '\n');
  } finally {
    isPublishRunning = false;
  }
}

// Background scheduler tick: every 10 seconds
setInterval(processScheduledQueue, 10000);

// ============================================================================
// HTTP API ROUTER
// ============================================================================

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
  const pathname = url.pathname;

  // --------------------------------------------------------------------------
  // 1. GET /status or GET /health
  // --------------------------------------------------------------------------
  if (req.method === 'GET' && (pathname === '/status' || pathname === '/health' || pathname === '/')) {
    try {
      const status = checkVelocityStatus();
      const scheduledPosts = getScheduledPosts();
      sendJson(res, 200, {
        success: true,
        online: true,
        bridgeVersion: '1.2.0',
        isLoginRunning,
        isPublishRunning,
        scheduledCount: scheduledPosts.filter((p) => p.status === 'scheduled').length,
        ...status,
      });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 2. GET /schedule - List all scheduled posts
  // --------------------------------------------------------------------------
  if (req.method === 'GET' && pathname === '/schedule') {
    try {
      const posts = getScheduledPosts();
      sendJson(res, 200, { success: true, posts });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 3. POST /schedule - Create or queue a scheduled post
  // --------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/schedule') {
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 50 * 1024 * 1024) req.destroy();
    });

    req.on('end', () => {
      try {
        const body = JSON.parse(rawBody || '{}');
        const { id, title, slides = [], caption = '', scheduledFor, platforms = ['instagram'] } = body;

        if (!slides || slides.length === 0) {
          sendJson(res, 400, { success: false, error: 'At least one slide image is required.' });
          return;
        }

        if (!scheduledFor) {
          sendJson(res, 400, { success: false, error: 'Scheduled date and time is required.' });
          return;
        }

        const postId = id || `sched-ig-${Date.now()}`;
        const tempDir = path.resolve(process.cwd(), 'storage', 'instagram', 'scheduled', postId);
        fs.mkdirSync(tempDir, { recursive: true });

        const slidePaths = [];
        slides.forEach((dataUrl, idx) => {
          const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const fp = path.join(tempDir, `slide_${idx + 1}.png`);
          fs.writeFileSync(fp, buffer);
          slidePaths.push(fp);
        });

        const newPost = {
          id: postId,
          title: title || 'Scheduled Multi-Slide Carousel',
          slides,
          slidePaths,
          caption,
          scheduledFor,
          status: 'scheduled',
          platform: 'instagram',
          platforms,
          createdAt: new Date().toISOString(),
        };

        addScheduledPost(newPost);
        console.log(`[Bridge Schedule] 📅 Queued post "${newPost.title}" for ${scheduledFor}`);

        sendJson(res, 200, {
          success: true,
          post: newPost,
          message: `Post scheduled for ${new Date(scheduledFor).toLocaleString()}!`,
        });
      } catch (err) {
        sendJson(res, 400, { success: false, error: err.message });
      }
    });
    return;
  }

  // --------------------------------------------------------------------------
  // 4. DELETE /schedule - Cancel or delete a scheduled post
  // --------------------------------------------------------------------------
  if (req.method === 'DELETE' && pathname === '/schedule') {
    const id = url.searchParams.get('id');
    if (!id) {
      sendJson(res, 400, { success: false, error: 'Post ID is required' });
      return;
    }
    removeScheduledPost(id);
    console.log(`[Bridge Schedule] 🗑️ Removed scheduled post ${id}`);
    sendJson(res, 200, { success: true, message: `Scheduled post ${id} removed.` });
    return;
  }

  // --------------------------------------------------------------------------
  // 5. POST /login - Launch Chrome for manual Instagram login & session capture
  // --------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/login') {
    if (isLoginRunning) {
      sendJson(res, 409, {
        success: false,
        error: 'A login window is already open. Please complete login or close Chrome.',
      });
      return;
    }

    isLoginRunning = true;
    console.log('\n[Bridge] 🌐 Starting Instagram login session recorder...');

    recordInstagramLogin((msg) => {
      console.log(`[Bridge Login] ${msg}`);
    })
      .then((result) => {
        console.log('[Bridge Login] ✅ Session saved successfully to storage/instagram/auth.json');
        isLoginRunning = false;
      })
      .catch((err) => {
        console.error('[Bridge Login] ❌ Login error:', err.message);
        isLoginRunning = false;
      });

    sendJson(res, 200, {
      success: true,
      message: 'Launched Chrome window on desktop. Please log in manually and complete 2FA.',
    });
    return;
  }

  // --------------------------------------------------------------------------
  // 6. POST /publish - Run Immediate Playwright automated carousel publication
  // --------------------------------------------------------------------------
  if (req.method === 'POST' && pathname === '/publish') {
    if (isPublishRunning) {
      sendJson(res, 409, {
        success: false,
        error: 'An Instagram publish job is currently running. Please wait for it to finish.',
      });
      return;
    }

    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 50 * 1024 * 1024) req.destroy();
    });

    req.on('end', async () => {
      try {
        const body = JSON.parse(rawBody || '{}');
        const { slides = [], caption = '', headless = false, force = false, stealthMode = true } = body;

        if (!slides || slides.length === 0) {
          sendJson(res, 400, { success: false, error: 'At least one slide image is required.' });
          return;
        }

        isPublishRunning = true;
        console.log(`\n[Bridge Publish] 🚀 Received immediate publish request for ${slides.length} slide(s)...`);

        const velocity = checkVelocityStatus();
        if (!velocity.hasAuthSession) {
          isPublishRunning = false;
          sendJson(res, 400, {
            success: false,
            error: 'No saved Instagram session found. Please click "Log In / Refresh" to capture session first.',
          });
          return;
        }

        if (!velocity.canPost && !force) {
          isPublishRunning = false;
          sendJson(res, 400, {
            success: false,
            error: `Velocity cap reached (${velocity.postsCountToday}/${velocity.maxDaily} posts today). Enable "Force Publish" to override.`,
          });
          return;
        }

        const tempDir = path.resolve(process.cwd(), '.temp-instagram-uploads', `bridge-post-${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });

        const imagePaths = [];
        slides.forEach((dataUrl, idx) => {
          const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          const filePath = path.join(tempDir, `slide_${idx + 1}.png`);
          fs.writeFileSync(filePath, buffer);
          imagePaths.push(filePath);
        });

        const logs = [];
        const handleProgress = (msg) => {
          logs.push(msg);
          console.log(`[Bridge Runner] ${msg}`);
        };

        const result = await publishToInstagram({
          imagePaths,
          caption: caption || 'Automated multi-slide carousel via Synergy AI Engine! #marketing #synergy',
          headless: Boolean(headless),
          force: Boolean(force),
          stealthMode: Boolean(stealthMode),
          onProgress: handleProgress,
        });

        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch {}

        isPublishRunning = false;
        console.log('[Bridge Publish] 🎉 Publish job completed successfully!');

        sendJson(res, 200, {
          success: true,
          result,
          logs,
          message: 'Post successfully published to Instagram via Local Companion Bridge!',
        });
      } catch (err) {
        isPublishRunning = false;
        console.error('[Bridge Publish] ❌ Failed to publish:', err.message);
        sendJson(res, 400, {
          success: false,
          error: err.message || 'An error occurred during local Instagram publishing.',
        });
      }
    });
    return;
  }

  // 404
  sendJson(res, 404, { success: false, error: 'Endpoint not found' });
});

// Start listener
server.listen(PORT, HOST, () => {
  ensureStorageDir();
  const velocity = checkVelocityStatus();
  const scheduled = getScheduledPosts().filter((p) => p.status === 'scheduled');

  console.log('======================================================================');
  console.log('  ⚡ SYNERGY LOCAL COMPANION BRIDGE & SCHEDULER v1.2');
  console.log('======================================================================');
  console.log(`  Bridge Endpoint:     http://${HOST}:${PORT}`);
  console.log('  Residential IP Mode: 🟢 ACTIVE (Zero Datacenter Shadowbans)');
  console.log(`  Instagram Session:   ${velocity.hasAuthSession ? '🟢 AUTHENTICATED (auth.json ready)' : '⚠️ NOT LOGGED IN (Needs Login)'}`);
  console.log(`  Anti-Flag Velocity:  ${velocity.postsCountToday} / ${velocity.maxDaily} posts used today`);
  console.log(`  Scheduled Queue:     ${scheduled.length} post(s) queued in calendar`);
  console.log('----------------------------------------------------------------------');
  console.log('  Listening for dispatch triggers & running automated schedule queue...');
  console.log('  Keep this terminal open while publishing from your browser.');
  console.log('======================================================================\n');
});
