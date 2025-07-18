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

document.getElementById('sec2_button_load').addEventListener('click', async () => {
  await sec2_functions();
})

async function sec1_functions() {
  // const audioFile = './assets/audio/beyond_the_way_sync.m4a';
  const audioFileList = [
    { path: './assets/audio/phigros_calibration.webm', title: 'Phigros Calibration', bpm: 120, triplets: false, sRate: 48000 },
    { path: './assets/audio/phigros_levelover0.webm', title: 'Phigros LevelOver EZ', bpm: 140, triplets: false, sRate: 48000 },
    { path: './assets/audio/phigros_levelover1.webm', title: 'Phigros LevelOver HD', bpm: 140, triplets: false, sRate: 48000 },
    { path: './assets/audio/phigros_levelover2.webm', title: 'Phigros LevelOver IN', bpm: 140, triplets: false, sRate: 48000 },
    { path: './assets/audio/phigros_levelover3.webm', title: 'Phigros LevelOver AT', bpm: 140, triplets: false, sRate: 48000 },
    { path: './assets/audio/arcaea_bgm_main.webm', title: 'Arcaea Main BGM', bpm: 84 * 2, triplets: false, sRate: 48000 },
    { path: './assets/audio/beyond_the_way_sync.webm', title: 'Beyond the way', bpm: 125, triplets: false, sRate: 48000 },
    { path: './assets/audio/inflower_skydreamer_vip_loop.webm', title: 'Skydreamer VIP', bpm: 150, triplets: true, sRate: 48000 },
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
    // waveColor: 'violet',
    // progressColor: 'purple',
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
  document.getElementById('sec1_infoText_upd').innerText = 'TimePos:  --:--.--- / --:--.---\nSmplPos:  --------- / ---------\nBeat:     ---:-:-:---  / ---:-:-:---\nBeatDisp: \nTickDisp: ---:-:-:---';
  document.getElementById('sec1_infoText_upd_bigBeatDisp').innerText = '---:-:-:---';
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
    const trackSampleRate = audioFileList[currentAudioFileIndex].sRate;
    const barBeatTickObj = mathUtils.calculateBarBeatTick(wavesurfer.getCurrentTime(), trackBpm, 4, isTriplets);
    const barBeatTickObjDur = mathUtils.calculateBarBeatTick(wavesurfer.getDuration(), trackBpm, 4, isTriplets);
    document.getElementById('sec1_infoText_upd').innerText = [
      `TimePos:  ${textCurrentTime} / ${textDuration}`,
      `SmplPos:  ${String(Math.round(wavesurfer.getCurrentTime() * trackSampleRate)).padStart(9, ' ')} / ${String(Math.round(wavesurfer.getDuration() * trackSampleRate)).padStart(9, ' ')} @ ${trackSampleRate} Hz`,
      `Beat:     ` + `${String(barBeatTickObj.bars).padStart(3, '0')}:${barBeatTickObj.beats}:${barBeatTickObj.beatsQuarter}:${String(barBeatTickObj.ticksQuarter).padStart(3, '0')}${barBeatTickObj.beatsQuarter - 1 === 0 && wavesurfer.isPlaying() ? '.' : ' '} / ` + `${String(barBeatTickObjDur.bars).padStart(3, '0')}:${barBeatTickObjDur.beats}:${barBeatTickObjDur.beatsQuarter}:${String(barBeatTickObjDur.ticksQuarter).padStart(3, '0')} ` + `(${trackBpm} bpm)`,
      `BeatDisp: ${(() => {
        const barLength = Math.floor((infoTextUpd_fitCharCount - 3) / 4);
        return new Array(barBeatTickObj.beats).fill('█'.repeat(barLength)).join(' ');
      })()}`,
      `TickDisp: ${'█'.repeat(Math.ceil(infoTextUpd_fitCharCount * (barBeatTickObj.ticks / 1000)))}`
    ].join('\n');
    document.getElementById('sec1_infoText_upd_bigBeatDisp').innerText = `${String(barBeatTickObj.bars).padStart(3, '0')}:${barBeatTickObj.beats}:${barBeatTickObj.beatsQuarter}:${String(barBeatTickObj.ticksQuarter).padStart(3, '0')}${barBeatTickObj.beatsQuarter - 1 === 0 && wavesurfer.isPlaying() ? '.' : ''}`
  });
}

