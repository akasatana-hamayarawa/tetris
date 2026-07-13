/**
 * storage.js - localStorageへの低レベルな安全アクセスヘルパー。
 *
 * SaveManager(スキーマバージョン管理・マイグレーション・バックアップを担当)とは異なり、
 * こちらは「例外を投げずに安全に読み書きする」ことだけを目的とした薄いラッパーです。
 * SaveManagerの内部実装からも利用できます。
 *
 * @module utils/storage
 */

/**
 * localStorageが利用可能かどうかを判定する(プライベートブラウジング等で
 * 例外が出るケースに対応)。
 * @param {Storage} [storage=window.localStorage]
 * @returns {boolean}
 */
export function isStorageAvailable(storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
    if (!storage) return false;
    try {
        const testKey = '__storage_test__';
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * 例外を投げずにJSON値を取得する。
 * @param {string} key
 * @param {any} [defaultValue=null]
 * @param {Storage} [storage=window.localStorage]
 * @returns {any}
 */
export function safeGetJSON(key, defaultValue = null, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
    if (!storage) return defaultValue;
    try {
        const raw = storage.getItem(key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw);
    } catch (err) {
        return defaultValue;
    }
}

/**
 * 例外を投げずにJSON値を保存する。
 * @param {string} key
 * @param {any} value
 * @param {Storage} [storage=window.localStorage]
 * @returns {boolean} 成功したか。
 */
export function safeSetJSON(key, value, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
    if (!storage) return false;
    try {
        storage.setItem(key, JSON.stringify(value));
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * 指定プレフィックスに一致するキーの一覧を取得する(セーブスロット一覧表示等に有用)。
 * @param {string} prefix
 * @param {Storage} [storage=window.localStorage]
 * @returns {string[]}
 */
export function listKeysWithPrefix(prefix, storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
    if (!storage) return [];
    const keys = [];
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(prefix)) keys.push(key);
    }
    return keys;
}

/**
 * localStorage全体の概算使用量(文字数)を計算する。容量逼迫の警告表示等に使える。
 * @param {Storage} [storage=window.localStorage]
 * @returns {number}
 */
export function estimateStorageUsage(storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
    if (!storage) return 0;
    let total = 0;
    for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        const value = storage.getItem(key) || '';
        total += key.length + value.length;
    }
    return total;
}
