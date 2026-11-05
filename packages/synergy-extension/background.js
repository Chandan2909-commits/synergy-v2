/**
 * ============================================================================
 * SYNERGY SOCIAL ASSISTANT - BACKGROUND SERVICE WORKER (v1.1.1)
 * Manages floating popup windows, cookies, alarms, and exact-moment execution.
 * ============================================================================
 */

let activeSenderTabId = null;
let activePopupWindowId = null;
let activeInstagramTabId = null;
let isPostingRunning = false;
let currentRunningPostId = null;
let postWatchdogTimer = null;

// ============================================================================
// WINDOW LIFECYCLE WATCHER: Clean up lock if popup window is closed
// ============================================================================

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === activePopupWindowId) {
    console.log('[Background] Instagram popup window closed.');
    activePopupWindowId = null;
    activeInstagramTabId = null;
    isPostingRunning = false;
    currentRunningPostId = null;
    if (postWatchdogTimer) {
      clearTimeout(postWatchdogTimer);
      postWatchdogTimer = null;
    }
  }
});

// ============================================================================
// CORE EXECUTION ENGINE: Launch Dedicated Popup & Post to Instagram
// ============================================================================

function executeInstagramPost(payload, onDone) {
  // If this exact post is already running, avoid duplicate triggers
  if (isPostingRunning) {
    if (payload.id && payload.id === currentRunningPostId) {
      notifySynergyTab(`[Running] Post "${payload.title || 'Carousel'}" is already in progress...`);
      if (onDone) onDone(true, null);
      return;
    }
    // If a different post is running, let the queue wait
    console.log('[Background] Another post is currently running. Queue will process this next cycle.');
    if (onDone) onDone(false, 'BUSY');
    return;
  }

  isPostingRunning = true;
  currentRunningPostId = payload.id || null;

  // 3-Minute Watchdog Timer to prevent lock from getting stuck indefinitely
  if (postWatchdogTimer) clearTimeout(postWatchdogTimer);
  postWatchdogTimer = setTimeout(() => {
    if (isPostingRunning) {
      console.warn('[Background] Watchdog: Post execution exceeded 3 minutes. Releasing lock.');
      isPostingRunning = false;
      currentRunningPostId = null;
      if (activePopupWindowId) {
        try {
          chrome.windows.remove(activePopupWindowId);
        } catch {}
        activePopupWindowId = null;
      }
    }
  }, 180000);

  notifySynergyTab(`[1/5] 🧩 Synergy Social Assistant initialized: "${payload.title || 'Carousel'}"...`);

  // Open Instagram in a dedicated FLOATING POPUP WINDOW (never a tab in the same window)
  chrome.windows.create(
    {
      url: 'https://www.instagram.com/',
      type: 'popup',
      width: 1100,
      height: 850,
      focused: true,
      populate: true,
    },
    (newWindow) => {
      if (!newWindow) {
        isPostingRunning = false;
        currentRunningPostId = null;
        if (onDone) onDone(false, 'Failed to launch popup window');
        return;
      }

      activePopupWindowId = newWindow.id;

      // Ensure valid tab ID resolution
      chrome.tabs.query({ windowId: newWindow.id }, (tabs) => {
        const tabId =
          tabs && tabs.length > 0
            ? tabs[0].id
            : newWindow.tabs && newWindow.tabs.length > 0
            ? newWindow.tabs[0].id
            : null;

        if (!tabId) {
          isPostingRunning = false;
          currentRunningPostId = null;
          if (onDone) onDone(false, 'Could not resolve tab in popup window');
          return;
        }

        activeInstagramTabId = tabId;
        notifySynergyTab('[2/5] 🌐 Launched Instagram popup window with your residential session...');

        // Wait for page to finish loading before injecting post routine
        const onTabUpdated = (updatedTabId, changeInfo) => {
          if (updatedTabId === tabId && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(onTabUpdated);

            notifySynergyTab('[3/5] 📁 Instagram loaded. Preparing slide assets and launching creation dialog...');

            // Wait 2.5s for React DOM on instagram.com to settle
            setTimeout(() => {
              chrome.tabs.sendMessage(
                tabId,
                { action: 'EXECUTE_POST', payload },
                (res) => {
                  if (chrome.runtime.lastError) {
                    notifySynergyTab(`⚠️ Script Injection Note: ${chrome.runtime.lastError.message}`);
                  }
                }
              );
            }, 2500);
          }
        };

        chrome.tabs.onUpdated.addListener(onTabUpdated);
      });
    }
  );
}

// ============================================================================
// AUTOMATED SCHEDULER QUEUE WORKER (Runs every 5 seconds)
// ============================================================================

function checkDueScheduledQueue() {
  if (isPostingRunning) return; // Strict one-by-one execution

  chrome.storage.local.get(['scheduledPosts'], (res) => {
    const posts = res.scheduledPosts || [];
    const now = Date.now();

    // Find posts that are due
    const duePosts = posts
      .filter((p) => (!p.status || p.status === 'scheduled') && new Date(p.scheduledFor).getTime() <= now)
      .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

    if (duePosts.length === 0) return;

    const postToRun = duePosts[0];
    postToRun.status = 'publishing';

    chrome.storage.local.set({ scheduledPosts: posts }, () => {
      console.log(`[Extension Scheduler] ⏰ Auto-triggering scheduled post: "${postToRun.title}"`);
      executeInstagramPost(postToRun, (success, errorMsg) => {
        if (errorMsg === 'BUSY') return; // Will retry next cycle naturally
        postToRun.status = success ? 'published' : 'failed';
        postToRun.publishedAt = new Date().toISOString();
        if (errorMsg) postToRun.error = errorMsg;
        chrome.storage.local.set({ scheduledPosts: posts });
      });
    });
  });
}

