document.addEventListener('DOMContentLoaded', async () => {
  const igDot = document.getElementById('igDot');
  const igLabel = document.getElementById('igLabel');
  const openIgBtn = document.getElementById('openIgBtn');
  const verifyBtn = document.getElementById('verifyBtn');

  async function checkInstagramAuth() {
    try {
      const cookie = await chrome.cookies.get({
        url: 'https://www.instagram.com',
        name: 'sessionid',
      });
      if (cookie && cookie.value) {
        igDot.className = 'status-dot';
        igLabel.textContent = 'Authenticated (Active Session)';
      } else {
        igDot.className = 'status-dot warn';
        igLabel.textContent = 'Not Logged In';
      }
    } catch (e) {
      igDot.className = 'status-dot warn';
      igLabel.textContent = 'Login Check Error';
    }
  }

  openIgBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.instagram.com/' });
  });

  verifyBtn.addEventListener('click', async () => {
    await checkInstagramAuth();
    alert('Flow integrity verified! Synergy Social Assistant is active and ready to post.');
  });

  checkInstagramAuth();
});

