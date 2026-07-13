import { logger } from '../core/Logger.js';

/**
 * AnimationManager - CSSアニメーションクラスの付与/解除と、
 * JavaScriptベースのアニメーション(requestAnimationFrameを使ったトゥイーン)を
 * 一元管理するクラス。
 *
 * 既存の script.js / style.css には、既にいくつかCSSアニメーションが
 * 実装されています(例: `.admin-fx-shake`等、Admin Cheat拡張で追加したもの)。
 * このクラスは、それらを直接置き換えるのではなく、「今後アニメーションを
 * 追加・管理する時の共通の窓口」として用意しています。
 *
 * @module managers/AnimationManager
 */
export class AnimationManager {
    constructor() {
        /** @type {Map<number, {startTime: number, duration: number, onUpdate: (t: number) => void, onComplete?: () => void, easing: (t: number) => number}>} */
        this.activeTweens = new Map();
        /** @type {number} 次に発行するトゥイーンID */
        this.#nextId = 1;
        /** @type {number|null} requestAnimationFrameのID */
        this.#rafId = null;
    }

    /** @type {number} */
    #nextId;
    /** @type {number|null} */
    #rafId;

    /**
     * 要素にCSSアニメーション用クラスを付与する。
     * @param {Element} el
     * @param {string} className
     * @returns {void}
     */
    addClass(el, className) {
        if (el && el.classList) el.classList.add(className);
    }

    /**
     * 要素からCSSアニメーション用クラスを解除する。
     * @param {Element} el
     * @param {string} className
     * @returns {void}
     */
    removeClass(el, className) {
        if (el && el.classList) el.classList.remove(className);
    }

    /**
     * 一定時間だけクラスを付与し、自動的に解除する
     * (「一瞬光らせる」ような単発演出向け)。
     * @param {Element} el
     * @param {string} className
     * @param {number} durationMs
     * @returns {void}
     */
    pulseClass(el, className, durationMs) {
        this.addClass(el, className);
        setTimeout(() => this.removeClass(el, className), durationMs);
    }

    /**
     * JSベースのトゥイーンを開始する(CSSでは表現しづらい、数値の補間が必要な演出向け)。
     * @param {object} options
     * @param {number} options.duration - ミリ秒。
     * @param {(t: number) => void} options.onUpdate - 0〜1のイージング済み進行度を受け取るコールバック。
     * @param {() => void} [options.onComplete] - 完了時に呼ばれるコールバック。
     * @param {(t: number) => number} [options.easing] - イージング関数(デフォルトは線形)。
     * @returns {number} トゥイーンID(cancelTweenに渡せる)。
     */
    tween({ duration, onUpdate, onComplete, easing = (t) => t }) {
        const id = this.#nextId++;
        this.activeTweens.set(id, { startTime: performance.now(), duration, onUpdate, onComplete, easing });
        this.#ensureLoop();
        return id;
    }

    /**
     * 実行中のトゥイーンを途中で中断する。
     * @param {number} id
     * @returns {void}
     */
    cancelTween(id) {
        this.activeTweens.delete(id);
    }

    /**
     * requestAnimationFrameループを開始する(既に動いていれば何もしない)。
     * @returns {void}
     */
    #ensureLoop() {
        if (this.#rafId !== null) return;
        const step = (now) => {
            if (this.activeTweens.size === 0) {
                this.#rafId = null;
                return;
            }
            for (const [id, tween] of Array.from(this.activeTweens.entries())) {
                const elapsed = now - tween.startTime;
                const rawT = Math.min(1, elapsed / tween.duration);
                const easedT = tween.easing(rawT);
                try {
                    tween.onUpdate(easedT);
                } catch (err) {
                    logger.error('[AnimationManager] tween onUpdate threw:', err);
                }
                if (rawT >= 1) {
                    this.activeTweens.delete(id);
                    if (tween.onComplete) {
                        try { tween.onComplete(); } catch (err) { logger.error('[AnimationManager] tween onComplete threw:', err); }
                    }
                }
            }
            this.#rafId = requestAnimationFrame(step);
        };
        this.#rafId = requestAnimationFrame(step);
    }

    /**
     * 実行中の全トゥイーンを停止する(画面遷移時のクリーンアップ用)。
     * @returns {void}
     */
    cancelAll() {
        this.activeTweens.clear();
        if (this.#rafId !== null) {
            cancelAnimationFrame(this.#rafId);
            this.#rafId = null;
        }
    }
}

/**
 * よく使うイージング関数集。
 * @type {Record<string, (t: number) => number>}
 */
export const Easing = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeOutBack: (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2)
};

/**
 * アプリ全体で共有するシングルトンAnimationManagerインスタンス。
 * @type {AnimationManager}
 */
export const animationManager = new AnimationManager();
