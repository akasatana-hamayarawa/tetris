import { eventBus } from '../core/EventBus.js';

/**
 * StatisticsManager - スコア・ライン・レベル・combo・B2B・T-Spin等の
 * 統計値を集計するクラス。
 *
 * フィールド名は script.js の `Board.prototype.getState()`(8738行)/
 * `setState()`(8762行)で実際に使われているものと完全に一致させています
 * (score, level, time, pieces, attacks, tSpins, garbageReceived, maxRen,
 * perfectClears, skillCoins, lines, ren, btb)。
 *
 * 現時点では script.js 本体の統計更新処理(各所に散らばった `this.player.xxx++`)
 * をこちらへ置き換えていません。並行稼働する集計先として用意しています。
 *
 * @module managers/StatisticsManager
 */

/**
 * @returns {object} 初期状態の統計値(script.jsの新規player生成時のデフォルトと同じ意味合い)。
 */
function createEmptyStats() {
    return {
        score: 0, level: 1, time: 0, pieces: 0, lines: 0,
        attacks: 0, tSpins: 0, garbageReceived: 0,
        ren: -1, maxRen: 0, btb: false,
        perfectClears: 0, skillCoins: 0
    };
}

export class StatisticsManager {
    constructor() {
        /** @type {object} */
        this.stats = createEmptyStats();
    }

    /**
     * 統計値をリセットする(新しい対戦の開始時)。
     * @returns {void}
     * @fires statistics:reset
     */
    reset() {
        this.stats = createEmptyStats();
        eventBus.emit('statistics:reset', {});
    }

    /**
     * 数値系の統計を加算する。
     * @param {string} key - 'score' | 'pieces' | 'lines' | 'attacks' | 'tSpins' | 'garbageReceived' | 'skillCoins' 等。
     * @param {number} amount
     * @returns {number} 加算後の値。
     * @fires statistics:changed
     */
    add(key, amount) {
        this.stats[key] = (this.stats[key] || 0) + amount;
        eventBus.emit('statistics:changed', { key, value: this.stats[key] });
        return this.stats[key];
    }

    /**
     * 統計値を直接設定する(level等、加算ではなく上書きが自然なもの向け)。
     * @param {string} key
     * @param {any} value
     * @returns {void}
     * @fires statistics:changed
     */
    set(key, value) {
        this.stats[key] = value;
        eventBus.emit('statistics:changed', { key, value });
    }

    /**
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        return this.stats[key];
    }

    /**
     * コンボ(ren)を更新し、必要であれば最大コンボ(maxRen)も更新する。
     * script.js側の「renを++した後、maxRenと比較して更新する」流れと同じ。
     * @param {number} newRen - ScoringSystem.calculateLineClearResult() の `newRen` をそのまま渡す想定。
     * @returns {void}
     */
    updateRen(newRen) {
        this.stats.ren = newRen;
        if (newRen > this.stats.maxRen) {
            this.stats.maxRen = newRen;
        }
        eventBus.emit('statistics:changed', { key: 'ren', value: newRen });
    }

    /**
     * Back-to-Back状態を更新する。
     * @param {boolean} newBtb
     * @returns {void}
     */
    updateBtb(newBtb) {
        this.stats.btb = newBtb;
        eventBus.emit('statistics:changed', { key: 'btb', value: newBtb });
    }

    /**
     * PPS(1秒あたりの設置ミノ数)を計算する。
     * @returns {number} timeが0の場合は0を返す。
     */
    calculatePPS() {
        if (!this.stats.time) return 0;
        return this.stats.pieces / (this.stats.time / 1000);
    }

    /**
     * APM(1分あたりの攻撃ライン数)を計算する。
     * @returns {number}
     */
    calculateAPM() {
        if (!this.stats.time) return 0;
        return this.stats.attacks / (this.stats.time / 60000);
    }

    /**
     * 現在の統計値のスナップショットを取得する(参照ではなくコピー)。
     * @returns {object}
     */
    getSnapshot() {
        return { ...this.stats };
    }
}

/**
 * アプリ全体で共有するシングルトンStatisticsManagerインスタンス。
 * @type {StatisticsManager}
 */
export const statisticsManager = new StatisticsManager();
