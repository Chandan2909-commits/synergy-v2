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

// Close any accidental direct-message Share popup if it appears
function closeAnyDmShareModal() {
  const searchInputs = Array.from(document.querySelectorAll('input[placeholder*="Search" i]'));
  for (const inp of searchInputs) {
    const modal = inp.closest('div[role="dialog"]');
    if (modal) {
      const closeBtn =
        modal.querySelector('svg[aria-label="Close"], svg[aria-label="Back"]')?.closest('button, div[role="button"]') ||
        modal.querySelector('button, div[role="button"]');
      if (closeBtn) {
        closeBtn.click();
        return true;
      }
    }
  }
  return false;
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
      sendProgress('🔑 Instagram Login Required: Please log into your account in this window...');

      let loginAttempts = 0;
      while (isLoginPage()) {
        loginAttempts++;
        if (loginAttempts > 180) {
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

    // Close any stray DM share popups
    closeAnyDmShareModal();

    // ========================================================================
    // Step 2 & 3: Open "Create" -> "Post" to mount file upload dialog
    // ========================================================================
    sendProgress('[3/5] 📁 Launching Instagram Create post dialog...');

    let fileInput = null;

    // Retry loop: ensure "Create" -> "Post" menu item is clicked and fileInput is mounted
    for (let cycle = 0; cycle < 15; cycle++) {
      // 1. Check if file input is already present
      fileInput =
        document.querySelector('input[type="file"][accept*="image"]') ||
        document.querySelector('input[type="file"]');
      if (fileInput) break;

      // 2. Check if the "Post" dropdown menu item is already visible on screen
      const clickables = Array.from(
        document.querySelectorAll('div[role="menuitem"], a, button, div[role="button"], span')
      );
      const postMenuItem = clickables.find((el) => {
        const text = el.textContent?.trim().toLowerCase();
        return (
          text === 'post' &&
          !el.closest('header') &&
          !el.closest('form') &&
          !el.closest('article')
        );
      });

      if (postMenuItem) {
        sendProgress('[3/5] 📋 Selecting "Post" from menu...');
        postMenuItem.click();
        await sleep(1200);
      } else {
        // Find and click the "Create" button in the navigation bar
        const createBtn =
          document.querySelector(
            'svg[aria-label="New post"], svg[aria-label="Create"]'
          )?.closest('a, button, div[role="button"]') ||
          Array.from(document.querySelectorAll('a, button, div[role="button"]')).find(
            (el) => el.textContent?.trim().toLowerCase() === 'create'
          );

        if (createBtn) {
          createBtn.click();
          await sleep(1000);
        }
      }

      // Check if "Select from computer" button exists in modal
      const selectCompBtn = Array.from(document.querySelectorAll('button, div[role="button"]')).find(
        (el) => /select from computer/i.test(el.textContent || '')
      );
      if (selectCompBtn) {
        fileInput = document.querySelector('input[type="file"]');
        if (fileInput) break;
      }

      await sleep(600);
    }

    if (!fileInput) {
      // Final attempt: check if any file input exists
      fileInput = document.querySelector('input[type="file"]');
    }

    if (!fileInput) {
      throw new Error('Upload dialog did not mount file input. Please ensure popups are permitted.');
    }

    // ========================================================================
    // Step 4: Feed Carousel Slide Files to the File Input
    // ========================================================================
    sendProgress(`[4/5] 📁 Uploading ${files.length} carousel slide(s)...`);

    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fileInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Wait for Instagram to render carousel slide previews
    await sleep(randomBetween(3500, 5000));

    // ========================================================================
    // Step 5: Set Full Uncropped Aspect Ratio (Original / 4:5) & Advance
    // ========================================================================
    async function selectOriginalCrop() {
      try {
        sendProgress('[4/5] 📐 Setting uncropped aspect ratio (Original / 4:5)...');

        let cropBtn = null;
        for (let i = 0; i < 15; i++) {
          cropBtn =
            document.querySelector('svg[aria-label="Select crop"], svg[aria-label="Crop"]')?.closest('button, div[role="button"]') ||
            document.querySelector('button[aria-label*="crop" i], div[role="button"][aria-label*="crop" i]');
          if (cropBtn) break;
          await sleep(300);
        }

        if (cropBtn) {
          cropBtn.click();
          await sleep(700);

          // In the aspect ratio dropdown, find "Original" or "4:5"
          const clickables = Array.from(document.querySelectorAll('button, div[role="button"], span'));
          const originalOpt = clickables.find((el) => {
            const text = el.textContent?.trim().toLowerCase();
            return text === 'original' || text === '4:5';
          }) || document.querySelector('svg[aria-label="Photo outline icon"], svg[aria-label="Original"]')?.closest('button, div[role="button"]');

          if (originalOpt) {
            originalOpt.click();
            await sleep(800);
          }

          // Close the crop popover if still expanded
          try {
            cropBtn.click();
          } catch {}
          await sleep(400);
        }
      } catch (e) {
        console.warn('[Aspect Ratio Note]', e);
      }
    }

    async function clickNextButton() {
      for (let attempt = 0; attempt < 15; attempt++) {
        const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
        const createDialog =
          dialogs.find(
            (dlg) =>
              dlg.textContent?.includes('Create new post') ||
              dlg.textContent?.includes('Crop') ||
              dlg.textContent?.includes('Filters')
          ) || document;

        const dialogRect = createDialog.getBoundingClientRect ? createDialog.getBoundingClientRect() : { top: 0 };
        const buttons = Array.from(createDialog.querySelectorAll('div[role="button"], button'));

        const nextBtn = buttons.find((el) => {
          const text = el.textContent?.trim().toLowerCase();
          if (text !== 'next') return false;
          if (el.querySelector('svg')) return false;
          const rect = el.getBoundingClientRect();
          const relTop = rect.top - dialogRect.top;
          return relTop >= 0 && relTop < 150;
        }) || buttons.find((el) => el.textContent?.trim().toLowerCase() === 'next' && !el.querySelector('svg'));

        if (nextBtn) {
          nextBtn.click();
          return true;
        }
        await sleep(500);
      }
      return false;
    }

    // 1. Select uncropped aspect ratio to match the preview exactly
    await selectOriginalCrop();
    await sleep(randomBetween(1200, 2000));

    // 2. Advance through Crop -> Filters
    sendProgress('[4/5] ⏩ Advancing through crop & aspect adjustments...');
    await clickNextButton();
    await sleep(randomBetween(2000, 3500));

    // 3. Advance through Filters -> Caption
    sendProgress('[4/5] ⏩ Advancing through filters & edits...');
    await clickNextButton();
    await sleep(randomBetween(2000, 3500));

    // ========================================================================
    // Step 6: Enter Caption with Human Delay
    // ========================================================================
    sendProgress('[5/5] ✍️ Simulating human typing for caption & hashtags...');

    let captionBox = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      captionBox = document.querySelector(
        'div[aria-label*="caption" i], div[contenteditable="true"], div[role="textbox"]'
      );
      if (captionBox) break;
      await sleep(500);
    }

    if (!captionBox) {
      throw new Error('Could not locate caption text area in Create Post dialog.');
    }

    captionBox.focus();
    await sleep(400);

    // Insert caption simulating human keystrokes
    document.execCommand('insertText', false, caption);
    captionBox.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(randomBetween(1500, 2500));

    // ========================================================================
    // Step 7: Click "Share" (Strictly Target Create Dialog Publish Button)
    // ========================================================================
    sendProgress('[5/5] 🚀 Finalizing publication: clicking Share...');

    // Close any accidental DM Share popup if open
    closeAnyDmShareModal();
    await sleep(500);

    // The true Create Post modal MUST contain the captionBox
    const createModal =
      captionBox.closest('div[role="dialog"]') ||
      captionBox.closest('div[tabindex="-1"]') ||
      document.querySelector('div[role="dialog"]');

    if (!createModal) {
      throw new Error('Could not locate Create Post dialog container.');
    }

    let shareBtn = null;
    for (let attempt = 0; attempt < 25; attempt++) {
      const modalRect = createModal.getBoundingClientRect();
      const modalButtons = Array.from(createModal.querySelectorAll('div[role="button"], button'));

      shareBtn = modalButtons.find((el) => {
        // Exclude the caption box itself or anything inside it
        if (el.contains(captionBox) || captionBox.contains(el)) return false;
        // Exclude any button containing SVG icons (feed share, close button, etc.)
        if (el.querySelector('svg')) return false;
        // Exclude any button containing input elements
        if (el.querySelector('input')) return false;

        const text = el.textContent?.trim().toLowerCase();
        if (text !== 'share') return false;

        // Must be in the top 100px header row of the create modal
        const rect = el.getBoundingClientRect();
        const relTop = rect.top - modalRect.top;
        const isHeaderRow = relTop >= 0 && relTop <= 110;

        // Must be on the right half of the header
        const isRightSide = rect.right > modalRect.left + modalRect.width * 0.5;

        return isHeaderRow && isRightSide;
      });

      // Secondary fallback within createModal only
      if (!shareBtn) {
        shareBtn = modalButtons.find((el) => {
          const text = el.textContent?.trim().toLowerCase();
          return text === 'share' && !el.querySelector('svg') && !el.contains(captionBox);
        });
      }

      if (shareBtn) break;
      await sleep(500);
    }

    if (!shareBtn) {
      throw new Error('Could not find the "Share" button in the Create Post header.');
    }

    // Dispatch full mouse event cycle for React
    shareBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    shareBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
    shareBtn.click();

    // Check again if DM share sheet was accidentally opened and close it
    await sleep(1000);
    if (closeAnyDmShareModal()) {
      // Re-click the header share button if DM popup intercepted
      await sleep(500);
      shareBtn.click();
    }

    // ========================================================================
    // Step 8: Wait for Post Confirmation
    // ========================================================================
    sendProgress('⏳ Uploading carousel to Instagram servers...');
    let confirmed = false;
    for (let i = 0; i < 45; i++) {
      await sleep(1500);
      const text = document.body.innerText || '';
      if (/your post has been shared/i.test(text) || /post shared/i.test(text)) {
        confirmed = true;
        break;
      }
      // If create modal disappeared and we're back on feed, post finished!
      if (!document.body.contains(createModal)) {
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
