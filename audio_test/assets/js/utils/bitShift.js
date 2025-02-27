/**
 * booleanの配列を32bit整数値の配列に変換する
 * @param boolArray booleanの配列
 * @returns 32bitずつに区切られた整数値の配列
 */
function booleanArrayToIntArray(boolArray) {
  const result = []; // 結果の整数配列
  let currentInt = 0; // 一時的な現在の整数
  let bitIndex = 0; // ビットインデックスは0から開始する
  for (let i = 0; i < boolArray.length; i++) {
    if (boolArray[i]) {
      // bool値がtrueの場合
      currentInt |= 1 << bitIndex; // 現在の整数に対応するビットで1を立てる
    }
    bitIndex++; //次のビットに移動
    if (bitIndex === 32) {
      // 32ビットの整数を満たした場合
      result.push(currentInt); // 一時的な整数を結果の整数配列に追加
      currentInt = 0; // 一時的な整数はリセット
      bitIndex = 0; // ビットインデックスもリセット
    }
  }
  // 残ったビットを適当に結果にくっつける (32ビットに満たない場合)
  if (bitIndex > 0) {
    result.push(currentInt);
  }
  return result;
}

/**
 * 32bit整数値の配列をbooleanの配列に変換する
 * @param intArray 32bitずつに区切られた整数値の配列
 * @returns booleanの配列
 */
function intArrayToBooleanArray(intArray) {
  const result = []; // 結果のboolean配列
  for (const int of intArray) {
    // 各整数のビットを32bit分チェックする
    for (let bitIndex = 0; bitIndex < 32; bitIndex++) {
      // 現在のビットが立っているか確認し、結果配列にbooleanとして追加
      const bitValue = (int & (1 << bitIndex)) !== 0;
      result.push(bitValue);
    }
  }
  return result;
}

/**
 * boolean配列の末尾にある連続したfalseを削除する
 * @param arr booleanの配列
 * @returns
 */
function trimFalseAtEnd(arr) {
  // 配列の終端からfalseを削除
  while (arr.length > 0 && arr[arr.length - 1] === false) {
    // 配列の長さが1以上かつ配列の終端要素がfalseである間は繰り返す
    arr.pop(); // 配列の終端要素を抹消goodbyeしてfalseくんを昇天させる
  }
  return arr;
}

export default {
  booleanArrayToIntArray,
  intArrayToBooleanArray,
  trimFalseAtEnd,
};
