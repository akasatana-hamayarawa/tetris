import { ALL_TEMPLATES, TEMPLATE_CATEGORIES } from '../../template/definitions/index.js';
import { eventBus } from '../core/EventBus.js';
import { logger } from '../core/Logger.js';

/**
 * TemplateManager - テンプレートモード(盤面パターン練習)の一覧管理。
 *
 * `template/definitions/index.js` のレジストリを読み込み、カテゴリ別に整理した
 * メニュー構造を提供する。新しいテンプレートファイルを追加してレジストリに
 * 登録すれば、このクラスが自動的に一覧・検索へ反映する(コード変更不要)。
 *
 * 重要: 現時点では script.js 側の `TEMPLATES` オブジェクトや
 * `selectTemplate()` はまだこちらへ切り替えていません。
 * index.htmlのテンプレートメニューは現状のハードコードされたHTML構造のまま
 * 動作しています(既存の操作方法・見た目を壊さないため)。
 * 実際にメニューHTML生成をこちらへ委譲する統合は、テンプレートモードを
 * 実機で一通り確認しながら次のステップとして行うことを推奨します。
 *
 * @module managers/TemplateManager
 */
export class TemplateManager {
    constructor(templates = ALL_TEMPLATES, categories = TEMPLATE_CATEGORIES) {
        /** @type {Array<object>} */
        this.templates = templates;
        /** @type {Array<object>} */
        this.categories = categories;
    }

    /**
     * @param {string} id
     * @returns {object|undefined}
     */
    getTemplate(id) {
        return this.templates.find(t => t.id === id);
    }

    /**
     * カテゴリ別にグループ化されたテンプレート一覧を取得する
     * (index.htmlの既存メニュー構造 = REN系/エレベーター系/TD系/PC系/T-spin系 と対応)。
     * @returns {Array<{id: string, name: object, items: object[]}>}
     */
    getGroupedByCategory() {
        return this.categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            items: this.templates.filter(t => t.category === cat.id)
        })).filter(group => group.items.length > 0);
    }

    /**
     * 名前(en/ja両方)でテンプレートを検索する。
     * @param {string} query
     * @returns {object[]}
     */
    search(query) {
        const q = query.trim().toLowerCase();
        if (!q) return this.templates;
        return this.templates.filter(t =>
            t.id.toLowerCase().includes(q) ||
            t.name.en.toLowerCase().includes(q) ||
            t.name.ja.toLowerCase().includes(q)
        );
    }

    /**
     * 指定言語での表示名を取得する。
     * @param {object} template
     * @param {'en'|'ja'} lang
     * @returns {string}
     */
    getDisplayName(template, lang) {
        return (template.name && template.name[lang]) || template.id;
    }

    /**
     * テンプレートを選択した時のイベントを発行する(実際の盤面反映はscript.js側が購読して行う想定)。
     * @param {string} id
     * @returns {void}
     * @fires template:selected
     */
    selectTemplate(id) {
        const template = this.getTemplate(id);
        if (!template) {
            logger.warn(`[TemplateManager] unknown template id: "${id}"`);
            return;
        }
        eventBus.emit('template:selected', { id, template });
    }

    /**
     * @returns {number} 登録されているテンプレートの総数。
     */
    count() {
        return this.templates.length;
    }
}

/**
 * アプリ全体で共有するシングルトンTemplateManagerインスタンス。
 * @type {TemplateManager}
 */
export const templateManager = new TemplateManager();
