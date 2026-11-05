/**
 * ============================================================================
 * SYNERGY SOCIAL ASSISTANT - BACKGROUND SERVICE WORKER
 * Manages floating popup windows, cookies, and relays commands to Instagram.
 * ============================================================================
 */

let activeSenderTabId = null;
let activePopupWindowId = null;
let activeInstagramTabId = null;

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
      },
      (newWindow) => {
        activePopupWindowId = newWindow.id;
        activeInstagramTabId = newWindow.tabs ? newWindow.tabs[0].id : null;
        notifySynergyTab('🌐 Instagram popup window opened. Please log in or verify your account.');
        sendResponse({ success: true, windowId: newWindow.id });
      }
    );
    return true;
  }

  // 3. Start Automated Post via Floating Popup Window
  if (request.action === 'START_INSTAGRAM_POST') {
    const payload = request.payload || {};
    activeSenderTabId = sender.tab ? sender.tab.id : null;

    notifySynergyTab('[1/5] 🧩 Synergy Social Assistant initialized...');

    // Open Instagram in a dedicated FLOATING POPUP WINDOW (never a tab in the same window)
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
        const tabId = newWindow.tabs ? newWindow.tabs[0].id : null;
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
      }
    );

    sendResponse({ success: true, message: 'Instagram post job started in popup window' });
    return true;
  }

  // 4. Relay Progress from Instagram Tab -> Synergy Web Tab
  if (request.action === 'POST_PROGRESS') {
    notifySynergyTab(request.message);
    return;
  }

  // 5. Relay Completion from Instagram Tab -> Synergy Web Tab
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
