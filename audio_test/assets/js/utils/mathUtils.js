export default {
  arrayMax(array) {
    return array.reduce((a, b) => Math.max(a, b));
  },

  arrayMin(array) {
    return array.reduce((a, b) => Math.min(a, b));
  },

  arrayTotal(array) {
    return array.reduce((acc, f) => acc + f, 0);
  },

  arrayAvg(array) {
    return this.arrayTotal(array) / array.length;
  },

  rounder(method, num, n) {
    const pow = Math.pow(10, n);
    let result;
    switch (method) {
      case 'floor':
        result = Math.floor(num * pow) / pow;
        break;
      case 'ceil':
        result = Math.ceil(num * pow) / pow;
        break;
      case 'round':
        result = Math.round(num * pow) / pow;
        break;
    }
    return {
      orig: result,
      padded: result.toFixed(n),
    };
  },

  formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 byte';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  formatFileSizeFixedUnit(
    bytes,
    unit = 'MiB',
    decimals = 2,
  ) {
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const i = sizes.indexOf(unit);
    return (bytes / Math.pow(k, i)).toFixed(dm) + ' ' + sizes[i];
  },

  calculateBarBeatTick(seconds, bpm, timeSignature = 4) {
    // 1拍の長さを計算 (60秒 / BPM)
    const beatLength = 60 / bpm;
    // 総拍数を計算
    const totalBeats = seconds / beatLength;
    // 小節数を計算 (総拍数 / 拍子)
    const bars = Math.floor(totalBeats / timeSignature);
    // 残りの拍数を計算
    const remainingBeats = totalBeats % timeSignature;
    // ティックを計算 (0-999)
    const ticks = Math.floor((remainingBeats - Math.floor(remainingBeats)) * 1000);
    return {
      bars: bars + 1,
      beats: Math.floor(remainingBeats) + 1,
      ticks: ticks
    };
  }
};
