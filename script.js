let deferredPrompt = null;

const isIos = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
};

const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function maybeShowInstallPrompt() {
  if (isInStandaloneMode()) return;

  const alreadyShown = localStorage.getItem('mybreath_pwa_prompt_shown');
  if (alreadyShown === '1') return;

  if (isIos()) {
    openInstallModal('ios');
  } else if (deferredPrompt) {
    openInstallModal('android');
  }
}

const modal = document.getElementById('installModal');
const title = document.getElementById('installTitle');
const body = document.getElementById('installBody');
const primaryBtn = document.getElementById('installPrimaryBtn');
const secondaryBtn = document.getElementById('installSecondaryBtn');

function openInstallModal(platform) {
  modal.dataset.platform = platform;
  modal.classList.remove('hidden');

  if (platform === 'ios') {
    title.textContent = '✨ Keep My Breath on your Home Screen';
    body.innerHTML = `
      For the best My Health Foundation experience:<br>
      1. Tap the <strong>Share</strong> button in Safari (↑)<br>
      2. Choose <strong>“Add to Home Screen”</strong><br>
      3. Tap <strong>Add</strong><br><br>
      Your breathing practice becomes a simple daily ritual.
    `;
    primaryBtn.textContent = 'Show me how';
  } else {
    title.textContent = '✨ Add My Breath to your Home Screen';
    body.innerHTML = `
      Get 1-tap access to your self-healing practice:<br>
      • Opens in full screen<br>
      • Faster access to breathing sessions<br>
      • Works even with low connection<br>
      • Anchors your <strong>4 Axes</strong> routine
    `;
    primaryBtn.textContent = 'Add My Breath';
  }
}

function closeInstallModal() {
  modal.classList.add('hidden');
}

primaryBtn.addEventListener('click', async () => {
  const platform = modal.dataset.platform;

  if (platform === 'android' && deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }

  localStorage.setItem('mybreath_pwa_prompt_shown', '1');
  closeInstallModal();
});

secondaryBtn.addEventListener('click', () => {
  localStorage.setItem('mybreath_pwa_prompt_shown', '1');
  closeInstallModal();
});
