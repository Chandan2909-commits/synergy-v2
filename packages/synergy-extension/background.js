/**
 * ============================================================================
 * SYNERGY SOCIAL ASSISTANT - BACKGROUND SERVICE WORKER (v1.1.3)
 * Manages floating popup windows, cookies, alarms, and exact-moment execution.
 * ============================================================================
 */

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
// SCRIPT INJECTION & DISPATCH HELPER
// ============================================================================

function deliverPostToTab(tabId, payload, onDone) {
  notifySynergyTabs('[3/5] 📁 Instagram loaded. Preparing slide assets and launching creation dialog...');

  // 1. Explicitly execute instagram-injector.js into the tab to ensure listener is active
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ['instagram-injector.js'],
    },
    () => {
      // 2. Wait 1.5s for DOM & script to mount, then dispatch EXECUTE_POST
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { action: 'EXECUTE_POST', payload }, (res) => {
          if (chrome.runtime.lastError) {
            console.warn('[Background] First sendMessage note:', chrome.runtime.lastError.message);
            // Retry once after 2.5 seconds
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, { action: 'EXECUTE_POST', payload }, (res2) => {
                if (chrome.runtime.lastError) {
                  console.error('[Background] Failed to send EXECUTE_POST:', chrome.runtime.lastError.message);
                  isPostingRunning = false;
                  currentRunningPostId = null;
                  if (onDone) onDone(false, chrome.runtime.lastError.message);
                }
              });
            }, 2500);
          }
        });
      }, 1500);
    }
  );
}

// ============================================================================
// CORE EXECUTION ENGINE: Launch Dedicated Popup & Post to Instagram
// ============================================================================

