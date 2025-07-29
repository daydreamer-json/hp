// グローバル変数
let showMilliseconds = false;
let glowPulseEnabled = true;
let settingsBtnVisible = false;
let settingsBtnTimeout;
let glowPulseInterval;

// 要素の取得
const settingsBtn = document.getElementById('settings-btn');
const optionsMenu = document.getElementById('options-menu');
const millisecToggle = document.getElementById('millisec-toggle');
const glowPulseToggle = document.getElementById('glow-pulse-toggle');
const clockElement = document.getElementById('clock');

// 時計更新関数
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  if (showMilliseconds) {
    const milliseconds = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}:${milliseconds}`;
    clockElement.textContent = timeString;
  } else {
    const timeString = `${hours}:${minutes}:${seconds}`;
    clockElement.textContent = timeString;
  }
}

// 発光エフェクト更新関数
function updateGlowEffect() {
  // 透明度設定 (変数化)
  const baseOpacity = 0.5; // デフォルト透明度
  const maxOpacity = 1.0;  // 最大透明度

  if (!glowPulseEnabled) {
    clockElement.style.textShadow =
      `0 0 15px rgba(255, 255, 255, ${baseOpacity}), ` +
      `0 0 20px rgba(0, 255, 255, ${baseOpacity}), ` +
      `0 0 35px rgba(0, 255, 255, ${baseOpacity}), ` +
      `0 0 40px rgba(0, 255, 255, ${baseOpacity})`;
    return;
  }

  const now = new Date();
  const milliseconds = now.getMilliseconds(); // 0-999
  const progress = milliseconds / 1000; // 0.0～0.999

  /* 以前の実装（コメントアウトして残す）
  if (progress < 0.8) {
    opacity = maxOpacity - (maxOpacity - baseOpacity) * (progress / 0.8);
  } else {
    const phaseProgress = (progress - 0.8) / 0.2;
    opacity = baseOpacity + (maxOpacity - baseOpacity) * phaseProgress;
  }
  */

  // 新しい実装: 線形減衰のみ
  let opacity = maxOpacity - (maxOpacity - baseOpacity) * progress;

  clockElement.style.textShadow =
    `0 0 15px rgba(255, 255, 255, ${opacity}), ` +
    `0 0 20px rgba(0, 255, 255, ${opacity}), ` +
    `0 0 35px rgba(0, 255, 255, ${opacity}), ` +
    `0 0 40px rgba(0, 255, 255, ${opacity})`;
}

// 設定ボタンの表示（フェードイン）
function showSettingsButton() {
  if (settingsBtnVisible) return;

  settingsBtn.classList.remove('fade-out');
  settingsBtn.classList.add('fade-in');
  settingsBtn.style.display = 'flex';
  settingsBtnVisible = true;

  // 3秒後にボタンを非表示
  clearTimeout(settingsBtnTimeout);
  settingsBtnTimeout = setTimeout(hideSettingsButton, 3000);
}

// 設定ボタンの非表示（フェードアウト）
function hideSettingsButton() {
  if (!settingsBtnVisible || optionsMenu.classList.contains('show')) return;

  settingsBtn.classList.remove('fade-in');
  settingsBtn.classList.add('fade-out');

  // アニメーション終了後に非表示
  setTimeout(() => {
    if (settingsBtn.classList.contains('fade-out')) {
      settingsBtn.style.display = 'none';
      settingsBtnVisible = false;
    }
  }, 300); // CSSのトランジション時間に合わせる
}

// メニューの表示/非表示
function toggleOptionsMenu() {
  const isOpen = optionsMenu.classList.contains('show');

  if (isOpen) {
    // メニューを閉じる
    optionsMenu.classList.remove('show');
    document.body.classList.remove('menu-open');
    hideSettingsButton();
  } else {
    // メニューを開く
    optionsMenu.classList.add('show');
    document.body.classList.add('menu-open');
    showSettingsButton();
  }
}

// イベントリスナーの設定
document.addEventListener('DOMContentLoaded', () => {
  // 画面のクリック/タップで設定ボタンを表示/非表示
  document.addEventListener('click', (e) => {
    // 設定ボタンやメニュー以外をクリックした場合
    if (e.target !== settingsBtn && e.target !== optionsMenu && !optionsMenu.contains(e.target)) {
      if (settingsBtnVisible) {
        hideSettingsButton();
      } else {
        showSettingsButton();
      }
    }
  });

  // 設定ボタンのクリックイベント
  settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleOptionsMenu();
  });

  // メニュー外のクリックでメニューを閉じる
  document.addEventListener('click', (e) => {
    if (optionsMenu.classList.contains('show') &&
      e.target !== optionsMenu &&
      e.target !== settingsBtn &&
      !optionsMenu.contains(e.target)) {
      toggleOptionsMenu();
    }
  });

  // 1/100秒表示切り替え
  millisecToggle.addEventListener('change', () => {
    showMilliseconds = millisecToggle.checked;
    if (showMilliseconds) {
      clockElement.style.fontSize = '12vw';
    } else {
      clockElement.style.fontSize = '14vw';
    }
    updateClock();
  });

  // 発光エフェクト切り替え
  glowPulseToggle.addEventListener('change', () => {
    glowPulseEnabled = glowPulseToggle.checked;
    if (glowPulseEnabled) {
      glowPulseInterval = setInterval(updateGlowEffect, 50);
    } else {
      clearInterval(glowPulseInterval);
      updateGlowEffect(); // デフォルト状態にリセット
    }
  });

  // 初期状態で1/100秒表示を有効化
  millisecToggle.checked = showMilliseconds;
  glowPulseToggle.checked = glowPulseEnabled;

  // 発光エフェクト用インターバル初期化
  setInterval(updateGlowEffect, 50);
});

// 時計の更新を開始
setInterval(updateClock, 10);
updateClock();
