/**
 * helpers.js - 汎用的なユーティリティ関数群。
 * @module utils/helpers
 */

/**
 * デバウンス処理(連続呼び出しの最後の1回だけ、指定時間後に実行する)。
 * 設定画面のスライダー入力等、頻繁な変更をまとめて保存したい場合に有用。
 * @param {Function} fn
 * @param {number} delayMs
 * @returns {Function & { cancel: () => void }}
 */
export function debounce(fn, delayMs) {
    let timerId = null;
    const debounced = (...args) => {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => { timerId = null; fn(...args); }, delayMs);
    };
    debounced.cancel = () => { if (timerId) { clearTimeout(timerId); timerId = null; } };
    return debounced;
}

/**
 * スロットル処理(指定時間内は最初の1回だけ実行し、以降は無視する)。
 * 毎フレーム呼ばれるイベント(resize等)の間引きに有用。
 * @param {Function} fn
 * @param {number} intervalMs
 * @returns {Function}
 */
export function throttle(fn, intervalMs) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= intervalMs) {
            lastCall = now;
            fn(...args);
        }
    };
}

/**
 * JSONシリアライズ可能な値をディープコピーする。
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

/**
 * 2つの値が(JSONシリアライズ可能な範囲で)構造的に等しいかを判定する。
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
export function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * 値が「空」かどうかを判定する(null/undefined/空文字/空配列/空オブジェクト)。
 * @param {any} value
 * @returns {boolean}
 */
export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * 配列を指定サイズごとの塊に分割する。
 * @template T
 * @param {T[]} array
 * @param {number} size
 * @returns {T[][]}
 */
export function chunk(array, size) {
    if (size <= 0) return [array];
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

/**
 * 配列から重複を除去する(プリミティブ値向け)。
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
export function uniqueArray(array) {
    return Array.from(new Set(array));
}

/**
 * オブジェクトから指定キーだけを取り出した新しいオブジェクトを作る。
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj) result[key] = obj[key];
    }
    return result;
}

/**
 * オブジェクトから指定キーを除いた新しいオブジェクトを作る。
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export function omit(obj, keys) {
    const excluded = new Set(keys);
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (!excluded.has(key)) result[key] = value;
    }
    return result;
}

/**
 * 非同期処理を指定時間だけ待機する(async/await向け)。
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 関数の実行を1回だけに制限する(2回目以降の呼び出しは初回の結果を返す)。
 * 初期化処理の重複実行防止に有用。
 * @param {Function} fn
 * @returns {Function}
 */
export function once(fn) {
    let called = false;
    let result;
    return (...args) => {
        if (!called) {
            called = true;
            result = fn(...args);
        }
        return result;
    };
}
