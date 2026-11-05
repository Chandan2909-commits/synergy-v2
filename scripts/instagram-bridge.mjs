#!/usr/bin/env node

/**
 * ============================================================================
 * SYNERGY LOCAL COMPANION BRIDGE
 * ============================================================================
 * Enables the hosted Synergy Web App (Vercel/Cloud) to securely trigger
 * desktop browser automation directly on the user's local machine.
 *
 * Benefits:
 * 1. 0% Datacenter IP Bans: All requests originate from your residential IP.
 * 2. 100% Privacy: Your Instagram session cookies never leave your laptop.
 * 3. Real Chrome GUI: Interactive 2FA and manual login handled natively.
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
} from './instagram-engine.mjs';

const PORT = process.env.BRIDGE_PORT ? parseInt(process.env.BRIDGE_PORT, 10) : 4545;
const HOST = '127.0.0.1';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

// Active login state tracker
let isLoginRunning = false;
let isPublishRunning = false;

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
      sendJson(res, 200, {
        success: true,
        online: true,
        bridgeVersion: '1.0.0',
        isLoginRunning,
        isPublishRunning,
        ...status,
      });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 2. POST /login - Launch Chrome for manual Instagram login & session capture
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

    // Run login asynchronously
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
  // 3. POST /publish - Run Playwright automated carousel publication
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
      // Safeguard against gigantic payloads (>50MB)
      if (rawBody.length > 50 * 1024 * 1024) {
        req.destroy();
      }
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
        console.log(`\n[Bridge Publish] 🚀 Received publish request for ${slides.length} slide(s)...`);

        // Check velocity
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

        // Save base64 slides to temp directory
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

        // Clean up temporary image files
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

  // Not found
  sendJson(res, 404, { success: false, error: 'Endpoint not found' });
});

// Start listener
server.listen(PORT, HOST, () => {
  ensureStorageDir();
  const velocity = checkVelocityStatus();

  console.log('======================================================================');
  console.log('  ⚡ SYNERGY LOCAL COMPANION BRIDGE v1.0');
  console.log('======================================================================');
  console.log(`  Bridge Endpoint:     http://${HOST}:${PORT}`);
  console.log('  Residential IP Mode: 🟢 ACTIVE (Zero Datacenter Shadowbans)');
  console.log(`  Instagram Session:   ${velocity.hasAuthSession ? '🟢 AUTHENTICATED (auth.json ready)' : '⚠️ NOT LOGGED IN (Needs Login)'}`);
  console.log(`  Anti-Flag Velocity:  ${velocity.postsCountToday} / ${velocity.maxDaily} posts used today`);
  console.log('----------------------------------------------------------------------');
  console.log('  Listening for dispatch triggers from your Synergy Web Studio...');
  console.log('  Keep this terminal open while publishing from your browser.');
  console.log('======================================================================\n');
});
