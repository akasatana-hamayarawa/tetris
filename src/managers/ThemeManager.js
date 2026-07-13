import { logger } from '../core/Logger.js';
import { eventBus } from '../core/EventBus.js';

/**
 * ThemeManager - `theme/<id>/theme.json` を読み込み、テーマの一覧化・適用を行う。
 *
 * 既存の script.js は `THEMES` という固定オブジェクトをソースコード内に直接
 * 持っており、新テーマを追加するにはコードを編集する必要がありました。
 * このクラスは、`theme/`配下にフォルダを1つ追加して`theme.json`を置くだけで
 * 新テーマが自動的に選択肢へ現れる仕組みを提供します(ARCHITECTURE.md 15章)。
 *
 * 重要: 現時点ではこのクラスは script.js の `updateUIFromCfg()` 内の
 * テーマ適用処理(CSS変数のsetProperty、`document.documentElement.dataset.theme`の設定)
 * を置き換えていません。並行稼働する「乗せ替え先」として用意しています。
 * 実際に script.js 側の呼び出しをこちらに一本化する作業は、
 * UIManager整備(Phase 4)と合わせて行うことを推奨します。
 *
 * @module managers/ThemeManager
 */
export class ThemeManager {
    constructor() {
        /** @type {Map<string, object>} テーマID -> theme.json の内容 */
        this.themes = new Map();
        /** @type {string|null} 現在適用中のテーマID */
        this.currentThemeId = null;
        /** @type {Set<string>} 動的に読み込んだテーマ用CSSの<link>要素を重複挿入しないための管理 */
        this.#loadedCssHrefs = new Set();
    }

    /** @type {Set<string>} */
    #loadedCssHrefs;

    /**
     * 既知のテーマID一覧から theme.json を読み込む。
     * 本来は `theme/` ディレクトリを実際にスキャンできるのが理想だが、
     * ブラウザからのファイルシステム列挙はできないため、
     * ここでは「既知のテーマIDリスト」を受け取ってそれぞれの theme.json を fetch する方式にする。
     * (将来サーバー側で `theme/` 配下の一覧APIを用意すれば、themeIds引数無しでも動くようにできる)
     * @param {string[]} themeIds - 例: ['default','retro','light','dark','cyberpunk','soft','anpontan','minimal']
     * @param {string} [baseDir='theme'] - テーマフォルダのベースパス。
     * @returns {Promise<void>}
     */
    async scanThemes(themeIds, baseDir = 'theme') {
        await Promise.all(themeIds.map(async (id) => {
            try {
                const res = await fetch(`${baseDir}/${id}/theme.json`);
                const json = await res.json();
                json.__baseDir = `${baseDir}/${id}`;
                this.themes.set(id, json);
            } catch (err) {
                logger.warn(`[ThemeManager] failed to load theme.json for "${id}":`, err);
            }
        }));
        eventBus.emit('theme:scanned', { count: this.themes.size, ids: Array.from(this.themes.keys()) });
    }

    /**
     * 手動で1テーマ分のデータを登録する(テストや、fetchが使えない環境向け)。
     * @param {string} id
     * @param {object} themeJson
     * @param {string} [baseDir]
     * @returns {void}
     */
    registerTheme(id, themeJson, baseDir = `theme/${id}`) {
        this.themes.set(id, { ...themeJson, __baseDir: baseDir });
    }

    /**
     * @returns {Array<{id: string, name: object}>} 選択肢UI表示用の軽量な一覧。
     */
    listThemes() {
        return Array.from(this.themes.entries()).map(([id, t]) => ({ id, name: t.name }));
    }

    /**
     * @param {string} id
     * @returns {object|undefined}
     */
    getTheme(id) {
        return this.themes.get(id);
    }

    /**
     * テーマを適用する。CSS変数をルート要素に設定し、`data-theme`属性を更新、
     * 必要であればテーマ専用CSS/JSを動的読み込みする。
     * @param {string} id
     * @returns {Promise<boolean>} 適用に成功したか。
     * @fires theme:applied
     */
    async apply(id) {
        const theme = this.themes.get(id);
        if (!theme) {
            logger.warn(`[ThemeManager] unknown theme id: "${id}"`);
            return false;
        }

        const root = (typeof document !== 'undefined') ? document.documentElement : null;
        if (root) {
            const c = theme.colors || {};
            if (c.accent) root.style.setProperty('--accent-color', c.accent);
            if (c.bg) root.style.setProperty('--bg-color', c.bg);
            if (c.panel) root.style.setProperty('--panel-bg', c.panel);
            if (c.text) root.style.setProperty('--text-color', c.text);
            if (c.border) root.style.setProperty('--border-color', c.border);
            if (c.star) root.style.setProperty('--star-color', c.star);
            if (c.canvasBg) root.style.setProperty('--canvas-bg', c.canvasBg);
            root.dataset.theme = id;
        }

        await this.#ensureCssLoaded(theme);

        this.currentThemeId = id;
        eventBus.emit('theme:applied', { id, theme });
        return true;
    }

    /**
     * テーマのCSSファイルが未読み込みであれば `<link>` タグを動的挿入する。
     * 既に同じhrefが挿入済みなら何もしない(重複読み込み防止)。
     * @param {object} theme
     * @returns {Promise<void>}
     */
    async #ensureCssLoaded(theme) {
        if (!theme.css || typeof document === 'undefined') return;
        const href = `${theme.__baseDir}/${theme.css}`;
        if (this.#loadedCssHrefs.has(href)) return;

        await new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => { logger.warn(`[ThemeManager] failed to load CSS: ${href}`); resolve(); };
            document.head.appendChild(link);
        });
        this.#loadedCssHrefs.add(href);
    }

    /**
     * @returns {string|null} 現在適用中のテーマID。
     */
    getCurrentThemeId() {
        return this.currentThemeId;
    }
}

/**
 * アプリ全体で共有するシングルトンThemeManagerインスタンス。
 * @type {ThemeManager}
 */
export const themeManager = new ThemeManager();

/**
 * 現時点で存在が確認されている8テーマのID一覧(script.jsのTHEMESオブジェクトと同一)。
 * scanThemes() の引数に渡すデフォルト値として使う。
 * @type {string[]}
 */
export const KNOWN_THEME_IDS = ['default', 'retro', 'light', 'dark', 'cyberpunk', 'soft', 'anpontan', 'minimal'];
