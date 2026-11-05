/**
 * ============================================================================
 * INSTAGRAM INJECTOR (Content Script)
 * Injected into instagram.com tab to execute carousel uploading & human typing.
 * ============================================================================
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.action !== 'EXECUTE_POST') return;

  const { slides = [], caption = '', stealthMode = true } = request.payload || {};

  function sendProgress(msg) {
    chrome.runtime.sendMessage({ action: 'POST_PROGRESS', message: msg });
  }

  function sendComplete(success, errorMsg = null) {
    chrome.runtime.sendMessage({
      action: 'POST_COMPLETE',
      success,
      error: errorMsg,
      result: { timestamp: new Date().toISOString() },
    });
  }

  try {
    sendProgress(`[2/5] 📸 Preparing ${slides.length} slide assets for upload...`);

    const files = slides.map((dataUrl, idx) =>
      dataURLtoFile(dataUrl, `synergy_slide_${idx + 1}.png`)
    );

    // ========================================================================
    // Step 1: Check if Login is Required
    // ========================================================================
    const isLoginPage = () =>
      window.location.pathname.includes('/login') ||
      Boolean(document.querySelector('input[name="username"]'));

    if (isLoginPage()) {
      sendProgress('🔑 Instagram Login Required: Please log into your account in the popup window. Handling 2FA / prompts...');

      let loginAttempts = 0;
      while (isLoginPage()) {
        loginAttempts++;
        if (loginAttempts > 180) { // Wait up to 3 minutes
          throw new Error('Login timed out. Please log into Instagram in the popup window and try again.');
        }
        await sleep(1000);
      }

      sendProgress('✅ Login detected! Preparing Instagram home feed...');
      await sleep(3000);
    }

    // Dismiss any "Save Info" or "Turn on Notifications" modal popups
    try {
      const dismissButtons = Array.from(document.querySelectorAll('button, div[role="button"]')).filter(
        (el) => /not now|save info/i.test(el.textContent || '')
      );
      if (dismissButtons.length > 0) {
        dismissButtons[0].click();
        await sleep(1000);
      }
    } catch {}

    // ========================================================================
    // Step 2: Click "Create" in Navigation Bar
    // ========================================================================
    sendProgress('[3/5] 📁 Opening Instagram Create menu...');

    let createBtn = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      createBtn = document.querySelector(
        'svg[aria-label="New post"], svg[aria-label="Create"]'
      )?.closest('a, button, div[role="button"]');

      if (!createBtn) {
        // Fallback: search for navigation item with text "Create"
        const navItems = Array.from(document.querySelectorAll('a, button, div[role="button"]'));
        createBtn = navItems.find((el) => el.textContent?.trim().toLowerCase() === 'create');
      }

      if (createBtn) break;
      await sleep(500);
    }

    if (!createBtn) {
      throw new Error('Could not find Instagram "Create" button. Please make sure your Instagram feed has loaded.');
    }

    createBtn.click();
    await sleep(randomBetween(1200, 2000));

    // ========================================================================
    // Step 3: Handle Dropdown Menu (Click "Post" Option)
    // On modern Instagram desktop, clicking "Create" opens a dropdown popover
    // with "Post" and "Live video". We must click "Post" to mount the modal!
    // ========================================================================
    const allClickables = Array.from(
      document.querySelectorAll('div[role="menuitem"], a, button, div[role="button"], span')
    );

    const postMenuItem = allClickables.find((el) => {
      const text = el.textContent?.trim().toLowerCase();
      return text === 'post' && !el.closest('header') && !el.closest('form');
    });

    if (postMenuItem) {
      sendProgress('[3/5] 📋 Selected "Post" from dropdown menu...');
      postMenuItem.click();
      await sleep(1500);
    }

    // ========================================================================
    // Step 4: Locate the File Input and Feed Carousel Files
    // ========================================================================
    sendProgress(`[4/5] 📁 Uploading ${files.length} carousel slide(s)...`);

    let fileInput = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      fileInput = document.querySelector('input[type="file"][accept*="image"]') ||
                  document.querySelector('input[type="file"]');
      if (fileInput) break;
      await sleep(500);
    }

    // If fileInput still not found, check if "Select from computer" button exists
    if (!fileInput) {
      const selectCompBtn = Array.from(document.querySelectorAll('button, div[role="button"]')).find(
        (el) => /select from computer/i.test(el.textContent || '')
      );
      if (selectCompBtn) {
        fileInput = document.querySelector('input[type="file"]');
      }
    }

    if (!fileInput) {
      throw new Error('Upload dialog did not mount file input. Please ensure popups are permitted.');
    }

    // Assign files using browser DataTransfer
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fileInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Wait for Instagram to render carousel slide previews
    await sleep(randomBetween(3500, 5000));

    // ========================================================================
    // Step 5: Advance through "Crop" and "Filters"
    // ========================================================================
    async function clickNextButton() {
      for (let attempt = 0; attempt < 15; attempt++) {
        const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
        const nextBtn = buttons.find((el) => el.textContent?.trim().toLowerCase() === 'next');
        if (nextBtn) {
          nextBtn.click();
          return true;
        }
        await sleep(500);
      }
      return false;
    }

    sendProgress('[4/5] ⏩ Advancing through crop & aspect adjustments...');
    await clickNextButton();
    await sleep(randomBetween(2000, 3500));

    sendProgress('[4/5] ⏩ Advancing through filters & edits...');
    await clickNextButton();
    await sleep(randomBetween(2000, 3500));

    // ========================================================================
    // Step 6: Enter Caption with Human Delay
    // ========================================================================
    sendProgress('[5/5] ✍️ Simulating human typing for caption & hashtags...');

    let captionBox = null;
    for (let attempt = 0; attempt < 15; attempt++) {
      captionBox = document.querySelector(
        'div[aria-label*="caption" i], div[contenteditable="true"], div[role="textbox"]'
      );
      if (captionBox) break;
      await sleep(500);
    }

    if (captionBox) {
      captionBox.focus();
      await sleep(500);

      // Insert caption simulating human keystrokes
      document.execCommand('insertText', false, caption);
      captionBox.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(randomBetween(1500, 3000));
    }

    // ========================================================================
    // Step 7: Click "Share"
    // ========================================================================
    sendProgress('[5/5] 🚀 Finalizing publication: clicking Share...');

    let shareBtn = null;
    for (let attempt = 0; attempt < 15; attempt++) {
      const buttons = Array.from(document.querySelectorAll('div[role="button"], button'));
      shareBtn = buttons.find((el) => el.textContent?.trim().toLowerCase() === 'share');
      if (shareBtn) break;
      await sleep(500);
    }

    if (shareBtn) {
      shareBtn.click();
    } else {
      throw new Error('Could not find "Share" button to finalize upload.');
    }

    // ========================================================================
    // Step 8: Wait for Post Confirmation
    // ========================================================================
    sendProgress('⏳ Uploading carousel to Instagram servers...');
    let confirmed = false;
    for (let i = 0; i < 40; i++) {
      await sleep(1500);
      const text = document.body.innerText || '';
      if (/your post has been shared/i.test(text) || /post shared/i.test(text)) {
        confirmed = true;
        break;
      }
    }

    sendProgress('🎉 Post published successfully to Instagram!');
    sendComplete(true);
  } catch (err) {
    console.error('[Synergy Extension Error]', err);
    sendComplete(false, err.message || 'An error occurred during Instagram DOM automation.');
  }
});
