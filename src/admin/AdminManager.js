import { AdminCommandRegistry } from './AdminCommandRegistry.js';
import * as coreCommands from './commands/coreCommands.js';

/**
 * AdminManager - Admin Cheatの状態管理・コマンド実行の窓口。
 *
 * 内部で `AdminCommandRegistry`(Command Pattern)を保持し、コア機能を
 * 起動時に自動登録する。プラグインからの追加登録(`registerCheat()`)も
 * このクラス経由で行う想定(ARCHITECTURE.md 16章 Plugin API参照)。
 *
 * 重要: 既存の`チート/admin.js`(v2)とは並行稼働です。まだ置き換えていません。
 *
 * @module admin/AdminManager
 */
export class AdminManager {
    constructor() {
        /** @type {AdminCommandRegistry} */
        this.registry = new AdminCommandRegistry();
        this.#registerCoreCommands();
    }

    #registerCoreCommands() {
        const classes = Object.values(coreCommands).filter(v => typeof v === 'function');
        this.registry.registerAll(classes);
    }

    /**
     * コマンドを実行する。
     * @param {string} id
     * @param {object} context
     * @returns {any}
     */
    execute(id, context) {
        return this.registry.execute(id, context);
    }

    /**
     * 検索・カテゴリ・お気に入り・最近使用を含む、UI表示用の完全な一覧を構築する。
     * @param {object} [options]
     * @param {string} [options.query='']
     * @param {'en'|'ja'} [options.lang='ja']
     * @returns {{
     *   favorites: Array,
     *   recent: Array,
     *   grouped: Record<string, Array>,
     *   total: number
     * }}
     */
    buildMenuData({ query = '', lang = 'ja' } = {}) {
        const filtered = query ? this.registry.search(query, lang) : this.registry.getAll();
        const filteredIds = new Set(filtered.map(c => c.id));
        const grouped = {};
        for (const CommandClass of filtered) {
            const cat = CommandClass.category || 'other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(CommandClass);
        }
        return {
            favorites: this.registry.getFavorites().filter(c => filteredIds.has(c.id)),
            recent: this.registry.getRecent().filter(c => filteredIds.has(c.id)),
            grouped,
            total: filtered.length
        };
    }

    /**
     * @param {string} id
     * @returns {boolean} 切り替え後のお気に入り状態。
     */
    toggleFavorite(id) {
        return this.registry.toggleFavorite(id);
    }

    /**
     * プラグインなどから新しいチートコマンドを登録する。
     * @param {typeof import('./commands/AdminCommand.js').AdminCommand} CommandClass
     * @returns {void}
     */
    registerCheat(CommandClass) {
        this.registry.register(CommandClass);
    }
}

/**
 * アプリ全体で共有するシングルトンAdminManagerインスタンス。
 * @type {AdminManager}
 */
export const adminManager = new AdminManager();
