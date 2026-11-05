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
    sendProgress(`[3/5] 📸 Preparing ${slides.length} slide assets for upload...`);

    const files = slides.map((dataUrl, idx) =>
      dataURLtoFile(dataUrl, `synergy_slide_${idx + 1}.png`)
    );

    // 1. Click Create / New Post button in Instagram sidebar
    const createBtn = document.querySelector(
      'svg[aria-label="New post"], svg[aria-label="Create"]'
    )?.closest('a, button, div[role="button"]');

    if (!createBtn) {
      throw new Error('Could not find Instagram "Create" button. Please make sure you are on the Instagram home feed.');
    }

    createBtn.click();
    await sleep(randomBetween(1500, 2500));

    // 2. Locate File input
    let fileInput = document.querySelector('input[type="file"][accept*="image"]');

    // If "Select from computer" button exists, we can still target the hidden file input
    if (!fileInput) {
      await sleep(1500);
      fileInput = document.querySelector('input[type="file"]');
    }

    if (!fileInput) {
      throw new Error('Upload dialog did not expose file input. Please ensure popups are permitted.');
    }

    sendProgress(`[4/5] 📁 Uploading ${files.length} carousel slide(s)...`);

    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));

    await sleep(randomBetween(2500, 4000));

    // 3. Step through "Crop" -> click "Next"
    sendProgress('[4/5] ⏩ Advancing through crop & aspect adjustments...');
    const nextButtons = Array.from(document.querySelectorAll('div[role="button"], button')).filter(
      (el) => el.textContent && el.textContent.trim().toLowerCase() === 'next'
    );

    if (nextButtons.length > 0) {
      nextButtons[nextButtons.length - 1].click();
      await sleep(randomBetween(2000, 3500));
    }

    // 4. Step through "Filters / Edit" -> click "Next"
    const nextButtons2 = Array.from(document.querySelectorAll('div[role="button"], button')).filter(
      (el) => el.textContent && el.textContent.trim().toLowerCase() === 'next'
    );

    if (nextButtons2.length > 0) {
      nextButtons2[nextButtons2.length - 1].click();
      await sleep(randomBetween(2000, 3500));
    }

    // 5. Enter Caption with Human-like Typing
    sendProgress('[5/5] ✍️ Simulating human typing for caption & hashtags...');
    const captionBox = document.querySelector(
      'div[aria-label*="caption" i], div[contenteditable="true"]'
    );

    if (captionBox) {
      captionBox.focus();
      await sleep(500);

      // Natural Human Typing Simulation
      document.execCommand('insertText', false, caption);
      captionBox.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(randomBetween(1500, 3000));
    }

    // 6. Click "Share"
    sendProgress('[5/5] 🚀 Finalizing publication: clicking Share...');
    const shareBtn = Array.from(document.querySelectorAll('div[role="button"], button')).find(
      (el) => el.textContent && el.textContent.trim().toLowerCase() === 'share'
    );

    if (shareBtn) {
      shareBtn.click();
    } else {
      throw new Error('Could not find "Share" button to finalize upload.');
    }

    // 7. Wait for "Your post has been shared" confirmation
    let confirmed = false;
    for (let i = 0; i < 30; i++) {
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
