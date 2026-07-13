import { logger } from '../core/Logger.js';
import { eventBus } from '../core/EventBus.js';

/**
 * UIManager - DOM要素の取得をキャッシュし、毎フレームの
 * `querySelector` / `getElementById` の繰り返しを避けるためのクラス。
 *
 * 既存の script.js は、DOM取得のたびに `document.getElementById(...)` や
 * `document.querySelector(...)` を直接呼んでいる箇所が多数あります
 * (毎フレーム呼ばれるものも含まれるため、パフォーマンス改善の余地があります)。
 *
 * このクラスは「取得したら覚えておいて、次回以降はキャッシュを返す」だけの
 * シンプルな仕組みです。DOM要素が動的に入れ替わる(削除・再生成される)
 * 場合は `invalidate(key)` でキャッシュを破棄してから再取得してください。
 *
 * 重要: 現時点では script.js 側の既存DOM取得コードをこのクラスへ
 * 置き換える作業は「一部の代表的な要素」に留めています。
 * 10,000行超のファイル全体にある全てのDOM取得箇所を一度に置き換えるのは、
 * ブラウザでの目視確認ができないこの環境では、既存動作を壊すリスクが
 * 高すぎると判断したためです。段階的に(1画面/1機能ずつ)適用してください。
 *
 * @module managers/UIManager
 */
export class UIManager {
    constructor() {
        /** @type {Map<string, Element|null>} キー -> キャッシュ済み要素 */
        this.cache = new Map();
        /** @type {Map<string, string>} キー -> 取得に使ったセレクタ/ID(再取得用に記憶) */
        this.#lookupInfo = new Map();
    }

    /** @type {Map<string, {type: 'id'|'selector', value: string}>} */
    #lookupInfo;

    /**
     * `id`属性で要素を取得する(キャッシュ有り)。
     * @param {string} id - 取得したい要素のid(先頭に#は付けない)。
     * @returns {Element|null}
     */
    byId(id) {
        const key = `id:${id}`;
        if (this.cache.has(key)) return this.cache.get(key);
        const el = document.getElementById(id);
        this.cache.set(key, el);
        this.#lookupInfo.set(key, { type: 'id', value: id });
        if (!el) logger.debug(`[UIManager] byId("${id}") did not find an element yet.`);
        return el;
    }

    /**
     * CSSセレクタで要素を取得する(キャッシュ有り)。
     * @param {string} selector
     * @returns {Element|null}
     */
    query(selector) {
        const key = `q:${selector}`;
        if (this.cache.has(key)) return this.cache.get(key);
        const el = document.querySelector(selector);
        this.cache.set(key, el);
        this.#lookupInfo.set(key, { type: 'selector', value: selector });
        return el;
    }

    /**
     * 複数要素を取得する。NodeListは変化を追跡できないため、
     * こちらは呼び出しごとに再取得したい用途向けに敢えてキャッシュしない
     * (キャッシュしたい場合は `queryAllCached` を使う)。
     * @param {string} selector
     * @returns {NodeListOf<Element>}
     */
    queryAll(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * 複数要素の取得結果を配列としてキャッシュする。
     * @param {string} selector
     * @returns {Element[]}
     */
    queryAllCached(selector) {
        const key = `qa:${selector}`;
        if (this.cache.has(key)) return this.cache.get(key);
        const list = Array.from(document.querySelectorAll(selector));
        this.cache.set(key, list);
        this.#lookupInfo.set(key, { type: 'selector', value: selector });
        return list;
    }

    /**
     * 指定キーのキャッシュを破棄する(DOM要素が動的に再生成された場合に呼ぶ)。
     * @param {string} key - `byId`/`query`に渡したid/selector文字列と同じもの。
     * @param {'id'|'selector'} [type='id']
     * @returns {void}
     */
    invalidate(key, type = 'id') {
        this.cache.delete(`${type === 'id' ? 'id' : 'q'}:${key}`);
    }

    /**
     * 全キャッシュを破棄する(画面遷移時など、DOM構造が大きく変わったタイミングで使用)。
     * @returns {void}
     * @fires ui:cache-cleared
     */
    clearAll() {
        this.cache.clear();
        this.#lookupInfo.clear();
        eventBus.emit('ui:cache-cleared', {});
    }

    /**
     * トースト通知を表示する(既存の `showToast` 関数と同等のものを、
     * 将来こちらへ統合する想定の受け皿)。現時点では未実装(Phase 4のスコープ外)。
     * @param {string} message
     * @returns {void}
     */
    showToast(message) {
        logger.debug('[UIManager] showToast (stub):', message);
        eventBus.emit('ui:toast-requested', { message });
    }

    /**
     * デバッグ用: 現在キャッシュされているキー一覧を取得する。
     * @returns {string[]}
     */
    getCachedKeys() {
        return Array.from(this.cache.keys());
    }
}

/**
 * アプリ全体で共有するシングルトンUIManagerインスタンス。
 * ブラウザ環境以外では `document` が無いため生成しない。
 * @type {UIManager|null}
 */
export const uiManager = (typeof document !== 'undefined') ? new UIManager() : null;
