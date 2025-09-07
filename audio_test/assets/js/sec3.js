import ky from 'https://cdn.jsdelivr.net/npm/ky/+esm';
import howler from 'https://cdn.jsdelivr.net/npm/howler@2/+esm';
import { DateTime } from 'https://cdn.jsdelivr.net/npm/luxon@3.5/+esm';
import mathUtils from './utils/mathUtils.js';

export async function sec3_functions() {
  // トラック情報の定義
  const createAudioFileList = (basePath, bitrateList, sizeList, originalBitrate, originalSize, fileNamePrefix, fileExt, fileCodec, fileMime) => {
    return [
      ...bitrateList.map((bitrate, i) => ({
        path: `${basePath}/${fileNamePrefix}_${bitrate}`,
        orig: false,
        ext: fileExt,
        codec: fileCodec,
        mime: fileMime, // 'audio/webm; codecs=opus',
        bitrate: bitrate * 1000,
        size: sizeList[i]
      })),
      {
        path: `${basePath}/original`,
        orig: true,
        ext: 'flac',
        codec: 'flac',
        mime: 'audio/flac',
        bitrate: originalBitrate,
        size: originalSize
      }
    ];
  };

  const trackInfoList = [
    {
      title: 'Flirting With June',
      author: 'Les Gordon',
      triplets: false,
      sRate: 48000,
      mainTargetCodec: 'opus',
      audioFileList: createAudioFileList(
        './assets/audio/encode_compare/flirting_with_june',
        [6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 192],
        [173144, 206349, 299957, 390230, 527212, 626907, 812055, 999570, 1188100, 1378430, 1559293, 1938252, 2310997, 3048950, 4475237],
        1811535, 36230866, 'opus', 'webm', 'opus', 'audio/webm; codecs=opus'
      )
    },
    {
      title: 'Winding Through Avidya',
      author: 'HOYO-MiX',
      triplets: false,
      sRate: 48000,
      mainTargetCodec: 'opus',
      audioFileList: createAudioFileList(
        './assets/audio/encode_compare/winding_through_avidya',
        [6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 192],
        [132207, 162226, 229183, 296406, 391285, 462215, 593715, 726585, 863622, 1008258, 1145450, 1425323, 1695927, 2227312, 3260381],
        1579776, 25284693, 'opus', 'webm', 'opus', 'audio/webm; codecs=opus'
      )
    },
    {
      title: 'Esperanza (Opus)',
      author: 'Mameyudoufu',
      triplets: false,
      sRate: 48000,
      mainTargetCodec: 'opus',
      audioFileList: createAudioFileList(
        './assets/audio/encode_compare/esperanza',
        [6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 192],
        [74729, 90825, 123771, 161342, 208066, 247799, 323711, 400395, 477109, 556003, 632795, 783199, 935126, 1241370, 1845556],
        1820381, 16227553, 'opus', 'webm', 'opus', 'audio/webm; codecs=opus'
      )
    },
    {
      title: 'Esperanza (Vorbis) !UNSTABLE!',
      author: 'Mameyudoufu',
      triplets: false,
      sRate: 48000,
      mainTargetCodec: 'vorbis',
      audioFileList: createAudioFileList(
        './assets/audio/encode_compare/esperanza',
        [32, 40, 48, 56, 64, 80, 96, 128, 192],
        [335632, 385831, 480233, 528460, 644608, 826090, 1012356, 1385939, 2034505],
        1820381, 16227553, 'vorbis', 'ogg', 'vorbis', 'audio/ogg'
      )
    },
    {
      title: 'Dreaming of Me',
      author: 'Jack Shore, Tollef',
      triplets: false,
      sRate: 48000,
      mainTargetCodec: 'opus',
      audioFileList: createAudioFileList(
        './assets/audio/encode_compare/dreaming_of_me',
        [6, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 192],
        [200899, 239571, 316106, 411130, 547472, 647790, 842077, 1036729, 1232639, 1431935, 1625883, 2022665, 2420912, 3210653, 4768934],
        990804, 23012161, 'opus', 'webm', 'opus', 'audio/webm; codecs=opus'
      )
    },
  ];
  // トラック選択の初期化
  let currentTrackIndex = 0;
  const initializeTrackSelect = () => {
    const selectFormEl = document.getElementById('sec3_audioSourceSelectList');
    const optionElArray = [];
    trackInfoList.forEach((trackInfoEntry, index) => {
      const optionEl = document.createElement('option');
      optionEl.value = index;
      optionEl.text = `${trackInfoEntry.title} (${trackInfoEntry.mainTargetCodec})`;
      optionElArray.push(optionEl);
    });
    optionElArray[0].selected = true;
    selectFormEl.append(...optionElArray);
    currentTrackIndex = parseInt(document.getElementById('sec3_audioSourceSelectList').value);
  };
  initializeTrackSelect();

  // トラック選択変更時の処理
  document.getElementById('sec3_audioSourceSelectList').addEventListener('change', async (event) => {
    const newTrackIndex = parseInt(event.target.value);

    // 現在の全ての音声を停止してインスタンスを破棄
    howlInstances.forEach(entry => {
      if (entry.instance) {
        entry.instance.stop();
        // Howler.jsのインスタンス破棄
        entry.instance.unload();
      }
    });

    // 配列をクリア
    howlInstances.length = 0;

    // UIをロード状態に戻す
    allButtonDisableChange();
    document.getElementById('sec3_loadSection').classList.remove('d-none');
    document.getElementById('sec3_content').classList.add('d-none');
    document.getElementById('sec3_progressbar_load').classList.remove('d-none');
    document.querySelector('#sec3_progressbar_load div').style.width = '0%';
    document.querySelector('#sec3_progressbar_load div').innerText = '';

    // 再生ボタンの状態を停止状態に戻す
    buttonEl.playPause.checked = false;
    const iconEl = document.querySelector('label[for="sec3_button_playPause"]').querySelector('i');
    iconEl.classList.remove('bi-pause-fill');
    iconEl.classList.add('bi-play-fill');

    // 現在のトラックインデックスを更新
    currentTrackIndex = newTrackIndex;

    // 新しいトラックの音声をダウンロード
    loadedInstanceCount = 0;
    isFirstPlay = true;
    downloadedAudioBlobArray = await audioDownloadFunc();

    // 新しいインスタンスをロード
    await loadAudioInstances();

    // プレイヤー情報をリセット
    document.getElementById('sec3_infoText_upd').innerText = 'TimePos:  --:--.--- / --:--.---\nSmplPos:  --------- / ---------';
    document.getElementById('sec3_infoText_upd_bigBeatDisp').innerText = '--:-- .---';
  });

  // ボタン要素の取得
  const buttonEl = {
    load: document.getElementById('sec3_button_load'),
    playPause: document.getElementById('sec3_button_playPause'),
    stop: document.getElementById('sec3_button_stop'),
    skipStart: document.getElementById('sec3_button_skipStart'),
    skipEnd: document.getElementById('sec3_button_skipEnd'),
    skipRewind: document.getElementById('sec3_button_skipRewind'),
    skipForward: document.getElementById('sec3_button_skipForward'),
    syncTrack: document.getElementById('sec3_button_syncTrack'),
  };
  // ボタンの状態制御
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

  // UI初期化
  buttonEl.load.classList.remove('d-flex');
  buttonEl.load.classList.add('d-none');
  document.getElementById('sec3_progressbar_load').classList.remove('d-none');
  const howlInstances = [];
  let loadedInstanceCount = 0;
  let isFirstPlay = true;
  let totalDownloadedBytesCount = 0;
  let downloadedAudioBlobArray = [];

  // 音量制御機能
  const volumeControlFunc = () => {
    const selectedQualityValue = parseInt(document.getElementById('sec3_audioPlayerControl_quality_slider').value);
    Object.entries(howlInstances).filter(_ => _[0] !== `${selectedQualityValue}`).map(_ => _[1]).forEach(entry => { entry.instance.volume(0) });
    Object.entries(howlInstances).filter(_ => _[0] === `${selectedQualityValue}`).map(_ => _[1]).forEach(entry => { entry.instance.volume(1) });
  };

  // 品質スライダーのイベントリスナー
  document.getElementById('sec3_audioPlayerControl_quality_slider').addEventListener('input', () => {
    const textArray = trackInfoList[currentTrackIndex].audioFileList.map(obj => `${Math.round(obj.bitrate / 1000)} kbps ${obj.codec}`);
    document.getElementById('sec3_audioPlayerControl_quality_number').value = textArray[parseInt(document.getElementById('sec3_audioPlayerControl_quality_slider').value, 10)];
    volumeControlFunc();
  });

  // 音声ダウンロード機能
  const audioDownloadFunc = async () => {
    totalDownloadedBytesCount = 0;
    const audioFileList = trackInfoList[currentTrackIndex].audioFileList;
    const trackTotalFileSize = mathUtils.arrayTotal(audioFileList.map(obj => obj.size));

    const audioDownloadInnerFunc = async (audioFileObject) => {
      const response = await ky(`${audioFileObject.path}.${audioFileObject.ext}`, { method: 'get', timeout: false });
      const reader = response.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalDownloadedBytesCount += value.length;
        document.querySelector('#sec3_progressbar_load div').style.width = `${(totalDownloadedBytesCount / trackTotalFileSize) * 100}%`;
        document.querySelector('#sec3_progressbar_load div').innerText = `${Math.floor(totalDownloadedBytesCount / 1024).toLocaleString().padStart(6, ' ')} KiB / ${Math.ceil(trackTotalFileSize / 1024).toLocaleString().padStart(6, ' ')} KiB`
        chunks.push(value);
      }

      return new Blob(chunks, { type: audioFileObject.mime });
    };

    const downloadedBlobs = await Promise.all(
      audioFileList.map(audioFileObject => audioDownloadInnerFunc(audioFileObject))
    );
    return downloadedBlobs;
  };

  downloadedAudioBlobArray = await audioDownloadFunc();
  console.log(downloadedAudioBlobArray);

  // ロード完了チェック機能
  const checkAllLoaded = () => {
    loadedInstanceCount++;
    document.querySelector('#sec3_progressbar_load div').style.width = `${(loadedInstanceCount / trackInfoList[currentTrackIndex].audioFileList.length) * 100}%`;
    document.querySelector('#sec3_progressbar_load div').innerText = 'Initializing audio engine ...';
    if (loadedInstanceCount === trackInfoList[currentTrackIndex].audioFileList.length) {
      console.log('Bitrate Compare Test - ALL LOADED');
      allButtonEnableChange();
      document.getElementById('sec3_audioPlayerControl_quality_slider').max = trackInfoList[currentTrackIndex].audioFileList.length - 1;
      document.getElementById('sec3_audioPlayerControl_quality_slider').value = 0;
      document.getElementById('sec3_audioPlayerControl_quality_slider').dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      document.getElementById('sec3_loadSection').classList.add('d-none');
      document.getElementById('sec3_content').classList.remove('d-none');
      console.log(howlInstances);
    }
  };

  // 音声ロード機能
  const loadAudioInstances = async () => {
    // Load all audio variant
    for (const [index, audioBlob] of Object.entries(downloadedAudioBlobArray)) {
      const blobUrl = URL.createObjectURL(audioBlob);
      const audioFileObj = trackInfoList[currentTrackIndex].audioFileList[index];
      const howl = new howler.Howl({
        src: [blobUrl],
        preload: false,
        autoplay: false,
        format: audioFileObj.codec,
        onend: function () {
          // トラックが終了したら先頭に戻ってループ再生
          if (buttonEl.playPause.checked) {
            howlInstances.forEach(entry => {
              entry.instance.seek(0);
              entry.instance.play(entry.soundId);
            });
            // 表示を更新
            infoTextUpdFunc();
          }
        }
      });

      howlInstances.push({ instance: howl, soundId: null });

      howl.on('load', () => {
        console.log('Loaded audio: ' + `${audioFileObj.codec} (${audioFileObj.ext}), ${Math.round(audioFileObj.bitrate / 1000)} kbps`);
        URL.revokeObjectURL(blobUrl);
        checkAllLoaded();
      });

      howl.load();
    }
  };

  await loadAudioInstances();

  document.getElementById('sec3_infoText_upd').innerText = 'TimePos:  --:--.--- / --:--.---\nSmplPos:  --------- / ---------';
  document.getElementById('sec3_infoText_upd_bigBeatDisp').innerText = '--:--.---';

  // プレイヤーコントロール機能
  const initializePlayerControls = () => {
    // Initialize event listener for player control button
    const iconEl = document.querySelector('label[for="sec3_button_playPause"]').querySelector('i');

    document.querySelector('label[for="sec3_button_playPause"]').addEventListener('click', async () => {
      if (buttonEl.playPause.checked) {
        howlInstances.forEach(entry => { entry.instance.pause(entry.soundId) });
        iconEl.classList.remove('bi-pause-fill');
        iconEl.classList.add('bi-play-fill');
      } else {
        howlInstances.forEach(entry => {
          if (isFirstPlay) {
            const soundId = entry.instance.play();
            entry.soundId = soundId;
          } else {
            entry.instance.play(entry.soundId);
          }
        });

        if (isFirstPlay) {
          isFirstPlay = false;
        }

        if (howlInstances[0].instance.seek() === howlInstances[0].instance.duration()) {
          howlInstances.forEach(entry => { entry.instance.seek(0) });
        }

        infoTextUpdLooperFunc();
        iconEl.classList.remove('bi-play-fill');
        iconEl.classList.add('bi-pause-fill');
      }
    });

    buttonEl.stop.addEventListener('click', () => {
      howlInstances.forEach(entry => { entry.instance.stop() });
      buttonEl.playPause.checked = false;
      infoTextUpdFunc();
      iconEl.classList.remove('bi-pause-fill');
      iconEl.classList.add('bi-play-fill');
    });

    buttonEl.skipStart.addEventListener('click', () => {
      howlInstances.forEach(entry => { entry.instance.seek(0) });
      infoTextUpdFunc();
    });

    buttonEl.skipEnd.addEventListener('click', () => {
      howlInstances.forEach(entry => { entry.instance.seek(entry.instance.duration()) });
      infoTextUpdFunc();
    });

    buttonEl.skipRewind.addEventListener('click', () => {
      const currentTime = howlInstances[0].instance.seek();
      const targetTime = currentTime - 2;
      howlInstances.forEach(entry => { entry.instance.seek(targetTime) });
      infoTextUpdFunc();
    });

    buttonEl.skipForward.addEventListener('click', () => {
      const currentTime = howlInstances[0].instance.seek();
      const targetTime = currentTime + 2;
      howlInstances.forEach(entry => { entry.instance.seek(targetTime) });
      infoTextUpdFunc();
    });

    buttonEl.syncTrack.addEventListener('click', () => {
      const targetTime = howlInstances[0].instance.seek();
      Object.entries(howlInstances).filter(_ => _[0] !== '0').map(_ => _[1]).forEach(entry => { entry.instance.seek(targetTime) });
      infoTextUpdFunc();
    });
  };

  initializePlayerControls();
  window.howlInstances = howlInstances;

  // 情報表示更新機能
  const infoTextUpdFunc = async () => {
    const fetchedDuration = howlInstances[0].instance.duration();
    const fetchedCurrentTime = howlInstances[0].instance.seek();
    const textCurrentTime = DateTime.fromMillis(fetchedCurrentTime * 1000).toFormat('mm:ss.SSS');
    const textCurrentTimeForBigDisp = DateTime.fromMillis(fetchedCurrentTime * 1000).toFormat('mm:ss. SSS');
    const textDuration = DateTime.fromMillis(fetchedDuration * 1000).toFormat('mm:ss.SSS');
    const trackSampleRate = trackInfoList[currentTrackIndex].sRate;

    const trackLatencyMs = await (async () => {
      const targetEntry = howlInstances[0];
      // 全インスタンスの計測を非同期で開始
      const measurementPromises = howlInstances.map(entry =>
        new Promise(resolve => setTimeout(() => resolve(entry.instance.seek()), 0))
      );
      // 全結果を同時取得
      const results = await Promise.all(measurementPromises);
      const targetTime = results[howlInstances.indexOf(targetEntry)];
      // レイテンシ計算
      const latencyArray = results.map(t => (t - targetTime) * 1000);
      const maxLatency = Math.abs(mathUtils.arrayMaxAbsolute(latencyArray));
      return maxLatency;
    })();

    document.getElementById('sec3_infoText_upd').innerText = [
      `TimePos:  ${textCurrentTime} / ${textDuration}`,
      `SmplPos:  ${String(Math.round(fetchedCurrentTime * trackSampleRate)).padStart(9, ' ')} / ${String(Math.round(fetchedDuration * trackSampleRate)).padStart(9, ' ')} @ ${trackSampleRate} Hz`,
      `Latency:  ` + String(mathUtils.rounder('ceil', trackLatencyMs, 3).padded).padStart(9, ' ') + ' ms' + (trackLatencyMs > 15 ? ' [UNSTABLE]' : ''),
    ].join('\n');

    if (trackLatencyMs > 15) {
      console.warn('Track latency > 15. Sync triggered.');
      (() => {
        const targetTime = howlInstances[0].instance.seek();
        Object.entries(howlInstances).filter(_ => _[0] !== '0').map(_ => _[1]).forEach(entry => { entry.instance.seek(targetTime) });
      })();
    }

    document.getElementById('sec3_infoText_upd_bigBeatDisp').innerText = `${textCurrentTimeForBigDisp}`;
  };

  const infoTextUpdLooperFunc = async () => {
    while (howlInstances[0].instance.playing()) {
      await infoTextUpdFunc();
      if (!howlInstances[0].instance.playing()) break;
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  };
}
