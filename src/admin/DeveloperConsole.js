import { logger } from '../core/Logger.js';
import { eventBus } from '../core/EventBus.js';

/**
 * DeveloperConsole - `help()` / `spawnPiece("T")` のように、名前付きコマンドを
 * 実行できる開発者向けコンソール。
 *
 * AdminManagerのCommand Registry(Command Pattern)とは別に、より軽量な
 * 「関数を名前で登録して呼び出すだけ」の仕組みとして用意しています
 * (デバッグ用途に特化しており、検索・カテゴリ・お気に入り等は持ちません)。
 *
 * @module admin/DeveloperConsole
 */
export class DeveloperConsole {
    constructor() {
        /** @type {Map<string, {fn: Function, description: string}>} */
        this.commands = new Map();
        /** @type {Array<{command: string, result: any, error: string|null, timestamp: number}>} */
        this.history = [];
    }

    /**
     * コマンドを登録する。
     * @param {string} name - 例: 'spawnPiece'。
     * @param {Function} fn
     * @param {string} [description='']
     * @returns {void}
     */
    register(name, fn, description = '') {
        this.commands.set(name, { fn, description });
    }

    /**
     * 複数のコマンドを一括登録する。
     * @param {Record<string, {fn: Function, description?: string}>} commandMap
     * @returns {void}
     */
    registerAll(commandMap) {
        for (const [name, def] of Object.entries(commandMap)) {
            this.register(name, def.fn, def.description || '');
        }
    }

    /**
     * コマンドを実行する。
     * @param {string} name
     * @param {...any} args
     * @returns {any}
     * @fires devconsole:executed
     */
    run(name, ...args) {
        const entry = this.commands.get(name);
        if (!entry) {
            const error = `Unknown command: "${name}". Type help() for a list of commands.`;
            this.history.push({ command: name, result: null, error, timestamp: Date.now() });
            logger.warn(`[DeveloperConsole] ${error}`);
            return undefined;
        }
        try {
            const result = entry.fn(...args);
            this.history.push({ command: name, result, error: null, timestamp: Date.now() });
            eventBus.emit('devconsole:executed', { name, args, result });
            return result;
        } catch (err) {
            const errorMessage = err && err.message ? err.message : String(err);
            this.history.push({ command: name, result: null, error: errorMessage, timestamp: Date.now() });
            logger.error(`[DeveloperConsole] command "${name}" threw:`, err);
            return undefined;
        }
    }

    /**
     * 登録されている全コマンドのヘルプ文字列を取得する。
     * @returns {string}
     */
    help() {
        const lines = Array.from(this.commands.entries()).map(([name, def]) =>
            `${name}() - ${def.description || '(no description)'}`
        );
        return lines.join('\n');
    }

    /**
     * 実行履歴を取得する(新しい順)。
     * @param {number} [count=20]
     * @returns {Array}
     */
    getHistory(count = 20) {
        return this.history.slice(-count).reverse();
    }
}

/**
 * アプリ全体で共有するシングルトンDeveloperConsoleインスタンス。
 * @type {DeveloperConsole}
 */
export const developerConsole = new DeveloperConsole();
