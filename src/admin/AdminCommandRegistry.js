import { eventBus } from '../core/EventBus.js';
import { safeGetJSON, safeSetJSON } from '../utils/storage.js';

/**
 * AdminCommandRegistry - 登録されたAdminCommandクラスから、
 * 検索・カテゴリ分け・お気に入り・最近使用を自動生成するレジストリ。
 *
 * 新しいチートを追加する時は、Commandクラスを1つ書いて`register()`するだけで、
 * 検索・カテゴリ・お気に入り・最近使用に自動的に反映される(ARCHITECTURE.md 17章)。
 *
 * @module admin/AdminCommandRegistry
 */

const FAVORITES_STORAGE_KEY = 'tetrisProUltAdminFavorites_v1';
const RECENT_STORAGE_KEY = 'tetrisProUltAdminRecent_v1';
const RECENT_LIMIT = 10;

export class AdminCommandRegistry {
    constructor() {
        /** @type {Map<string, typeof import('./commands/AdminCommand.js').AdminCommand>} */
        this.commands = new Map();
        /** @type {Set<string>} */
        this.favorites = new Set(safeGetJSON(FAVORITES_STORAGE_KEY, []));
        /** @type {string[]} */
        this.recent = safeGetJSON(RECENT_STORAGE_KEY, []);
    }

    /**
     * Commandクラスを登録する。
     * @param {typeof import('./commands/AdminCommand.js').AdminCommand} CommandClass
     * @returns {void}
     */
    register(CommandClass) {
        this.commands.set(CommandClass.id, CommandClass);
    }

    /**
     * 複数のCommandクラスを一括登録する。
     * @param {Array<typeof import('./commands/AdminCommand.js').AdminCommand>} CommandClasses
     * @returns {void}
     */
    registerAll(CommandClasses) {
        CommandClasses.forEach(c => this.register(c));
    }

    /**
     * @param {string} id
     * @returns {typeof import('./commands/AdminCommand.js').AdminCommand|undefined}
     */
    get(id) {
        return this.commands.get(id);
    }

    /**
     * @returns {Array<typeof import('./commands/AdminCommand.js').AdminCommand>}
     */
    getAll() {
        return Array.from(this.commands.values());
    }

    /**
     * カテゴリ別にグループ化する。
     * @returns {Record<string, Array<typeof import('./commands/AdminCommand.js').AdminCommand>>}
     */
    getGroupedByCategory() {
        const groups = {};
        for (const CommandClass of this.commands.values()) {
            const cat = CommandClass.category || 'other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(CommandClass);
        }
        return groups;
    }

    /**
     * 英語・日本語両方のラベル・検索キーワードで検索する。
     * @param {string} query
     * @param {'en'|'ja'} [lang='ja']
     * @returns {Array<typeof import('./commands/AdminCommand.js').AdminCommand>}
     */
    search(query, lang = 'ja') {
        const q = query.trim().toLowerCase();
        if (!q) return this.getAll();
        return this.getAll().filter(CommandClass => {
            const label = (CommandClass.label[lang] || CommandClass.label.en || '').toLowerCase();
            const labelOther = (CommandClass.label.en || '').toLowerCase();
            const terms = (CommandClass.searchTerms || []).join(' ').toLowerCase();
            return label.includes(q) || labelOther.includes(q) || terms.includes(q) || CommandClass.id.toLowerCase().includes(q);
        });
    }

    /**
     * お気に入りに登録されているCommandの一覧を取得する。
     * @returns {Array<typeof import('./commands/AdminCommand.js').AdminCommand>}
     */
    getFavorites() {
        return Array.from(this.favorites).map(id => this.commands.get(id)).filter(Boolean);
    }

    /**
     * お気に入りのON/OFFを切り替える。
     * @param {string} id
     * @returns {boolean} 切り替え後の状態(お気に入りに入っているか)。
     */
    toggleFavorite(id) {
        const isFav = this.favorites.has(id);
        if (isFav) this.favorites.delete(id); else this.favorites.add(id);
        safeSetJSON(FAVORITES_STORAGE_KEY, Array.from(this.favorites));
        eventBus.emit('admin:favorites-changed', { id, isFavorite: !isFav });
        return !isFav;
    }

    /**
     * 最近使用したCommandの一覧を取得する(新しい順)。
     * @returns {Array<typeof import('./commands/AdminCommand.js').AdminCommand>}
     */
    getRecent() {
        return this.recent.map(id => this.commands.get(id)).filter(Boolean);
    }

    /**
     * Commandを実行し、最近使用リストへ記録する。
     * @param {string} id
     * @param {object} context - 実行コンテキスト。
     * @returns {any} コマンドの実行結果。
     */
    execute(id, context) {
        const CommandClass = this.commands.get(id);
        if (!CommandClass) {
            throw new Error(`AdminCommandRegistry.execute: unknown command "${id}"`);
        }
        const instance = new CommandClass();
        const result = instance.execute(context);
        this.#recordRecent(id);
        eventBus.emit('admin:command-executed', { id, result });
        return result;
    }

    /**
     * @param {string} id
     * @returns {void}
     */
    #recordRecent(id) {
        this.recent = [id, ...this.recent.filter(existing => existing !== id)].slice(0, RECENT_LIMIT);
        safeSetJSON(RECENT_STORAGE_KEY, this.recent);
    }
}
