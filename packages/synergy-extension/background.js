/**
 * ============================================================================
 * SYNERGY SOCIAL ASSISTANT - BACKGROUND SERVICE WORKER
 * Manages tabs, Instagram cookies, and relays commands to the Instagram tab.
 * ============================================================================
 */

let activeSenderTabId = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 1. Verify Flow Integrity Handshake
  if (request.action === 'VERIFY_FLOW') {
    chrome.cookies.get({ url: 'https://www.instagram.com', name: 'sessionid' }, (cookie) => {
      const hasInstagramSession = Boolean(cookie && cookie.value);
      sendResponse({
        success: true,
        installed: true,
        version: '1.0.0',
        hasInstagramSession,
        origin: 'Chrome Extension Service Worker',
      });
    });
    return true; // Keep channel open for async response
  }

  // 2. Start Automated Post
  if (request.action === 'START_INSTAGRAM_POST') {
    const payload = request.payload || {};
    activeSenderTabId = sender.tab ? sender.tab.id : null;

    notifySynergyTab('[1/5] 🧩 Synergy Social Assistant initialized. Checking active Instagram session...');

    chrome.cookies.get({ url: 'https://www.instagram.com', name: 'sessionid' }, (cookie) => {
      if (!cookie || !cookie.value) {
        notifySynergyTab('❌ Error: No active Instagram session found. Please log into Instagram in Chrome first.', true);
        sendResponse({ success: false, error: 'Not logged into Instagram' });
        return;
      }

      notifySynergyTab('[2/5] 🌐 Opening Instagram tab with your residential session...');

      // Open Instagram in a tab
      chrome.tabs.create({ url: 'https://www.instagram.com/', active: true }, (igTab) => {
        const tabId = igTab.id;

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
    });

    sendResponse({ success: true, message: 'Instagram post job started' });
    return true;
  }

  // 3. Relay Progress from Instagram Tab -> Synergy Web Tab
  if (request.action === 'POST_PROGRESS') {
    notifySynergyTab(request.message);
    return;
  }

  // 4. Relay Completion from Instagram Tab -> Synergy Web Tab
  if (request.action === 'POST_COMPLETE') {
    if (activeSenderTabId) {
      chrome.tabs.sendMessage(activeSenderTabId, {
        target: 'SYNERGY_WEB_STUDIO',
        type: 'POST_RESULT',
        success: request.success,
        error: request.error,
        result: request.result,
      });
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