// Background scheduler tick: every 5 seconds
setInterval(checkDueScheduledQueue, 5000);

// Also listen to precision Chrome alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get(['scheduledPosts'], (res) => {
    const posts = res.scheduledPosts || [];
    const post = posts.find((p) => p.id === alarm.name);
    if (!post || post.status === 'published' || post.status === 'publishing') return;

    checkDueScheduledQueue();
  });
});

// ============================================================================
// MESSAGE HANDLER: Interface with Synergy Web App Content Script
// ============================================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 1. Verify Flow Integrity Handshake
  if (request.action === 'VERIFY_FLOW') {
    chrome.cookies.get({ url: 'https://www.instagram.com', name: 'sessionid' }, (cookie) => {
      const hasInstagramSession = Boolean(cookie && cookie.value);
      sendResponse({
        success: true,
        installed: true,
        version: '1.1.1',
        hasInstagramSession,
        origin: 'Chrome Extension Service Worker',
      });
    });
    return true; // Keep channel open for async response
  }

  // 2. Open Dedicated Instagram Popup Window for Login / Verification
  if (request.action === 'OPEN_LOGIN_WINDOW') {
    activeSenderTabId = sender.tab ? sender.tab.id : null;

    chrome.windows.create(
      {
        url: 'https://www.instagram.com/',
        type: 'popup',
        width: 1100,
        height: 850,
        focused: true,
        populate: true,
      },
      (newWindow) => {
        activePopupWindowId = newWindow.id;
        notifySynergyTab('🌐 Instagram popup window opened. Please log in or verify your account.');
        sendResponse({ success: true, windowId: newWindow.id });
      }
    );
    return true;
  }

  // 3. Start Automated Post Immediately via Floating Popup Window
  if (request.action === 'START_INSTAGRAM_POST') {
    activeSenderTabId = sender.tab ? sender.tab.id : null;
    executeInstagramPost(request.payload || {}, (success, errorMsg) => {
      if (!success && errorMsg !== 'BUSY') {
        notifySynergyTab(`❌ Error: ${errorMsg}`, true);
      }
    });
    sendResponse({ success: true, message: 'Instagram post job dispatched to popup window' });
    return true;
  }

  // 4. Schedule Post via Storage & Chrome Alarms
  if (request.action === 'SCHEDULE_POST') {
    const post = request.payload || {};
    const when = new Date(post.scheduledFor).getTime();

    chrome.storage.local.get(['scheduledPosts'], (res) => {
      let posts = res.scheduledPosts || [];
      // Remove any prior entry with same id
      posts = posts.filter((p) => p.id !== post.id);
      posts.push(post);

      chrome.storage.local.set({ scheduledPosts: posts }, () => {
        try {
          chrome.alarms.create(post.id, { when });
        } catch (e) {}

        notifySynergyTab(`📅 Scheduled post alarm registered for ${new Date(when).toLocaleString()}`);
        sendResponse({ success: true, message: `Alarm created for ${new Date(when).toLocaleString()}` });

        // Trigger queue check immediately in case scheduled time is right now
        checkDueScheduledQueue();
      });
    });
    return true;
  }

  // 5. Relay Progress from Instagram Tab -> Synergy Web Tab
  if (request.action === 'POST_PROGRESS') {
    notifySynergyTab(request.message);
    return;
  }

  // 6. Relay Completion from Instagram Tab -> Synergy Web Tab
  if (request.action === 'POST_COMPLETE') {
    isPostingRunning = false;
    if (postWatchdogTimer) {
      clearTimeout(postWatchdogTimer);
      postWatchdogTimer = null;
    }

    // Update scheduled post status in local extension storage
    if (currentRunningPostId) {
      const pid = currentRunningPostId;
      chrome.storage.local.get(['scheduledPosts'], (res) => {
        const posts = res.scheduledPosts || [];
        const idx = posts.findIndex((p) => p.id === pid);
        if (idx !== -1) {
          posts[idx].status = request.success ? 'published' : 'failed';
          posts[idx].publishedAt = new Date().toISOString();
          chrome.storage.local.set({ scheduledPosts: posts });
        }
      });
      currentRunningPostId = null;
    }

    if (activeSenderTabId) {
      chrome.tabs.sendMessage(activeSenderTabId, {
        target: 'SYNERGY_WEB_STUDIO',
        type: 'POST_RESULT',
        success: request.success,
        error: request.error,
        result: request.result,
      });
    }

    // Automatically close the popup window after successful completion
    if (request.success && activePopupWindowId) {
      setTimeout(() => {
        try {
          chrome.windows.remove(activePopupWindowId);
        } catch {}
      }, 4000);
    }
    return;
  }
});

function notifySynergyTab(message, isError = false) {
  if (!activeSenderTabId) return;
  chrome.tabs.sendMessage(activeSenderTabId, {
    target: 'SYNERGY_WEB_STUDIO',
    type: isError ? 'POST_RESULT' : 'PROGRESS_UPDATE',
    message,
    success: !isError,
    error: isError ? message : undefined,
  });
}