async function sec2_functions() {
  const trackInfoObj = {
    title: 'キセキヒカル',
    author: 'Aqours',
    bpm: 148,
    triplets: false,
    sRate: 48000,
    audioFileList: {
      inst: { path: './assets/audio/kiseki_hikaru/inst/opus/original.webm', title: 'Inst', id: 'inst' },
      vocal_original: { path: './assets/audio/kiseki_hikaru/vocal/opus/original.webm', title: 'Original Vocals', id: 'vocal_orig' },
      vocal_solo: [
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_takami_chika.webm', title: 'Takami Chika', id: 'chara_takami_chika' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_watanabe_you.webm', title: 'Watanabe You', id: 'chara_watanabe_you' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_sakurauchi_riko.webm', title: 'Sakurauchi Riko', id: 'chara_sakurauchi_riko' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_kunikida_hanamaru.webm', title: 'Kunikida Hanamaru', id: 'chara_kunikida_hanamaru' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_kurosawa_ruby.webm', title: 'Kurosawa Ruby', id: 'chara_kurosawa_ruby' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_tsushima_yoshiko.webm', title: 'Tsushima Yoshiko', id: 'chara_tsushima_yoshiko' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_kurosawa_dia.webm', title: 'Kurosawa Dia', id: 'chara_kurosawa_dia' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_matsuura_kanan.webm', title: 'Matsuura Kanan', id: 'chara_matsuura_kanan' },
        { path: './assets/audio/kiseki_hikaru/vocal/opus/chara_ohara_mari.webm', title: 'Ohara Mari', id: 'chara_ohara_mari' },
      ]
    }
  }
  const wsDefaultOptions = {
    backend: 'WebAudio', // WebAudioバックエンドを使用
    audioRate: 1, // 再生速度
    barWidth: 2, // 波形のバーの幅
    barGap: 1, // 波形のバーの間隔
    cursorWidth: 1, // カーソルの幅
    height: 48, // 波形の高さ
    responsive: true, // レスポンシブ対応
    loopSelection: false, // ループ選択を無効にする
    dragToSeek: true,
    sampleRate: (() => {
      const isMobileDevice = (() => {
        // navigator.userAgentDataをチェックしてClient Hints APIがブラウザにサポートされているか確認
        if (navigator.userAgentData) {
          // Client Hints APIがサポートされている場合、'mobile'に関する情報を取得
          navigator.userAgentData.getHighEntropyValues(['mobile'])
            .then(ua => {
              if (ua.mobile) { return true } else { return false }
            });
        } else {
          // Client Hints APIがサポートされていない場合、従来のUser-Agent文字列を使ってデバイスタイプを推測
          console.log('User-Agent Client Hints is not supported. Falling back to traditional User-Agent string.');
          if (/Mobi|Android/i.test(navigator.userAgent)) { return true } else { return false }
        }
      })();
      return isMobileDevice ? 16000 : 16000;
    })(),
    waveColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#555555' : '#aaaaaa',
    progressColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#aaaaaa' : '#555555',
    cursorColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? '#ffffff' : '#000000',
  }
  const buttonEl = {
    load: document.getElementById('sec2_button_load'),
    playPause: document.getElementById('sec2_button_playPause'),
    stop: document.getElementById('sec2_button_stop'),
    skipStart: document.getElementById('sec2_button_skipStart'),
    skipEnd: document.getElementById('sec2_button_skipEnd'),
    skipRewind: document.getElementById('sec2_button_skipRewind'),
    skipForward: document.getElementById('sec2_button_skipForward'),
    syncTrack: document.getElementById('sec2_button_syncTrack'),
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
  buttonEl.load.classList.remove('d-flex');
  buttonEl.load.classList.add('d-none');
  document.getElementById('sec2_content').classList.remove('d-none');
  document.getElementById('sec2_infoText_upd').innerText = 'TimePos:  --:--.--- / --:--.---\nSmplPos:  --------- / ---------\nBeat:     ---:-:-:---  / ---:-:-:---';
  document.getElementById('sec2_infoText_upd_bigBeatDisp').innerText = '---:-:-:---';
  const sliderTextBoxEls = {
    timeZoom: {
      slider: document.getElementById('sec2_audioPlayerControl_timeZoom_slider'),
      number: document.getElementById('sec2_audioPlayerControl_timeZoom_number'),
    },
    volInst: {
      slider: document.getElementById('sec2_audioPlayerControl_volume_slider_inst'),
      number: document.getElementById('sec2_audioPlayerControl_volume_number_inst'),
    },
    volVocal: {
      slider: document.getElementById('sec2_audioPlayerControl_volume_slider_vocal'),
      number: document.getElementById('sec2_audioPlayerControl_volume_number_vocal'),
    },
    volVocalSolo: [],
  };
  const wsInstances = [];
  let loadedInstanceCount = 0;
  let isFirstPlay = true;
  const checkAllLoaded = () => {
    loadedInstanceCount++;
    if (loadedInstanceCount === trackInfoObj.audioFileList.vocal_solo.length + 1) {
      console.log('Multi-track Mixing Test - ALL LOADED');
      allButtonEnableChange();
      document.getElementById('sec2_innerContent').classList.remove('d-none');
      // const wsPeaks = wsInstances.map(entry => ({ id: entry.id, peaks: entry.instance.exportPeaks() }));
      // console.log(JSON.stringify(wsPeaks));
    }
  };
  await (async () => {
    // Load all track
    const isMobileDevice = (() => {
      // navigator.userAgentDataをチェックしてClient Hints APIがブラウザにサポートされているか確認
      if (navigator.userAgentData) {
        // Client Hints APIがサポートされている場合、'mobile'に関する情報を取得
        navigator.userAgentData.getHighEntropyValues(['mobile'])
          .then(ua => {
            if (ua.mobile) { return true } else { return false }
          });
      } else {
        // Client Hints APIがサポートされていない場合、従来のUser-Agent文字列を使ってデバイスタイプを推測
        console.log('User-Agent Client Hints is not supported. Falling back to traditional User-Agent string.');
        if (/Mobi|Android/i.test(navigator.userAgent)) { return true } else { return false }
      }
    })();
    const peaksJson = await ky.get('./assets/audio/kiseki_hikaru/peaks.json').json();
    for (const audioFileObj of [
      trackInfoObj.audioFileList.inst,
      // trackInfoObj.audioFileList.vocal_original,
      ...trackInfoObj.audioFileList.vocal_solo
    ]) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.id = `sec2_wavesurfer_div_${audioFileObj.id}`;
      document.getElementById('sec2_wavesurfer_container').appendChild(wrapperDiv);
      const ws = WaveSurfer.create({
        container: '#' + wrapperDiv.id, ...wsDefaultOptions, height: (
          audioFileObj.id === 'inst' ? 48 : audioFileObj.id === 'vocal_orig' ? 36 : 18
        ),
        peaks: peaksJson.find(el => el.id === audioFileObj.id).peaks
      });
      wsInstances.push({ id: audioFileObj.id, instance: ws });
      ws.on('ready', () => {
        console.log('Loaded audio: ' + audioFileObj.id);
        checkAllLoaded();

      });
      if (isMobileDevice === true) {
        await ws.load(audioFileObj.path);
      } else {
        ws.load(audioFileObj.path);
      }
    }
    //     ws.setVolume((1 / trackInfoObj.audioFileList.vocal_solo.length) * 1.35);
  })();
  (() => {
    trackInfoObj.audioFileList.vocal_solo.forEach(obj => {
      document.querySelector('#sec2_control_table tbody').insertAdjacentHTML('beforeend', `
        <tr>
          <td class="py-0">${obj.title}</td>
          <td class="py-0">
            <div class="d-flex align-items-center">
              <input
                type="range" class="form-range flex-fill" min="0" max="100" value="100"
                id="sec2_audioPlayerControl_volume_slider_vocal_${obj.id}"
              />
              <input
                type="number" class="form-control form-control-sm w-25 ms-3 text-end font-monospace" min="0" max="100" value="100"
                id="sec2_audioPlayerControl_volume_number_vocal_${obj.id}"
              />
            </div>
          </td>
        </tr>
      `);
      sliderTextBoxEls.volVocalSolo.push({
        slider: document.getElementById(`sec2_audioPlayerControl_volume_slider_vocal_${obj.id}`),
        number: document.getElementById(`sec2_audioPlayerControl_volume_number_vocal_${obj.id}`)
      });
    });
    [
      sliderTextBoxEls.timeZoom,
      sliderTextBoxEls.volInst,
      sliderTextBoxEls.volVocal,
      ...sliderTextBoxEls.volVocalSolo
    ].forEach(obj => {
      obj.slider.addEventListener('input', () => { obj.number.value = obj.slider.value });
      obj.number.addEventListener('input', () => { obj.slider.value = obj.number.value });
    });
    Object.values(sliderTextBoxEls.timeZoom).forEach(el => {
      el.addEventListener('input', () => {
        wsInstances.forEach(entry => { entry.instance.zoom(sliderTextBoxEls.timeZoom.number.value) });
      });
    });
    const volumeCompensateFunc = () => {
      const volumeMasterInst = sliderTextBoxEls.volInst.number.value / 100;
      const volumeMasterVocal = sliderTextBoxEls.volVocal.number.value / 100;
      const volumeTrackVocalArray = sliderTextBoxEls.volVocalSolo.map(el => ({
        id: el.number.id.replace('sec2_audioPlayerControl_volume_number_vocal_', ''),
        volume: el.number.value / 100
      }));
      const volumeTrackVocalNormArray = (() => {
        // 振幅の二乗和を計算
        let sumOfSquares = 0;
        for (let i = 0; i < volumeTrackVocalArray.length; i++) {
          sumOfSquares += volumeTrackVocalArray[i].volume * volumeTrackVocalArray[i].volume;
        }
        // 二乗和が0の場合（全要素が0）、入力と同じ配列を返す
        if (sumOfSquares < 1) return volumeTrackVocalArray;
        // スケールファクターを計算 (二乗和の平方根の逆数)
        const scale = 1 / Math.sqrt(sumOfSquares);
        // 各振幅値にスケールファクターを乗算して新しい配列を生成
        return volumeTrackVocalArray.map(obj => ({ id: obj.id, volume: obj.volume * scale }));
      })();
      wsInstances.find(entry => entry.id === 'inst').instance.setVolume(volumeMasterInst);
      volumeTrackVocalNormArray.forEach(obj => {
        wsInstances.find(entry => entry.id === obj.id).instance.setVolume(obj.volume * volumeMasterVocal);
      });
    };
    volumeCompensateFunc();
    [
      sliderTextBoxEls.volInst,
      sliderTextBoxEls.volVocal,
      ...sliderTextBoxEls.volVocalSolo
    ].forEach(obj => {
      Object.values(obj).forEach(el => {
        el.addEventListener('input', () => {
          volumeCompensateFunc();
        });
      });
    });
    // Object.values(sliderTextBoxEls.volInst).forEach(el => {
    //   el.addEventListener('input', () => {
    //     wsInstances[0].setVolume(sliderTextBoxEls.volInst.number.value / 100);
    //   });
    // });

    // document.getElementById('sec2_audioPlayerControl_volume_slider').addEventListener('input', () => {
    //   document.getElementById('sec2_audioPlayerControl_volume_number').value = document.getElementById('sec1_audioPlayerControl_volume_slider').value;
    //   wavesurfer.setVolume(document.getElementById('sec1_audioPlayerControl_volume_number').value / 100);
    // });
    // document.getElementById('sec1_audioPlayerControl_volume_number').addEventListener('input', () => {
    //   document.getElementById('sec1_audioPlayerControl_volume_slider').value = document.getElementById('sec1_audioPlayerControl_volume_number').value;
    //   wavesurfer.setVolume(document.getElementById('sec1_audioPlayerControl_volume_number').value / 100);
    // });
  })();
  (() => {
    // Initialize event listener for player control button
    const iconEl = document.querySelector('label[for="sec2_button_playPause"]').querySelector('i');
    document.querySelector('label[for="sec2_button_playPause"]').addEventListener('click', async () => {
      if (buttonEl.playPause.checked) {
        wsInstances.forEach(entry => { entry.instance.pause() });
        iconEl.classList.remove('bi-pause-fill');
        iconEl.classList.add('bi-play-fill');
      } else {
        await Promise.all(wsInstances.map(entry => entry.instance.play()));
        if (isFirstPlay) {
          await (async () => {
            const startTime = Date.now();
            const endTime = startTime + 1000;
            while (Date.now() < endTime) {
              wsInstances.forEach(entry => { entry.instance.seekTo(0) }); // Seek to the beginning (0%)
              await new Promise(resolve => setTimeout(resolve, 10));
            }
          })();
          isFirstPlay = false;
        }
        iconEl.classList.remove('bi-play-fill');
        iconEl.classList.add('bi-pause-fill');
      }
    });
    buttonEl.stop.addEventListener('click', () => {
      wsInstances.forEach(entry => { entry.instance.stop() });
      buttonEl.playPause.checked = false;
      iconEl.classList.remove('bi-pause-fill');
      iconEl.classList.add('bi-play-fill');
    });
    buttonEl.skipStart.addEventListener('click', () => {
      wsInstances.forEach(entry => { entry.instance.seekTo(0) });
    });
    buttonEl.skipEnd.addEventListener('click', () => {
      wsInstances.forEach(entry => { entry.instance.seekTo(1) });
    });
    buttonEl.skipRewind.addEventListener('click', () => {
      wsInstances.forEach(entry => { entry.instance.skip(-((60 / trackInfoObj.bpm) * 4)) });
    });
    buttonEl.skipForward.addEventListener('click', () => {
      wsInstances.forEach(entry => { entry.instance.skip((60 / trackInfoObj.bpm) * 4) });
    });
    buttonEl.syncTrack.addEventListener('click', () => {
      const targetTime = wsInstances.find(entry => entry.id === 'inst').instance.getCurrentTime();
      wsInstances.filter(entry => entry.id !== 'inst').forEach(entry => { entry.instance.setTime(targetTime) });
    });
    // document.getElementById('sec1_audioSourceSelectList').addEventListener('change', async () => {
    //   wavesurfer.pause();
    //   wavesurfer.stop();
    //   allButtonDisableChange();
    //   currentAudioFileIndex = parseInt(document.getElementById('sec1_audioSourceSelectList').value);
    //   await wavesurfer.load(audioFileList[currentAudioFileIndex].path);
    //   wavesurfer.seekTo(0);
    //   allButtonEnableChange();
    //   if (buttonEl.playPause.checked) await wavesurfer.play();
    // });
    // (() => {
    //   wavesurfer.setVolume(parseInt(document.getElementById('sec1_audioPlayerControl_volume_number').value) / 100);
    //   wavesurfer.zoom(document.getElementById('sec1_audioPlayerControl_timeZoom_number').value);
    //   document.getElementById('sec1_audioPlayerControl_volume_slider').addEventListener('input', () => {
    //     document.getElementById('sec1_audioPlayerControl_volume_number').value = document.getElementById('sec1_audioPlayerControl_volume_slider').value;
    //     wavesurfer.setVolume(document.getElementById('sec1_audioPlayerControl_volume_number').value / 100);
    //   });
    //   document.getElementById('sec1_audioPlayerControl_volume_number').addEventListener('input', () => {
    //     document.getElementById('sec1_audioPlayerControl_volume_slider').value = document.getElementById('sec1_audioPlayerControl_volume_number').value;
    //     wavesurfer.setVolume(document.getElementById('sec1_audioPlayerControl_volume_number').value / 100);
    //   });
    //   document.getElementById('sec1_audioPlayerControl_timeZoom_slider').addEventListener('input', () => {
    //     document.getElementById('sec1_audioPlayerControl_timeZoom_number').value = document.getElementById('sec1_audioPlayerControl_timeZoom_slider').value;
    //     wavesurfer.zoom(document.getElementById('sec1_audioPlayerControl_timeZoom_number').value);
    //   });
    //   document.getElementById('sec1_audioPlayerControl_timeZoom_number').addEventListener('input', () => {
    //     document.getElementById('sec1_audioPlayerControl_timeZoom_slider').value = document.getElementById('sec1_audioPlayerControl_timeZoom_number').value;
    //     wavesurfer.zoom(document.getElementById('sec1_audioPlayerControl_timeZoom_number').value);
    //   });
    // })();
  })();
  window.wsInstances = wsInstances;
  wsInstances[0].instance.on('timeupdate', async () => {
    const fetchedDuration = wsInstances[0].instance.getDuration();
    const fetchedCurrentTime = wsInstances[0].instance.getCurrentTime();
    const textCurrentTime = DateTime.fromMillis(fetchedCurrentTime * 1000).toFormat('mm:ss.SSS');
    const textDuration = DateTime.fromMillis(fetchedDuration * 1000).toFormat('mm:ss.SSS');
    const trackBpm = trackInfoObj.bpm;
    const isTriplets = trackInfoObj.triplets;
    const trackSampleRate = trackInfoObj.sRate;
    const barBeatTickObj = mathUtils.calculateBarBeatTick(fetchedCurrentTime, trackBpm, 4, isTriplets);
    const barBeatTickObjDur = mathUtils.calculateBarBeatTick(fetchedDuration, trackBpm, 4, isTriplets);
    const trackLatencyMs = await (async () => {
      const targetEntry = wsInstances.find(entry => entry.id === 'inst');
      // 全インスタンスの計測を非同期で開始
      const measurementPromises = wsInstances.map(entry =>
        new Promise(resolve => setTimeout(() => resolve(entry.instance.getCurrentTime()), 0))
      );
      // 全結果を同時取得
      const results = await Promise.all(measurementPromises);
      const targetTime = results[wsInstances.indexOf(targetEntry)];
      // レイテンシ計算
      const latencyArray = results.map(t => (t - targetTime) * 1000);
      const maxLatency = Math.abs(mathUtils.arrayMaxAbsolute(latencyArray));
      return maxLatency;
    })();
    document.getElementById('sec2_infoText_upd').innerText = [
      `TimePos:  ${textCurrentTime} / ${textDuration}`,
      `SmplPos:  ${String(Math.round(fetchedCurrentTime * trackSampleRate)).padStart(9, ' ')} / ${String(Math.round(fetchedDuration * trackSampleRate)).padStart(9, ' ')} @ ${trackSampleRate} Hz`,
      `Beat:     ` + `${String(barBeatTickObj.bars).padStart(3, '0')}:${barBeatTickObj.beats}:${barBeatTickObj.beatsQuarter}:${String(barBeatTickObj.ticksQuarter).padStart(3, '0')}${barBeatTickObj.beatsQuarter - 1 === 0 && wsInstances[0].instance.isPlaying() ? '.' : ' '} / ` + `${String(barBeatTickObjDur.bars).padStart(3, '0')}:${barBeatTickObjDur.beats}:${barBeatTickObjDur.beatsQuarter}:${String(barBeatTickObjDur.ticksQuarter).padStart(3, '0')} ` + `(${trackBpm} bpm)`,
      `Latency:  ` + String(Math.ceil(trackLatencyMs)).padStart(9, ' ') + ' ms' + (trackLatencyMs > 15 ? ' [UNSTABLE]' : ''),
      // `BeatDisp: ${(() => {
      //   const barLength = Math.floor((infoTextUpd_fitCharCount - 3) / 4);
      //   return new Array(barBeatTickObj.beats).fill('█'.repeat(barLength)).join(' ');
      // })()}`,
      // `TickDisp: ${'█'.repeat(Math.ceil(infoTextUpd_fitCharCount * (barBeatTickObj.ticks / 1000)))}`
    ].join('\n');
    if (trackLatencyMs > 15) {
      console.warn('Track latency > 15. Sync triggered.');
      (() => {
        const targetTime = wsInstances.find(entry => entry.id === 'inst').instance.getCurrentTime();
        wsInstances.filter(entry => entry.id !== 'inst').forEach(entry => { entry.instance.setTime(targetTime) });
      })();
    }
    document.getElementById('sec2_infoText_upd_bigBeatDisp').innerText = `${String(barBeatTickObj.bars).padStart(3, '0')}:${barBeatTickObj.beats}:${barBeatTickObj.beatsQuarter}:${String(barBeatTickObj.ticksQuarter).padStart(3, '0')}${barBeatTickObj.beatsQuarter - 1 === 0 && wsInstances[0].instance.isPlaying() ? '.' : ''}`
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
