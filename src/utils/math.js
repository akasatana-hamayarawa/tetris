/**
 * math.js - 数値計算に関する汎用ユーティリティ。
 * @module utils/math
 */

/**
 * 値を指定範囲内に収める。
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * 線形補間。
 * @param {number} start
 * @param {number} end
 * @param {number} t - 0〜1。
 * @returns {number}
 */
export function lerp(start, end, t) {
    return start + (end - start) * clamp(t, 0, 1);
}

/**
 * 値をa〜bの範囲からc〜dの範囲へ写像する。
 * @param {number} value
 * @param {number} a - 元の範囲の最小値。
 * @param {number} b - 元の範囲の最大値。
 * @param {number} c - 変換後の範囲の最小値。
 * @param {number} d - 変換後の範囲の最大値。
 * @returns {number}
 */
export function mapRange(value, a, b, c, d) {
    if (b === a) return c;
    return c + ((value - a) * (d - c)) / (b - a);
}

/**
 * 指定した小数桁で丸める。
 * @param {number} value
 * @param {number} [decimals=0]
 * @returns {number}
 */
export function roundTo(value, decimals = 0) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * 配列の合計値。
 * @param {number[]} values
 * @returns {number}
 */
export function sum(values) {
    return values.reduce((acc, v) => acc + v, 0);
}

/**
 * 配列の平均値(空配列は0)。
 * @param {number[]} values
 * @returns {number}
 */
export function average(values) {
    if (!values.length) return 0;
    return sum(values) / values.length;
}

/**
 * ミリ秒を "mm:ss.SSS" 形式の文字列に整形する(リプレイ・タイムアタック表示向け)。
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
    const totalMs = Math.max(0, Math.floor(ms));
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const millis = totalMs % 1000;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

/**
 * 数値を3桁区切りのカンマ付き文字列にする(スコア表示向け)。
 * @param {number} value
 * @returns {string}
 */
export function formatWithCommas(value) {
    return Math.round(value).toLocaleString('en-US');
}

/**
 * 0〜1の比率をパーセント表示文字列にする。
 * @param {number} ratio
 * @param {number} [decimals=0]
 * @returns {string}
 */
export function formatPercent(ratio, decimals = 0) {
    return `${roundTo(ratio * 100, decimals)}%`;
}
