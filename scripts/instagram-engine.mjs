import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

// Default Storage Locations
const STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'instagram');
const AUTH_FILE = path.join(STORAGE_DIR, 'auth.json');
const LOG_FILE = path.join(STORAGE_DIR, 'velocity-log.json');

// Ensure directory exists
export function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

// Random delay helper
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ==============================================================================
// 1. SAFETY & VELOCITY RATE LIMITING (Prevents Account Shadowbans/Flags)
// ==============================================================================

export function getVelocityLog() {
  ensureStorageDir();
  if (!fs.existsSync(LOG_FILE)) {
    return { dailyLimit: 2, posts: [] };
  }
  try {
    const raw = fs.readFileSync(LOG_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { dailyLimit: 2, posts: [] };
  }
}

export function checkVelocityStatus() {
  const log = getVelocityLog();
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // Posts in current calendar day
  const postsToday = log.posts.filter((p) => new Date(p.timestamp).getTime() >= startOfDay);
  const postsCount = postsToday.length;
  const maxDaily = log.dailyLimit || 2;
  const canPost = postsCount < maxDaily;

  // Last post timestamp
  const lastPost = log.posts.length > 0 ? log.posts[log.posts.length - 1] : null;
  const lastPostAt = lastPost ? lastPost.timestamp : null;

  return {
    postsCountToday: postsCount,
    maxDaily,
    canPost,
    lastPostAt,
    hasAuthSession: fs.existsSync(AUTH_FILE),
  };
}

export function recordPostSuccess(details = {}) {
  ensureStorageDir();
  const log = getVelocityLog();
  const record = {
    id: `ig-post-${Date.now()}`,
    timestamp: new Date().toISOString(),
    slideCount: details.slideCount || 1,
    captionSnippet: (details.caption || '').slice(0, 60),
  };
  log.posts.push(record);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf8');
  return record;
}

// ==============================================================================
// 2. INTERACTIVE LOGIN / SESSION RECORDER
// ==============================================================================

export async function recordInstagramLogin(onStatus = console.log) {
  ensureStorageDir();
  onStatus('🚀 Launching Chrome to capture your Instagram session...');

  const browser = await chromium.launch({
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1280,900',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  onStatus('🌐 Navigating to Instagram. Log in manually, complete 2FA, and dismiss any security prompts.');
  await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });

  // Poll for successful login
  let loggedIn = false;
  const maxWaitMs = 180000; // 3 minutes
  const startTime = Date.now();

  while (!loggedIn && Date.now() - startTime < maxWaitMs) {
    await sleep(2000);

    const url = page.url();
    // Check if on home feed or profile, and not on login page
    const isLoginUrl = url.includes('/accounts/login') || url.includes('/accounts/emailsignup');
    const hasNavElement = await page
      .locator('svg[aria-label="New post"], svg[aria-label="Create"], svg[aria-label="Home"], svg[aria-label="Direct"]')
      .first()
      .isVisible()
      .catch(() => false);

    if (!isLoginUrl && hasNavElement) {
      loggedIn = true;
      break;
    }

    // Auto-dismiss "Save info" modal if it appears
    try {
      const saveInfoBtn = page.getByRole('button', { name: /Save info|Not now/i }).first();
      if (await saveInfoBtn.isVisible().catch(() => false)) {
        await saveInfoBtn.click().catch(() => {});
      }
    } catch {}

    // Auto-dismiss "Turn on Notifications" modal if it appears
    try {
      const notNowBtn = page.getByRole('button', { name: /Not Now/i }).first();
      if (await notNowBtn.isVisible().catch(() => false)) {
        await notNowBtn.click().catch(() => {});
      }
    } catch {}
  }

  if (!loggedIn) {
    await browser.close();
    throw new Error('Login timed out or was not completed within 3 minutes.');
  }

  onStatus('⏳ Allowing session cookies and storage tokens to settle (5s)...');
  await sleep(5000);

  // Save session state to disk
  await context.storageState({ path: AUTH_FILE });
  onStatus(`✅ Session state successfully saved to ${AUTH_FILE}`);

  await browser.close();
  return { success: true, authPath: AUTH_FILE };
}

// ==============================================================================
// 3. BULLETPROOF AUTOMATED POSTING ENGINE
// ==============================================================================

export async function publishToInstagram({
  imagePaths = [],
  caption = '',
  headless = false,
  force = false,
  stealthMode = true,
  onProgress = console.log,
} = {}) {
  ensureStorageDir();

  if (!fs.existsSync(AUTH_FILE)) {
    throw new Error(
      `No active Instagram session found at ${AUTH_FILE}. Please log in first using the "Login to Instagram" button.`
    );
  }

  if (!imagePaths || imagePaths.length === 0) {
    throw new Error('At least one image path is required for publishing.');
  }

  // Velocity Check
  const velocity = checkVelocityStatus();
  if (!velocity.canPost && !force) {
    throw new Error(
      `Safety Velocity Guard: You have already posted ${velocity.postsCountToday} of ${velocity.maxDaily} allowed posts today. Posting more risks an algorithmic velocity flag. Check "Force Publish" to override.`
    );
  }

  onProgress(`[1/6] 🛡️ Initializing browser environment (Stealth: ${stealthMode ? 'ON' : 'OFF'}, Headless: ${headless})...`);

  const browser = await chromium.launch({
    headless,
    slowMo: stealthMode ? randomBetween(50, 100) : 20,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-size=1280,900',
    ],
  });

  const context = await browser.newContext({
    storageState: AUTH_FILE,
    viewport: { width: 1280, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'en-US',
  });

  // Mask Automation Heuristics
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const page = await context.newPage();

  try {
    onProgress('[2/6] 🌐 Navigating to Instagram with authenticated session...');
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
    await sleep(stealthMode ? randomBetween(3000, 5000) : 1500);

    // Verify session is active
    if (page.url().includes('/accounts/login')) {
      throw new Error('Instagram session has expired or been invalidated. Please log in again.');
    }

    // Dismiss any modal prompts
    try {
      const notNowBtn = page.getByRole('button', { name: /Not Now/i }).first();
      if (await notNowBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await notNowBtn.click();
        await sleep(1000);
      }
    } catch {}

    onProgress(`[3/6] 📁 Opening Create dialog and uploading ${imagePaths.length} slide(s)...`);

    // Locate Create Button
    const createBtn = page.locator(
      'svg[aria-label="New post"], svg[aria-label="Create"], [aria-label="New post"], [aria-label="Create"], a[href="#"]:has-text("Create")'
    ).first();

    await createBtn.waitFor({ state: 'visible', timeout: 15000 });
    await createBtn.click();
    await sleep(stealthMode ? randomBetween(1500, 2500) : 1000);

    // File Chooser
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 15000 }),
      page.getByRole('button', { name: /Select from computer/i }).first().click(),
    ]);

    // Upload files (single or array of files for carousel)
    await fileChooser.setFiles(imagePaths);
    onProgress(`[3/6] Files transferred to Instagram: ${imagePaths.length} image(s). Waiting for render...`);
    await sleep(stealthMode ? randomBetween(3500, 6000) : 2000);

    // Check for "Next" button in Crop screen
    onProgress('[4/6] 📐 Navigating Crop settings (Next)...');
    const nextBtn = page.getByRole('button', { name: /^Next$/i }).first();
    await nextBtn.waitFor({ state: 'visible', timeout: 15000 });
    await nextBtn.click();
    await sleep(stealthMode ? randomBetween(2000, 3500) : 1000);

    // Check for "Next" button in Filters / Edit screen
    onProgress('[4/6] 🎨 Navigating Filters & Effects (Next)...');
    const nextBtn2 = page.getByRole('button', { name: /^Next$/i }).first();
    await nextBtn2.waitFor({ state: 'visible', timeout: 15000 });
    await nextBtn2.click();
    await sleep(stealthMode ? randomBetween(2000, 3000) : 1000);

    // Write Caption
    onProgress('[5/6] ✍️ Simulating human typing for caption and hashtags...');
    const captionField = page.locator('div[aria-label="Write a caption..."], [contenteditable="true"]').first();
    await captionField.waitFor({ state: 'visible', timeout: 15000 });
    await captionField.click();
    await sleep(randomBetween(500, 1000));

    if (stealthMode) {
      // Human-like typing with variable delay and pauses
      for (const char of caption) {
        await page.keyboard.type(char, { delay: randomBetween(30, 85) });
        if (char === '.' || char === '\n' || char === '#') {
          await sleep(randomBetween(150, 300));
        }
      }
    } else {
      await captionField.fill(caption);
    }

    await sleep(stealthMode ? randomBetween(2500, 4500) : 1000);

    // Click Share
    onProgress('[6/6] 🚀 Submitting post to Instagram (Clicking Share)...');
    const shareBtn = page.getByRole('button', { name: /^Share$/i }).first();
    await shareBtn.waitFor({ state: 'visible', timeout: 10000 });
    await shareBtn.click();

    // Wait for Confirmation
    onProgress('[6/6] ⏳ Awaiting confirmation ("Your post has been shared")...');
    await page.getByText(/Your post has been shared/i).waitFor({ timeout: 90000 });

    onProgress('🎉 Post published successfully to Instagram!');
    await sleep(3000);

    // Record in velocity log
    const record = recordPostSuccess({
      slideCount: imagePaths.length,
      caption,
    });

    await browser.close();
    return {
      success: true,
      record,
      message: 'Post successfully published to Instagram via Playwright automation!',
    };
  } catch (err) {
    try {
      await browser.close();
    } catch {}
    throw err;
  }
}