function executeInstagramPost(payload, onDone) {
  // If this exact post is already running, silently ignore duplicate triggers
  if (isPostingRunning) {
    if (payload.id && payload.id === currentRunningPostId) {
      console.log(`[Background] Post "${payload.title || 'Carousel'}" is already in progress.`);
      if (onDone) onDone(true, null);
      return;
    }
    console.log('[Background] Another post is currently running. Queue will process this next cycle.');
    if (onDone) onDone(false, 'BUSY');
    return;
  }

  isPostingRunning = true;
  currentRunningPostId = payload.id || null;

  // 3.5-Minute Watchdog Timer to prevent lock from getting stuck indefinitely
  if (postWatchdogTimer) clearTimeout(postWatchdogTimer);
  postWatchdogTimer = setTimeout(() => {
    if (isPostingRunning) {
      console.warn('[Background] Watchdog: Post execution exceeded 3.5 minutes. Releasing lock.');
      isPostingRunning = false;
      currentRunningPostId = null;
      if (activePopupWindowId) {
        try {
          chrome.windows.remove(activePopupWindowId);
        } catch {}
        activePopupWindowId = null;
      }
    }
  }, 210000);

  notifySynergyTabs(`[1/5] 🧩 Synergy Social Assistant initialized: "${payload.title || 'Carousel'}"...`);

  // Open Instagram in a dedicated FLOATING POPUP WINDOW
  chrome.windows.create(
    {
      url: 'https://www.instagram.com/',
      type: 'popup',
      width: 1100,
      height: 850,
      focused: true,
    },
    (newWindow) => {
      if (!newWindow) {
        isPostingRunning = false;
        currentRunningPostId = null;
        if (onDone) onDone(false, 'Failed to launch popup window');
        return;
      }

      activePopupWindowId = newWindow.id;

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
        notifySynergyTabs('[2/5] 🌐 Launched Instagram popup window with your residential session...');

        // Inspect tab status immediately to avoid missed onUpdated race condition
        chrome.tabs.get(tabId, (tab) => {
          let delivered = false;

          const triggerDelivery = () => {
            if (delivered) return;
            delivered = true;
            try {
              chrome.tabs.onUpdated.removeListener(onTabUpdated);
            } catch {}
            deliverPostToTab(tabId, payload, onDone);
          };

          // If tab is already completed (cached / fast load), deliver immediately!
          if (tab && tab.status === 'complete') {
            console.log('[Background] Tab already complete. Triggering delivery immediately.');
            setTimeout(triggerDelivery, 2000);
            return;
          }

          const onTabUpdated = (updatedTabId, changeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === 'complete') {
              triggerDelivery();
            }
          };

          chrome.tabs.onUpdated.addListener(onTabUpdated);

          // Safety fallback: if onUpdated was dropped, deliver after 5 seconds
          setTimeout(triggerDelivery, 5000);
        });
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
        version: '1.1.3',
        hasInstagramSession,
        origin: 'Chrome Extension Service Worker',
      });
    });
    return true; // Keep channel open for async response
  }

  // 2. Open Dedicated Instagram Popup Window for Login / Verification
  if (request.action === 'OPEN_LOGIN_WINDOW') {
    chrome.windows.create(
      {
        url: 'https://www.instagram.com/',
        type: 'popup',
        width: 1100,
        height: 850,
        focused: true,
      },
      (newWindow) => {
        activePopupWindowId = newWindow.id;
        notifySynergyTabs('🌐 Instagram popup window opened. Please log in or verify your account.');
        sendResponse({ success: true, windowId: newWindow.id });
      }
    );
    return true;
  }

  // 3. Start Automated Post Immediately via Floating Popup Window
  if (request.action === 'START_INSTAGRAM_POST') {
    executeInstagramPost(request.payload || {}, (success, errorMsg) => {
      if (!success && errorMsg !== 'BUSY') {
        notifySynergyTabs(`❌ Error: ${errorMsg}`, true);
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

        notifySynergyTabs(`📅 Scheduled post alarm registered for ${new Date(when).toLocaleString()}`);
        sendResponse({ success: true, message: `Alarm created for ${new Date(when).toLocaleString()}` });

        // Trigger queue check immediately in case scheduled time is right now
        checkDueScheduledQueue();
      });
    });
    return true;
  }

  // 5. Relay Progress from Instagram Tab -> Synergy Web Tab
  if (request.action === 'POST_PROGRESS') {
    notifySynergyTabs(request.message);
    return;
  }

  // 6. Relay Completion from Instagram Tab -> Synergy Web Tab
  if (request.action === 'POST_COMPLETE') {
    isPostingRunning = false;
    if (postWatchdogTimer) {
      clearTimeout(postWatchdogTimer);
      postWatchdogTimer = null;
    }

    const finishedPostId = currentRunningPostId;
    currentRunningPostId = null;

    // Update scheduled post status in local extension storage
    if (finishedPostId) {
      chrome.storage.local.get(['scheduledPosts'], (res) => {
        const posts = res.scheduledPosts || [];
        const idx = posts.findIndex((p) => p.id === finishedPostId);
        if (idx !== -1) {
          posts[idx].status = request.success ? 'published' : 'failed';
          posts[idx].publishedAt = new Date().toISOString();
          chrome.storage.local.set({ scheduledPosts: posts });
        }
      });
    }

    // Broadcast completion to all open Synergy Web tabs
    notifySynergyTabs(
      request.success ? '🎉 Post published successfully to Instagram!' : `❌ ${request.error}`,
      !request.success,
      {
        type: 'POST_RESULT',
        postId: finishedPostId,
        success: request.success,
        error: request.error,
        result: request.result,
      }
    );

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

// Broadcasts a message to all open Synergy Web App tabs
function notifySynergyTabs(message, isError = false, extra = {}) {
  chrome.tabs.query({}, (tabs) => {
    if (!tabs || tabs.length === 0) return;
    tabs.forEach((tab) => {
      const url = tab.url || '';
      if (
        url.includes('vercel.app') ||
        url.includes('localhost:3000') ||
        url.includes('127.0.0.1:3000')
      ) {
        chrome.tabs.sendMessage(tab.id, {
          target: 'SYNERGY_WEB_STUDIO',
          type: extra.type || (isError ? 'POST_RESULT' : 'PROGRESS_UPDATE'),
          message,
          success: !isError,
          error: isError ? message : undefined,
          ...extra,
        }).catch(() => {});
      }
    });
  });
}
