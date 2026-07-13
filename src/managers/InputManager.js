import { eventBus } from '../core/EventBus.js';
import { logger } from '../core/Logger.js';

/**
 * InputManager - キーボード/ゲームパッド入力を「論理アクション」へ正規化し、
 * EventBusへ発行するクラス。
 *
 * 設計方針(ARCHITECTURE.md 2章 InputManager の項):
 *   InputManagerはゲームルールを一切知らない。「Zキーが押された」ではなく
 *   「rotL(左回転)アクションが発生した」という論理イベントだけを発行する。
 *   実際に盤面をどう回転させるかはgame層の責務であり、InputManagerの関知するところではない。
 *
 * 既存の script.js は、キー入力の正規化(`cfg.keys`マッピングの適用)と、
 * ゲームへの反映(`p1.playerRotate()`呼び出し等)が同じ関数内に混在しています。
 * このクラスは「正規化の部分」だけを切り出したものです。
 *
 * 重要: 現時点では script.js 本体のキーボードイベントリスナーを
 * 置き換えていません。入力処理はゲームの反応速度に直結し、
 * ブラウザでの実機テストなしに置き換えるのは特にリスクが高いと判断したためです。
 * このクラスは、Phase 6(game層切り出し)と合わせて実際に統合することを推奨します。
 *
 * @module managers/InputManager
 */

/** @typedef {'left'|'right'|'soft'|'hard'|'rotR'|'rotL'|'hold'|'hold2'|'pause'|'retry'} LogicalAction */

export class InputManager {
    /**
     * @param {object} keyMap - 例: DEFAULT_SETTINGS.keys ({ left: 'ArrowLeft', ... })。
     * @param {object} [padKeyMap] - 例: DEFAULT_SETTINGS.padKeys ({ left: 14, ... })。
     */
    constructor(keyMap, padKeyMap = {}) {
        /** @type {object} */
        this.keyMap = keyMap;
        /** @type {object} */
        this.padKeyMap = padKeyMap;
        /** @type {Map<LogicalAction, boolean>} 現在押されているか */
        this.pressed = new Map();
        /** @type {Map<LogicalAction, number>} 押され始めた時刻(DAS計算用) */
        this.pressedAt = new Map();
        /** @type {Map<string, LogicalAction>} 生キー -> 論理アクション の逆引きキャッシュ */
        this.#reverseKeyMap = this.#buildReverseMap(keyMap);
        /** @type {Map<number, LogicalAction>} ゲームパッドボタン番号 -> 論理アクション の逆引きキャッシュ */
        this.#reversePadMap = this.#buildReversePadMap(padKeyMap);
    }

    /** @type {Map<string, LogicalAction>} */
    #reverseKeyMap;
    /** @type {Map<number, LogicalAction>} */
    #reversePadMap;

    /**
     * @param {object} keyMap
     * @returns {Map<string, LogicalAction>}
     */
    #buildReverseMap(keyMap) {
        const map = new Map();
        for (const [action, key] of Object.entries(keyMap || {})) {
            map.set(key, /** @type {LogicalAction} */ (action));
        }
        return map;
    }

    /**
     * @param {object} padKeyMap
     * @returns {Map<number, LogicalAction>}
     */
    #buildReversePadMap(padKeyMap) {
        const map = new Map();
        for (const [action, buttonIndex] of Object.entries(padKeyMap || {})) {
            map.set(buttonIndex, /** @type {LogicalAction} */ (action));
        }
        return map;
    }

    /**
     * キー設定が変更された時に呼ぶ(SettingsManagerの`settings:changed`購読側から呼び出す想定)。
     * @param {object} keyMap
     * @param {object} [padKeyMap]
     * @returns {void}
     */
    updateKeyMap(keyMap, padKeyMap = this.padKeyMap) {
        this.keyMap = keyMap;
        this.padKeyMap = padKeyMap;
        this.#reverseKeyMap = this.#buildReverseMap(keyMap);
        this.#reversePadMap = this.#buildReversePadMap(padKeyMap);
    }

    /**
     * 生のキーボードイベントのkey文字列から、対応する論理アクションを取得する。
     * @param {string} rawKey - `event.key` の値。
     * @returns {LogicalAction|undefined}
     */
    resolveKey(rawKey) {
        return this.#reverseKeyMap.get(rawKey);
    }

    /**
     * ゲームパッドのボタン番号から、対応する論理アクションを取得する。
     * @param {number} buttonIndex
     * @returns {LogicalAction|undefined}
     */
    resolvePadButton(buttonIndex) {
        return this.#reversePadMap.get(buttonIndex);
    }

    /**
     * キーが押された時に呼ぶ(呼び出し側でrawKey→アクション解決を任せず、
     * このメソッド内で解決からイベント発行まで完結させる)。
     * 既に押下中のアクションを再度渡した場合(キーリピート)は無視する。
     * @param {string} rawKey
     * @param {number} [timestamp=performance.now()]
     * @returns {LogicalAction|null} 解決されたアクション(未割り当てキーならnull)。
     * @fires input:action-down
     */
    handleKeyDown(rawKey, timestamp = performance.now()) {
        const action = this.resolveKey(rawKey);
        if (!action) return null;
        if (this.pressed.get(action)) return action; // キーリピートは無視

        this.pressed.set(action, true);
        this.pressedAt.set(action, timestamp);
        eventBus.emit('input:action-down', { action, rawKey, timestamp });
        return action;
    }

    /**
     * キーが離された時に呼ぶ。
     * @param {string} rawKey
     * @param {number} [timestamp=performance.now()]
     * @returns {LogicalAction|null}
     * @fires input:action-up
     */
    handleKeyUp(rawKey, timestamp = performance.now()) {
        const action = this.resolveKey(rawKey);
        if (!action) return null;

        this.pressed.set(action, false);
        this.pressedAt.delete(action);
        eventBus.emit('input:action-up', { action, rawKey, timestamp });
        return action;
    }

    /**
     * 現在そのアクションが押されているか。
     * @param {LogicalAction} action
     * @returns {boolean}
     */
    isPressed(action) {
        return !!this.pressed.get(action);
    }

    /**
     * そのアクションが押され始めてから何ミリ秒経過したか(DAS計算用)。
     * @param {LogicalAction} action
     * @param {number} [now=performance.now()]
     * @returns {number|null} 押されていない場合はnull。
     */
    getHeldDuration(action, now = performance.now()) {
        const startedAt = this.pressedAt.get(action);
        if (startedAt === undefined) return null;
        return now - startedAt;
    }

    /**
     * 全ての押下状態をリセットする(ウィンドウのフォーカス喪失時等、
     * キーアップイベントを取りこぼした際の保険として使用)。
     * @returns {void}
     */
    resetAll() {
        this.pressed.clear();
        this.pressedAt.clear();
    }
}
