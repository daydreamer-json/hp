import textDefinition from './utils/definition.js';
import bitShiftUtils from './utils/bitShift.js';
import ky from 'https://cdn.jsdelivr.net/npm/ky/+esm';
import { DateTime, Duration } from 'https://cdn.jsdelivr.net/npm/luxon@3.5/+esm';
import WaveSurfer from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7.9.1/dist/wavesurfer.esm.js';
import WaveSurferSpectrogram from 'https://cdn.jsdelivr.net/npm/wavesurfer.js@7.9.1/dist/plugins/spectrogram.esm.js';
import mathUtils from './utils/mathUtils.js';

function updateUiTheme() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
}

window.addEventListener('DOMContentLoaded', () => {
  updateUiTheme();
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateUiTheme);

window.addEventListener('load', async () => {
  await sec1_functions();

});

async function sec1_functions() {
  // const audioFile = './assets/audio/beyond_the_way_sync.m4a';
  const audioFileList = [
    { path: './assets/audio/beyond_the_way_sync.m4a', title: 'Beyond the way', bpm: 125 },
    { path: './assets/audio/phigros_calibration.m4a', title: 'Phigros Calibration', bpm: 120 },
    { path: './assets/audio/phigros_levelover0.m4a', title: 'Phigros LevelOver EZ', bpm: 140 },
    { path: './assets/audio/phigros_levelover1.m4a', title: 'Phigros LevelOver HD', bpm: 140 },
    { path: './assets/audio/phigros_levelover2.m4a', title: 'Phigros LevelOver IN', bpm: 140 },
    { path: './assets/audio/phigros_levelover3.m4a', title: 'Phigros LevelOver AT', bpm: 140 },

  ];
  (() => {
    const selectFormEl = document.getElementById('sec1_audioSourceSelectList');
    const optionElArray = [];
    audioFileList.forEach((audioFileEntry, index) => {
      const optionEl = document.createElement('option');
      optionEl.value = index;
      optionEl.text = audioFileEntry.title;
      optionElArray.push(optionEl)
    });
    optionElArray[0].selected = true;
    selectFormEl.append(...optionElArray);
  })();
  const wavesurfer = WaveSurfer.create({
    container: '#sec1_wavesurfer',
    waveColor: 'violet',
    progressColor: 'purple',
    backend: 'WebAudio', // WebAudioバックエンドを使用
    audioRate: 1, // 再生速度
    barWidth: 2, // 波形のバーの幅
    barGap: 1, // 波形のバーの間隔
    cursorWidth: 1, // カーソルの幅
    height: 100, // 波形の高さ
    responsive: true, // レスポンシブ対応
    loopSelection: false, // ループ選択を無効にする
    dragToSeek: true
  });
  // wavesurfer.registerPlugin(
  //   WaveSurferSpectrogram.create({
  //     labels: false,
  //     height: 200,
  //     splitChannels: true,
  //     scale: 'mel', // 'linear', 'logarithmic', 'bark', 'erb', 'mel'
  //     frequencyMax: 4096,
  //     frequencyMin: 0,
  //     fftSamples: 1024,
  //     labelsBackground: 'rgba(0, 0, 0, 0.1)',
  //   }),
  // );
  await wavesurfer.load(audioFileList[parseInt(document.getElementById('sec1_audioSourceSelectList').value)].path);
  const buttonEl = {
    playPause: document.getElementById('sec1_button_playPause'),
    playPauseLabel: document.querySelector('label[for="sec1_button_playPause"]'),
    playPauseLabelIcon: document.querySelector('label[for="sec1_button_playPause"]').querySelector('i'),
    stop: document.getElementById('sec1_button_stop'),
    skipStart: document.getElementById('sec1_button_skipStart'),
    skipEnd: document.getElementById('sec1_button_skipEnd'),
    skipRewind: document.getElementById('sec1_button_skipRewind'),
    skipForward: document.getElementById('sec1_button_skipForward'),
  };
  (() => {
    buttonEl.playPauseLabel.addEventListener('click', async () => {
      if (buttonEl.playPause.checked) {
        wavesurfer.pause();
        buttonEl.playPauseLabelIcon.classList.remove('bi-pause-fill');
        buttonEl.playPauseLabelIcon.classList.add('bi-play-fill');
      } else {
        await wavesurfer.play();
        buttonEl.playPauseLabelIcon.classList.remove('bi-play-fill');
        buttonEl.playPauseLabelIcon.classList.add('bi-pause-fill');
      }
    });
    buttonEl.stop.addEventListener('click', () => {
      wavesurfer.stop();
      buttonEl.playPause.checked = false;
      buttonEl.playPauseLabelIcon.classList.remove('bi-pause-fill');
      buttonEl.playPauseLabelIcon.classList.add('bi-play-fill');
    });
    buttonEl.skipStart.addEventListener('click', () => {
      wavesurfer.seekTo(0); // Seek to the beginning (0%)
    });
    buttonEl.skipEnd.addEventListener('click', () => {
      wavesurfer.seekTo(1); // Seek to the end (100%)
    });
    buttonEl.skipRewind.addEventListener('click', () => {
      wavesurfer.skip(-5);
    });
    (() => {
      buttonEl.skipForward.addEventListener('mousedown', () => {
        wavesurfer.setPlaybackRate(4);
      });
      buttonEl.skipForward.addEventListener('mouseup', () => {
        wavesurfer.setPlaybackRate(1);
        if (!buttonEl.playPause.checked) {
          wavesurfer.pause();
        }
      });
      buttonEl.skipForward.addEventListener('mouseleave', () => {
        wavesurfer.setPlaybackRate(1);
        if (!buttonEl.playPause.checked) {
          wavesurfer.pause();
        }
      });
    })();
    document.getElementById('sec1_audioSourceSelectList').addEventListener('change', async () => {
      wavesurfer.pause();
      wavesurfer.stop();
      await wavesurfer.load(audioFileList[parseInt(document.getElementById('sec1_audioSourceSelectList').value)].path);
      wavesurfer.seekTo(0);
      await wavesurfer.play();
    });
  })();
  (() => {
    // ギャップレス(のような)ループ処理
    wavesurfer.on('finish', async () => {
      wavesurfer.seekTo(0);
      await wavesurfer.play();
    });
    wavesurfer.on('audioprocess', async () => {
      if (wavesurfer.getCurrentTime() > wavesurfer.getDuration()) {
        wavesurfer.seekTo(0); // 再生位置を最初に戻す
        await wavesurfer.play(); // 再生を再開
      }
    });
  })();
  wavesurfer.on('audioprocess', () => {
    const textCurrentTime = DateTime.fromMillis(wavesurfer.getCurrentTime() * 1000).toFormat('mm:ss.SSS');
    const textDuration = DateTime.fromMillis(wavesurfer.getDuration() * 1000).toFormat('mm:ss.SSS');
    const trackBpm = audioFileList[parseInt(document.getElementById('sec1_audioSourceSelectList').value)].bpm
    const barBeatTickObj = mathUtils.calculateBarBeatTick(wavesurfer.getCurrentTime(), trackBpm, 4);
    document.getElementById('sec1_infoText_upd').innerText = [
      `TimePos:  ${textCurrentTime} / ${textDuration}`,
      `Beat:     ${String(barBeatTickObj.bars).padStart(3, '0')}:${barBeatTickObj.beats}:${String(barBeatTickObj.ticks).padStart(3, '0')} / ${trackBpm} bpm`,
      `BeatDisp: ${'████ '.repeat(barBeatTickObj.beats)}`,
        `TickDisp: ${'█'.repeat(Math.ceil(19 * (barBeatTickObj.ticks / 1000)))}`
    ].join('\n');
  });
}
