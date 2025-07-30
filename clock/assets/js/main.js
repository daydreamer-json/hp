// グローバル変数
let showMilliseconds = false;
let frameRateMode = false; // フレームレート表記モード（true: 有効, false: 無効）
let currentFrameRate = 24; // デフォルトのフレームレート (24, 30, 60)
let glowPulseEnabled = true;
let settingsBtnVisible = false;
let settingsBtnTimeout;
let glowPulseInterval;
let pipWindow = null; // PiPウィンドウ参照用

// 要素の取得
const settingsBtn = document.getElementById('settings-btn');
const pipBtn = document.getElementById('pip-btn'); // PiPボタン追加
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
    let fractionalPart;

    if (frameRateMode) {
      // フレームレート表記
      const frameCount = Math.floor(now.getMilliseconds() / (1000 / currentFrameRate));
      fractionalPart = String(frameCount).padStart(2, '0');
    } else {
      // 通常の1/100秒表記
      fractionalPart = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
    }

    const timeString = `${hours}:${minutes}:${seconds}:${fractionalPart}`;
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

// 設定ボタンとPiPボタンの表示（フェードイン）
function showSettingsButton() {
  if (settingsBtnVisible) return;

  // 両ボタンを表示
  [settingsBtn, pipBtn].forEach(btn => {
    btn.classList.remove('fade-out');
    btn.classList.add('fade-in');
    btn.style.display = 'flex';
  });

  settingsBtnVisible = true;

  // 3秒後にボタンを非表示
  clearTimeout(settingsBtnTimeout);
  settingsBtnTimeout = setTimeout(hideSettingsButton, 3000);
}

// 設定ボタンとPiPボタンの非表示（フェードアウト）
function hideSettingsButton() {
  if (!settingsBtnVisible || optionsMenu.classList.contains('show')) return;

  // 両ボタンを非表示
  [settingsBtn, pipBtn].forEach(btn => {
    btn.classList.remove('fade-in');
    btn.classList.add('fade-out');
  });

  // アニメーション終了後に非表示
  setTimeout(() => {
    if (settingsBtn.classList.contains('fade-out')) {
      [settingsBtn, pipBtn].forEach(btn => {
        btn.style.display = 'none';
      });
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

// PiP機能のトグル
async function togglePiP() {
  try {
    // 既にPiPウィンドウが開いている場合は閉じる
    if (pipWindow) {
      pipWindow.close(); // ウィンドウを直接閉じる
      pipWindow = null; // 即座にnullを設定
      return;
    }

    // クロック要素をコピーしてPiP用に準備（非表示前）
    const pipClock = clockElement.cloneNode(true);
    pipClock.id = 'pip-clock';
    pipClock.className = clockElement.className; // 元のクラスを適用
    pipClock.classList.add('pip-clock'); // 追加スタイル用のクラス

    // クローンからhiddenクラスを削除（PiP時計を表示）
    pipClock.classList.remove('hidden');

    // メイン時計を非表示に（PiP作成後に実行）
    clockElement.classList.add('hidden');

    // PiPウィンドウを作成（正しいAPIを使用）
    pipWindow = await documentPictureInPicture.requestWindow({
      width: 900,
      height: 160
    });

    // PiPウィンドウにスタイルシートを追加
    ['https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11/font/bootstrap-icons.min.css', 'https://rsms.me/inter/inter.css', 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+SC:wght@100..900&display=swap', 'https://iosevka-webfonts.github.io/iosevka/Iosevka.css', '../assets/fonts/dseg/dseg.css', './assets/css/main.css'].forEach(cssPath => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath; // メインのスタイルシートを読み込み
      pipWindow.document.head.appendChild(link);
    });

    pipWindow.document.head.insertAdjacentHTML('afterbegin', '<meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    pipWindow.document.head.insertAdjacentHTML('beforeend', '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/js/bootstrap.min.js"></script>');

    // PiPウィンドウに時計を追加
    pipWindow.document.body.appendChild(pipClock);

    // PiPウィンドウが閉じられたときの処理
    // closeイベントの代わりにpagehideイベントを使用
    pipWindow.addEventListener('pagehide', () => {
      console.log('[DEBUG] PiP pagehide event triggered');

      pipWindow = null;
      console.log('PiPウィンドウが閉じられました');

      // メイン時計を再表示
      clockElement.classList.remove('hidden');
      console.log('[DEBUG] Main clock visibility restored');
    });

    // 追加のデバッグ: unloadイベントも監視
    pipWindow.addEventListener('unload', () => {
      console.log('[DEBUG] PiP unload event triggered');
    });

    millisecToggle.addEventListener('change', () => {
      showMilliseconds = millisecToggle.checked;
      if (showMilliseconds) {
        pipClock.classList.add('sizeOverride-showMs');
      } else {
        pipClock.classList.remove('sizeOverride-showMs');
      }
      updatePipClock();
    });

    // 表示方式選択の変更をPiP時計にも反映 (ドロップダウン用)
    // メインウィンドウの要素を取得
    const mainWindowFrameRateSelect = document.getElementById('frame-rate-select');
    if (mainWindowFrameRateSelect) {
      mainWindowFrameRateSelect.addEventListener('change', () => {
        const value = mainWindowFrameRateSelect.value;
        if (value === 'normal') {
          frameRateMode = false; // 通常表示モード
        } else {
          frameRateMode = true; // フレームレートモード
          currentFrameRate = parseInt(value);
        }
        updatePipClock();
      });
    }

    // PiPウィンドウの時計も更新する（テキストとスタイル）
    const updatePipClock = () => {
      if (!pipWindow) return;
      pipClock.textContent = clockElement.textContent;
      pipClock.style.textShadow = clockElement.style.textShadow; // 発光エフェクトを同期
    };

    // メインの時計更新と同期
    setInterval(updatePipClock, 10);

  } catch (error) {
    console.error('PiPエラー:', error);
    alert('PiP機能の使用中にエラーが発生しました: ' + error.message);

    // エラー発生時もメイン時計を再表示
    clockElement.classList.remove('hidden');
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

  // PiPボタンのクリックイベント
  pipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePiP();
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
      clockElement.classList.add('sizeOverride-showMs');
      // 1/100秒表示が有効な時のみフレームレートオプションを表示
      document.getElementById('frame-rate-option').style.display = 'block';
    } else {
      clockElement.classList.remove('sizeOverride-showMs');
      // 1/100秒表示が無効ならフレームレートオプションを非表示
      document.getElementById('frame-rate-option').style.display = 'none';
    }
    updateClock();
  });

  // 表示方式選択の変更イベント (ドロップダウン用)
  const frameRateSelect = document.getElementById('frame-rate-select');
  frameRateSelect.addEventListener('change', () => {
    const value = frameRateSelect.value;
    if (value === 'normal') {
      frameRateMode = false; // 通常表示モード
    } else {
      frameRateMode = true; // フレームレートモード
      currentFrameRate = parseInt(value);
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

  // 初期状態でフレームレートオプションを非表示（1/100秒表示が無効なら）
  if (!showMilliseconds) {
    document.getElementById('frame-rate-option').style.display = 'none';
  }

  // 発光エフェクト用インターバル初期化
  setInterval(updateGlowEffect, 50);
});

// 時計の更新を開始
setInterval(updateClock, 10);
updateClock();
