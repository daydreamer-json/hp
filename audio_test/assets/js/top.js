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
    { path: './assets/audio/phigros_calibration.webm', title: 'Phigros Calibration', bpm: 120, triplets: false },
    { path: './assets/audio/phigros_levelover0.webm', title: 'Phigros LevelOver EZ', bpm: 140, triplets: false },
    { path: './assets/audio/phigros_levelover1.webm', title: 'Phigros LevelOver HD', bpm: 140, triplets: false },
    { path: './assets/audio/phigros_levelover2.webm', title: 'Phigros LevelOver IN', bpm: 140, triplets: false },
    { path: './assets/audio/phigros_levelover3.webm', title: 'Phigros LevelOver AT', bpm: 140, triplets: false },
    { path: './assets/audio/beyond_the_way_sync.webm', title: 'Beyond the way', bpm: 125, triplets: false },
    { path: './assets/audio/inflower_skydreamer_vip_loop.webm', title: 'Skydreamer VIP', bpm: 150, triplets: true },
  ];
  let currentAudioFileIndex = 0;
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
    currentAudioFileIndex = parseInt(document.getElementById('sec1_audioSourceSelectList').value);
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
    dragToSeek: true,
    sampleRate: 16000,
    waveColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#555555' : '#aaaaaa',
    progressColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#aaaaaa' : '#555555',
    cursorColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ffffff' : '#000000',
  });
  // wavesurfer.registerPlugin(
  //   WaveSurferSpectrogram.create({
  //     labels: false,
  //     height: 200,
  //     splitChannels: true,
  //     scale: 'mel', // 'linear', 'logarithmic', 'bark', 'erb', 'mel'
  //     frequencyMax: 22050,
  //     frequencyMin: 0,
  //     fftSamples: 1024,
  //     labelsBackground: 'rgba(0, 0, 0, 0.1)',
  //   }),
  // );
  const buttonEl = {
    playPause: document.getElementById('sec1_button_playPause'),
    stop: document.getElementById('sec1_button_stop'),
    skipStart: document.getElementById('sec1_button_skipStart'),
    skipEnd: document.getElementById('sec1_button_skipEnd'),
    skipRewind: document.getElementById('sec1_button_skipRewind'),
    skipForward: document.getElementById('sec1_button_skipForward'),
  };
  const allButtonDisableChange = () => {
    for (const button of Object.values(buttonEl)) {
      button.disabled = true;
    }
  };
  const allButtonEnableChange = () => {
    for (const button of Object.values(buttonEl)) {
      button.disabled = false;
    }
  };
  await wavesurfer.load(audioFileList[currentAudioFileIndex].path);
  allButtonEnableChange();
  (() => {
    const iconEl = document.querySelector('label[for="sec1_button_playPause"]').querySelector('i');
    document.querySelector('label[for="sec1_button_playPause"]').addEventListener('click', async () => {
      if (buttonEl.playPause.checked) {
        wavesurfer.pause();
        iconEl.classList.remove('bi-pause-fill');
        iconEl.classList.add('bi-play-fill');
      } else {
        await wavesurfer.play();
        iconEl.classList.remove('bi-play-fill');
        iconEl.classList.add('bi-pause-fill');
      }
    });
    buttonEl.stop.addEventListener('click', () => {
      wavesurfer.stop();
      buttonEl.playPause.checked = false;
      iconEl.classList.remove('bi-pause-fill');
      iconEl.classList.add('bi-play-fill');
    });
    buttonEl.skipStart.addEventListener('click', () => {
      wavesurfer.seekTo(0); // Seek to the beginning (0%)
    });
    buttonEl.skipEnd.addEventListener('click', () => {
      wavesurfer.seekTo(1); // Seek to the end (100%)
    });
    buttonEl.skipRewind.addEventListener('click', () => {
      wavesurfer.skip(-((60 / audioFileList[parseInt(document.getElementById('sec1_audioSourceSelectList').value)].bpm) * 4));
    });
    buttonEl.skipForward.addEventListener('click', () => {
      // wavesurfer.skip(5);
      wavesurfer.skip((60 / audioFileList[parseInt(document.getElementById('sec1_audioSourceSelectList').value)].bpm) * 4);
    });
    // (() => {
    //   buttonEl.skipForward.addEventListener('mousedown', () => {
    //     wavesurfer.setPlaybackRate(4);
    //   });
    //   buttonEl.skipForward.addEventListener('mouseup', () => {
    //     wavesurfer.setPlaybackRate(1);
    //     if (!buttonEl.playPause.checked) {
    //       wavesurfer.pause();
    //     }
    //   });
    //   buttonEl.skipForward.addEventListener('mouseleave', () => {
    //     wavesurfer.setPlaybackRate(1);
    //     if (!buttonEl.playPause.checked) {
    //       wavesurfer.pause();
    //     }
    //   });
    // })();
    document.getElementById('sec1_audioSourceSelectList').addEventListener('change', async () => {
      wavesurfer.pause();
      wavesurfer.stop();
      allButtonDisableChange();
      currentAudioFileIndex = parseInt(document.getElementById('sec1_audioSourceSelectList').value);
      await wavesurfer.load(audioFileList[currentAudioFileIndex].path);
      wavesurfer.seekTo(0);
      allButtonEnableChange();
      if (buttonEl.playPause.checked) await wavesurfer.play();
    });
    (() => {
      wavesurfer.setVolume(parseInt(document.getElementById('sec1_audioPlayerControl_volume_number').value) / 100);
      wavesurfer.zoom(document.getElementById('sec1_audioPlayerControl_timeZoom_number').value);
      document.getElementById('sec1_audioPlayerControl_volume_slider').addEventListener('input', () => {
        document.getElementById('sec1_audioPlayerControl_volume_number').value = document.getElementById('sec1_audioPlayerControl_volume_slider').value;
        wavesurfer.setVolume(document.getElementById('sec1_audioPlayerControl_volume_number').value / 100);
      });
      document.getElementById('sec1_audioPlayerControl_volume_number').addEventListener('input', () => {
        document.getElementById('sec1_audioPlayerControl_volume_slider').value = document.getElementById('sec1_audioPlayerControl_volume_number').value;
        wavesurfer.setVolume(document.getElementById('sec1_audioPlayerControl_volume_number').value / 100);
      });
      document.getElementById('sec1_audioPlayerControl_timeZoom_slider').addEventListener('input', () => {
        document.getElementById('sec1_audioPlayerControl_timeZoom_number').value = document.getElementById('sec1_audioPlayerControl_timeZoom_slider').value;
        wavesurfer.zoom(document.getElementById('sec1_audioPlayerControl_timeZoom_number').value);
      });
      document.getElementById('sec1_audioPlayerControl_timeZoom_number').addEventListener('input', () => {
        document.getElementById('sec1_audioPlayerControl_timeZoom_slider').value = document.getElementById('sec1_audioPlayerControl_timeZoom_number').value;
        wavesurfer.zoom(document.getElementById('sec1_audioPlayerControl_timeZoom_number').value);
      });
    })();
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
  let infoTextUpd_fitCharCount = calculateCharactersFit(document.getElementById('sec1_infoText_upd').parentNode.parentNode) - 4;
  window.addEventListener('resize', () => {
    infoTextUpd_fitCharCount = calculateCharactersFit(document.getElementById('sec1_infoText_upd').parentNode.parentNode) - 4;
  });
  wavesurfer.on('timeupdate', () => {
    const textCurrentTime = DateTime.fromMillis(wavesurfer.getCurrentTime() * 1000).toFormat('mm:ss.SSS');
    const textDuration = DateTime.fromMillis(wavesurfer.getDuration() * 1000).toFormat('mm:ss.SSS');
    const trackBpm = audioFileList[currentAudioFileIndex].bpm;
    const isTriplets = audioFileList[currentAudioFileIndex].triplets;
    const barBeatTickObj = mathUtils.calculateBarBeatTick(wavesurfer.getCurrentTime(), trackBpm, 4, isTriplets);
    const barBeatTickObjDur = mathUtils.calculateBarBeatTick(wavesurfer.getDuration(), trackBpm, 4, isTriplets);
    document.getElementById('sec1_infoText_upd').innerText = [
      `TimePos:  ${textCurrentTime} / ${textDuration}`,
      `Beat:     ` + `${String(barBeatTickObj.bars).padStart(3, '0')}:${barBeatTickObj.beats}:${barBeatTickObj.beatsQuarter}:${String(barBeatTickObj.ticksQuarter).padStart(3, '0')}${barBeatTickObj.beatsQuarter - 1 < (isTriplets ? 1 : 2) && wavesurfer.isPlaying() ? '.' : ' '} / ` + `${String(barBeatTickObjDur.bars).padStart(3, '0')}:${barBeatTickObjDur.beats}:${barBeatTickObjDur.beatsQuarter}:${String(barBeatTickObjDur.ticksQuarter).padStart(3, '0')} ` + `(${trackBpm} bpm)`,
      `BeatDisp: ${(() => {
        const barLength = Math.floor((infoTextUpd_fitCharCount - 3) / 4);
        return new Array(barBeatTickObj.beats).fill('█'.repeat(barLength)).join(' ');
      })()}`,
      `TickDisp: ${'█'.repeat(Math.ceil(infoTextUpd_fitCharCount * (barBeatTickObj.ticks / 1000)))}`
    ].join('\n');
  });
}

function calculateCharactersFit(element) {
  // 要素の横幅を取得
  const elementWidth = element.offsetWidth;
  // 一時的なspan要素を作成して文字の平均幅を計算
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'nowrap';
  span.style.fontSize = window.getComputedStyle(element).fontSize;
  span.style.fontFamily = window.getComputedStyle(element).fontFamily;
  span.innerText = '0'; // 任意の文字を設定（全角文字の場合）
  document.body.appendChild(span);
  // 文字の平均幅を計算
  const charWidth = span.offsetWidth;
  // span要素を削除
  document.body.removeChild(span);
  // 要素の横幅に何文字分入るかを計算
  const charsFit = Math.floor(elementWidth / charWidth);
  return charsFit;
}
