/**
 * Logger - ログ出力を一元管理するクラス。
 *
 * - DEBUG / INFO は Developer Mode が有効な時のみ出力する。
 * - WARN / ERROR は常に出力する(本番でも問題の早期発見のため)。
 *
 * このファイルは新規追加のみで、既存の script.js には一切影響しません。
 * 将来的に script.js 内の console.log 呼び出しを段階的にこちらへ置き換えていきます。
 *
 * @module core/Logger
 */

/** @typedef {'DEBUG'|'INFO'|'WARN'|'ERROR'} LogLevel */

export class Logger {
    /** @type {boolean} */
    #devMode;

    /** @type {Array<{level: LogLevel, args: any[], timestamp: number}>} Developer Mode の Event Log 表示用バッファ */
    #history = [];

    /** @type {number} 保持する履歴の最大件数 */
    #historyLimit = 200;

    /**
     * @param {boolean} [devMode=false] - trueの場合 DEBUG/INFO も出力する。
     */
    constructor(devMode = false) {
        this.#devMode = !!devMode;
    }

    /**
     * Developer Mode の有効/無効を切り替える。
     * @param {boolean} enabled
     * @returns {void}
     */
    setDevMode(enabled) {
        this.#devMode = !!enabled;
    }

    /**
     * @returns {boolean} 現在 Developer Mode かどうか。
     */
    isDevMode() {
        return this.#devMode;
    }

    /**
     * デバッグレベルのログ。Developer Mode時のみ出力。
     * @param {...any} args
     * @returns {void}
     */
    debug(...args) {
        this.#record('DEBUG', args);
        if (this.#devMode) console.debug('[DEBUG]', ...args);
    }

    /**
     * 情報レベルのログ。Developer Mode時のみ出力。
     * @param {...any} args
     * @returns {void}
     */
    info(...args) {
        this.#record('INFO', args);
        if (this.#devMode) console.info('[INFO]', ...args);
    }

    /**
     * 警告レベルのログ。常に出力。
     * @param {...any} args
     * @returns {void}
     */
    warn(...args) {
        this.#record('WARN', args);
        console.warn('[WARN]', ...args);
    }

    /**
     * エラーレベルのログ。常に出力。
     * @param {...any} args
     * @returns {void}
     */
    error(...args) {
        this.#record('ERROR', args);
        console.error('[ERROR]', ...args);
    }

    /**
     * Developer Mode の Event Log 表示用に、直近のログ履歴を取得する。
     * @param {number} [count=20] - 取得する件数(新しい順)。
     * @returns {Array<{level: LogLevel, args: any[], timestamp: number}>}
     */
    getRecentHistory(count = 20) {
        return this.#history.slice(-count);
    }

    /**
     * 履歴バッファへ記録する内部ヘルパー。
     * @param {LogLevel} level
     * @param {any[]} args
     * @returns {void}
     */
    #record(level, args) {
        this.#history.push({ level, args, timestamp: Date.now() });
        if (this.#history.length > this.#historyLimit) {
            this.#history.shift();
        }
    }
}

/**
 * アプリ全体で共有するシングルトンLoggerインスタンス。
 * @type {Logger}
 */
export const logger = new Logger(false);
