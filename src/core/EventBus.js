/**
 * EventBus - Manager間の疎結合な通信を仲介するpub/subシステム。
 *
 * 設計方針(ARCHITECTURE.md 3章 参照):
 *   - Manager同士は基本的に直接importし合わない。
 *   - 何かをしてほしい時は、直接メソッドを呼ぶ代わりにイベントを発行(emit)する。
 *   - イベント名は `<ドメイン>:<動詞または状態>` 形式(例: "game:line-cleared")。
 *
 * このファイルは新規追加のみで、既存の script.js には一切影響しません。
 *
 * @module core/EventBus
 */

export class EventBus {
    /** @type {Map<string, Set<Function>>} イベント名 -> ハンドラ集合 */
    #listeners = new Map();

    /** @type {Map<string, Set<Function>>} 一度だけ実行されるハンドラ集合 */
    #onceListeners = new Map();

    /** @type {number} 発行された累計イベント数(Developer Modeの「Events/sec」計測用) */
    #emitCount = 0;

    /**
     * イベントを購読する。
     * @param {string} eventName - 購読するイベント名。
     * @param {(payload: any) => void} handler - イベント発行時に呼ばれる関数。
     * @returns {() => void} 購読解除用の関数(呼び出すと off() と同じ効果)。
     */
    on(eventName, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError(`EventBus.on: handler must be a function (event: "${eventName}")`);
        }
        if (!this.#listeners.has(eventName)) {
            this.#listeners.set(eventName, new Set());
        }
        this.#listeners.get(eventName).add(handler);
        return () => this.off(eventName, handler);
    }

    /**
     * 一度だけ実行される購読を登録する。
     * @param {string} eventName - 購読するイベント名。
     * @param {(payload: any) => void} handler - 一度だけ呼ばれる関数。
     * @returns {() => void} 購読解除用の関数。
     */
    once(eventName, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError(`EventBus.once: handler must be a function (event: "${eventName}")`);
        }
        if (!this.#onceListeners.has(eventName)) {
            this.#onceListeners.set(eventName, new Set());
        }
        this.#onceListeners.get(eventName).add(handler);
        return () => {
            const set = this.#onceListeners.get(eventName);
            if (set) set.delete(handler);
        };
    }

    /**
     * イベント購読を解除する。
     * @param {string} eventName - 対象のイベント名。
     * @param {(payload: any) => void} handler - 解除するハンドラ(on() に渡したものと同一参照であること)。
     * @returns {void}
     */
    off(eventName, handler) {
        const set = this.#listeners.get(eventName);
        if (set) set.delete(handler);
    }

    /**
     * イベントを発行し、購読している全ハンドラを呼び出す。
     * ハンドラ内で例外が発生しても、他のハンドラの実行は継続する(1つのバグで全体が止まらないようにするため)。
     * @param {string} eventName - 発行するイベント名。
     * @param {any} [payload] - ハンドラへ渡すデータ。
     * @returns {void}
     */
    emit(eventName, payload) {
        this.#emitCount++;

        const set = this.#listeners.get(eventName);
        if (set) {
            for (const handler of Array.from(set)) {
                this.#safeInvoke(handler, payload, eventName);
            }
        }

        const onceSet = this.#onceListeners.get(eventName);
        if (onceSet && onceSet.size) {
            const toRun = Array.from(onceSet);
            onceSet.clear();
            for (const handler of toRun) {
                this.#safeInvoke(handler, payload, eventName);
            }
        }
    }

    /**
     * 指定イベントの購読を全て解除する(主にテスト・Manager破棄時に使用)。
     * @param {string} eventName - 対象のイベント名。
     * @returns {void}
     */
    clear(eventName) {
        this.#listeners.delete(eventName);
        this.#onceListeners.delete(eventName);
    }

    /**
     * Developer Mode用: これまでに発行されたイベントの累計数を取得する。
     * @returns {number}
     */
    getEmitCount() {
        return this.#emitCount;
    }

    /**
     * ハンドラを例外安全に呼び出す内部ヘルパー。
     * @param {Function} handler
     * @param {any} payload
     * @param {string} eventName
     * @returns {void}
     */
    #safeInvoke(handler, payload, eventName) {
        try {
            handler(payload);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`[EventBus] handler for "${eventName}" threw an error:`, err);
        }
    }
}

/**
 * アプリ全体で共有するシングルトンEventBusインスタンス。
 * 各Managerはこれをimportして使う。
 * @type {EventBus}
 */
export const eventBus = new EventBus();
