/**
 * ============================================================================
 * SYNERGY BRIDGE CLIENT (Content Script)
 * Injected into Synergy Web App (synergy.vercel.app / localhost)
 * Handles bidirectional communication between Web UI and Chrome Extension.
 * ============================================================================
 */

(function () {
  const EXTENSION_VERSION = '1.1.4';

  // Mark document element for instant synchronous detection by Synergy Web UI
  document.documentElement.setAttribute('data-synergy-extension', EXTENSION_VERSION);

  // Dispatch custom event to notify React components immediately
  try {
    window.dispatchEvent(
      new CustomEvent('SYNERGY_EXTENSION_LOADED', {
        detail: { version: EXTENSION_VERSION, ready: true },
      })
    );
  } catch (e) {}

  // Relay messages from Synergy Web App -> Extension Background Service Worker
  window.addEventListener('message', (event) => {
    // Only accept messages intended for Synergy Extension
    if (!event.data || event.data.source !== 'SYNERGY_WEB_STUDIO') return;

    const { type, payload } = event.data;

    if (type === 'PING') {
      window.postMessage(
        {
          source: 'SYNERGY_EXTENSION',
          type: 'PONG',
          version: EXTENSION_VERSION,
          ready: true,
        },
        '*'
      );
      return;
    }

    if (type === 'VERIFY_FLOW') {
      chrome.runtime.sendMessage({ action: 'VERIFY_FLOW' }, (response) => {
        if (chrome.runtime.lastError) {
          window.postMessage(
            {
              source: 'SYNERGY_EXTENSION',
              type: 'VERIFY_RESULT',
              success: false,
              error: chrome.runtime.lastError.message,
            },
            '*'
          );
          return;
        }
        window.postMessage(
          {
            source: 'SYNERGY_EXTENSION',
            type: 'VERIFY_RESULT',
            ...response,
          },
          '*'
        );
      });
      return;
    }

    if (type === 'OPEN_LOGIN_WINDOW') {
      chrome.runtime.sendMessage({ action: 'OPEN_LOGIN_WINDOW' });
      return;
    }

    if (type === 'SCHEDULE_POST') {
      chrome.runtime.sendMessage({ action: 'SCHEDULE_POST', payload });
      return;
    }

    if (type === 'TRIGGER_DUE_POST') {
      chrome.runtime.sendMessage({ action: 'START_INSTAGRAM_POST', payload });
      return;
    }

    if (type === 'PUBLISH_INSTAGRAM') {
      chrome.runtime.sendMessage(
        { action: 'START_INSTAGRAM_POST', payload },
        (response) => {
          if (chrome.runtime.lastError) {
            window.postMessage(
              {
                source: 'SYNERGY_EXTENSION',
                type: 'POST_RESULT',
                success: false,
                error: chrome.runtime.lastError.message,
              },
              '*'
            );
          }
        }
      );
    }
  });

  // Listen for progress messages coming from background script -> relay to Web UI
  chrome.runtime.onMessage.addListener((message) => {
    if (!message || message.target !== 'SYNERGY_WEB_STUDIO') return;
    window.postMessage(
      {
        source: 'SYNERGY_EXTENSION',
        type: message.type,
        message: message.message,
        payload: message.payload,
        success: message.success,
        error: message.error,
      },
      '*'
    );
  });
})();

