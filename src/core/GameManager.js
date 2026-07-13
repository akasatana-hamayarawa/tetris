import { GameState, isTransitionAllowed } from './GameState.js';
import { eventBus } from './EventBus.js';
import { logger } from './Logger.js';

/**
 * GameManager - 唯一のオーケストレーター。
 *
 * ARCHITECTURE.md 2章・11章の設計方針:
 *   - 全Managerの生成・初期化・終了・GameState変更を担当する「唯一」のクラス。
 *   - Manager同士は直接依存せず、GameManagerが依存性注入するか、EventBus経由で連携する。
 *   - GameStateを変更できるのはGameManagerだけ(他Managerは読み取り専用)。
 *
 * 重要: 現時点ではscript.js本体の起動フローはまだこちらへ切り替えていません。
 * これまでに実装した各Manager(SaveManager〜AdminManagerまで)を実際に束ねて
 * 動かす「本当の起動」は、Phase 9(NetworkManager)と合わせて行う想定です。
 *
 * @module core/GameManager
 */
export class GameManager {
    constructor() {
        /** @type {import('../core/GameState.js').GameStateValue} */
        this.state = GameState.LOADING;
        /** @type {Map<string, object>} 登録されたManagerインスタンス(名前 -> インスタンス) */
        this.managers = new Map();
        /** @type {boolean} */
        this.initialized = false;
    }

    /**
     * Managerを登録する(依存性注入)。GameManager以外はこのマップを直接操作しないこと。
     * @param {string} name - 例: 'save', 'settings', 'theme', 'audio' 等。
     * @param {object} instance - Managerのインスタンス。
     * @returns {void}
     */
    registerManager(name, instance) {
        this.managers.set(name, instance);
    }

    /**
     * 登録済みManagerを取得する。
     * @param {string} name
     * @returns {object|undefined}
     */
    getManager(name) {
        return this.managers.get(name);
    }

    /**
     * 全Managerの初期化を行う。各Managerが`init()`メソッドを持っていれば呼び出す
     * (無くても構わない。全Managerに`init()`を強制しない緩い規約)。
     * @returns {Promise<void>}
     * @fires game:initialized
     */
    async init() {
        if (this.initialized) return;
        for (const [name, manager] of this.managers.entries()) {
            if (typeof manager.init === 'function') {
                try {
                    await manager.init();
                } catch (err) {
                    logger.error(`[GameManager] failed to initialize manager "${name}":`, err);
                }
            }
        }
        this.initialized = true;
        eventBus.emit('game:initialized', { managerCount: this.managers.size });
        this.requestStateChange(GameState.TITLE);
    }

    /**
     * GameStateの変更をリクエストする。許可されていない遷移は拒否し、falseを返す。
     * @param {import('../core/GameState.js').GameStateValue} newState
     * @returns {boolean} 遷移が成功したか。
     * @fires game:state-changed
     * @fires game:state-change-rejected
     */
    requestStateChange(newState) {
        const from = this.state;
        if (from === newState) return true; // 同一状態への遷移は無条件で許可(no-op)

        if (!isTransitionAllowed(from, newState)) {
            logger.warn(`[GameManager] rejected state transition: ${from} -> ${newState}`);
            eventBus.emit('game:state-change-rejected', { from, to: newState });
            return false;
        }

        this.state = newState;
        eventBus.emit('game:state-changed', { from, to: newState });
        return true;
    }

    /**
     * @returns {import('../core/GameState.js').GameStateValue}
     */
    getState() {
        return this.state;
    }

    /**
     * 全Managerの終了処理を行う(`destroy()`メソッドを持つManagerのみ呼び出す)。
     * @returns {Promise<void>}
     * @fires game:destroyed
     */
    async destroy() {
        for (const [name, manager] of this.managers.entries()) {
            if (typeof manager.destroy === 'function') {
                try {
                    await manager.destroy();
                } catch (err) {
                    logger.error(`[GameManager] failed to destroy manager "${name}":`, err);
                }
            }
        }
        this.managers.clear();
        this.initialized = false;
        eventBus.emit('game:destroyed', {});
    }
}

/**
 * アプリ全体で共有するシングルトンGameManagerインスタンス。
 * @type {GameManager}
 */
export const gameManager = new GameManager();
