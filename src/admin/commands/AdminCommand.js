/**
 * AdminCommand - Admin Cheatの各機能を表すコマンドの基底クラス。
 *
 * ARCHITECTURE.md 17章の設計に基づき、1機能=1クラスとして実装する。
 * `AdminManager`はこれらのCommandをリストとして持つだけで、
 * 検索・カテゴリ分け・お気に入り・最近使用・ショートカット・プリセットは
 * 各Commandの静的メタデータ(`id`/`category`/`label`/`searchTerms`)から自動生成される。
 *
 * 重要: 現時点では既存の`チート/admin.js`(v2、カテゴリ+検索+折りたたみ対応済み)を
 * 置き換えていません。これは将来的な移行先として並行して用意したものです。
 *
 * @module admin/commands/AdminCommand
 */
export class AdminCommand {
    /** @type {string} 一意なコマンドID(例: 'addGarbage') */
    static id = 'base';
    /** @type {string} カテゴリ(例: 'board', 'player', 'game', 'fx', 'dev', 'network', 'test') */
    static category = 'other';
    /** @type {{en: string, ja: string}} 表示ラベル */
    static label = { en: 'Unnamed Command', ja: '名称未設定コマンド' };
    /** @type {string[]} 検索用キーワード(英語・日本語両方を含めることを推奨) */
    static searchTerms = [];
    /** @type {boolean} 実行前に確認が必要な破壊的操作かどうか */
    static dangerous = false;
    /** @type {'toggle'|'action'} トグル式(ON/OFF)か、ワンショット実行か */
    static kind = 'action';

    /**
     * コマンドを実行する。サブクラスでオーバーライドすること。
     * @param {object} context - 実行コンテキスト(board, payload等、呼び出し側が用意する)。
     * @returns {any}
     */
    execute(context) {
        throw new Error(`AdminCommand.execute() is not implemented for "${this.constructor.id}"`);
    }
}
