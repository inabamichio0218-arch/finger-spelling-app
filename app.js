(() => {
  'use strict';

  const videos = {
    a:     { label: 'あ行', file: 'a.mp4' },
    ka:    { label: 'か行', file: 'ka.mp4' },
    sa:    { label: 'さ行', file: 'sa.mp4' },
    ta:    { label: 'た行', file: 'ta.mp4' },
    na:    { label: 'な行', file: 'na.mp4' },
    ha:    { label: 'は行', file: 'ha.mp4' },
    ma:    { label: 'ま行', file: 'ma.mp4' },
    ya:    { label: 'や行', file: 'ya.mp4' },
    ra:    { label: 'ら行', file: 'ra.mp4' },
    other: { label: 'その他', file: 'other.mp4' },
    omake: { label: 'おまけ', file: 'cat.mp4' }
  };

  const homeScreen = document.getElementById('homeScreen');
  const playerScreen = document.getElementById('playerScreen');
  const video = document.getElementById('learningVideo');
  const videoHeading = document.getElementById('videoHeading');
  const backButton = document.getElementById('backButton');
  const replayButton = document.getElementById('replayButton');
  const homeButton = document.getElementById('homeButton');
  const endActions = document.getElementById('endActions');
  const menuButtons = [...document.querySelectorAll('[data-key]')];

  let lastFocusedButton = null;
  let activeKey = null;

  function stopVideo() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    endActions.hidden = true;
    activeKey = null;
  }

  function showHome({ restoreFocus = true } = {}) {
    stopVideo();
    playerScreen.hidden = true;
    homeScreen.hidden = false;
    document.body.classList.remove('is-playing');
    document.title = 'AI動画で学ぶ 指文字';
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (restoreFocus && lastFocusedButton) {
      requestAnimationFrame(() => lastFocusedButton.focus());
    }
  }

  async function showVideo(key, { autoplay = true } = {}) {
    const item = videos[key];
    if (!item) {
      showHome({ restoreFocus: false });
      return;
    }

    activeKey = key;
    homeScreen.hidden = true;
    playerScreen.hidden = false;
    document.body.classList.add('is-playing');
    videoHeading.textContent = item.label;
    document.title = `${item.label}｜AI動画で学ぶ 指文字`;
    endActions.hidden = true;

    video.src = `videos/${item.file}`;
    video.load();
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (autoplay) {
      try {
        await video.play();
      } catch {
        // Some browser settings prevent autoplay. Native controls remain available.
      }
    }
  }

  function navigateToVideo(key) {
    const newHash = `#${key}`;
    if (window.location.hash === newHash) {
      showVideo(key, { autoplay: true });
      return;
    }
    history.pushState({ key }, '', newHash);
    showVideo(key, { autoplay: true });
  }

  function navigateHome() {
    if (window.location.hash) {
      history.back();
    } else {
      showHome();
    }
  }

  menuButtons.forEach((button) => {
    button.addEventListener('click', () => {
      lastFocusedButton = button;
      navigateToVideo(button.dataset.key);
    });
  });

  backButton.addEventListener('click', navigateHome);
  homeButton.addEventListener('click', navigateHome);

  replayButton.addEventListener('click', async () => {
    endActions.hidden = true;
    video.currentTime = 0;
    try {
      await video.play();
    } catch {
      // Native controls remain available if playback is blocked.
    }
  });

  video.addEventListener('ended', () => {
    endActions.hidden = false;
    replayButton.focus();
  });

  video.addEventListener('play', () => {
    endActions.hidden = true;
  });

  window.addEventListener('popstate', () => {
    const key = window.location.hash.slice(1);
    if (videos[key]) {
      showVideo(key, { autoplay: false });
    } else {
      showHome();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !playerScreen.hidden) {
      navigateHome();
    }
  });

  const initialKey = window.location.hash.slice(1);
  if (videos[initialKey]) {
    showVideo(initialKey, { autoplay: false });
  } else {
    showHome({ restoreFocus: false });
  }

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {
        // The app still works without offline shell caching.
      });
    });
  }
})();
