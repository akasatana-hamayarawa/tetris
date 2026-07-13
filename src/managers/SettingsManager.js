import { saveManager } from './SaveManager.js';
import { eventBus } from '../core/EventBus.js';
import { logger } from '../core/Logger.js';
import { DEFAULT_SETTINGS } from '../core/Constants.js';

/**
 * SettingsManager - ゲーム設定(cfg)の読み書き・バリデーション・デフォルト値管理。
 *
 * 既存の script.js は `tetrisProUltCfg_v14` というキーで、cfg オブジェクトを
 * そのまま(バージョン管理なしの生JSON)保存しています。このクラスはその
 * 既存フォーマットと完全互換の形で読み書きできるよう作られています。
 *
 * 重要: このクラスは現時点では script.js の `cfg` 変数や `saveCfg()` 関数を
 * 置き換えていません(並行して用意した「乗せ替え先」です)。実際に
 * script.js 側の数百箇所の `cfg.xxx` 参照をこちらへ切り替える作業は、
 * ARCHITECTURE.md の Phase 4 で UIManager 整備と合わせて行うことを推奨します。
 *
 * @module managers/SettingsManager
 */

const SETTINGS_STORAGE_KEY = 'tetrisProUltCfg_v14';
const SETTINGS_SCHEMA_VERSION = 1;

export class SettingsManager {
    /**
     * @param {import('./SaveManager.js').SaveManager} [save=saveManager]
     */
    constructor(save = saveManager) {
        /** @type {import('./SaveManager.js').SaveManager} */
        this.save = save;
        /** @type {object} 現在の設定値(メモリ上のキャッシュ) */
        this.current = this.#loadOrDefault();
    }

    /**
     * 保存されている設定を読み込む。存在しない/壊れている場合はデフォルト値を使う。
     * 既存データに無いキーがデフォルトにだけ存在する場合(将来設定項目が増えた場合)は、
     * デフォルト値で補完する(浅いマージ)。
     * @returns {object}
     */
    #loadOrDefault() {
        const loaded = this.save.load(SETTINGS_STORAGE_KEY, {
            defaultValue: null,
            currentVersion: SETTINGS_SCHEMA_VERSION
        });
        if (!loaded || typeof loaded !== 'object') {
            logger.info('[SettingsManager] no existing settings found, using defaults.');
            return this.#cloneDefaults();
        }
        return this.#mergeWithDefaults(loaded);
    }

    /**
     * 読み込んだ設定にデフォルト値を浅くマージする(新設定項目の追加に耐えるため)。
     * ネストしたオブジェクト(keys / padKeys / touchPos)は個別にマージする。
     * @param {object} loaded
     * @returns {object}
     */
    #mergeWithDefaults(loaded) {
        const defaults = this.#cloneDefaults();
        const merged = { ...defaults, ...loaded };
        merged.keys = { ...defaults.keys, ...(loaded.keys || {}) };
        merged.padKeys = { ...defaults.padKeys, ...(loaded.padKeys || {}) };
        merged.touchPos = {
            dpad: { ...defaults.touchPos.dpad, ...((loaded.touchPos || {}).dpad || {}) },
            actions: { ...defaults.touchPos.actions, ...((loaded.touchPos || {}).actions || {}) }
        };
        return merged;
    }

    /**
     * @returns {object} DEFAULT_SETTINGS のディープコピー(誤って共有参照を書き換えないため)。
     */
    #cloneDefaults() {
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    /**
     * 現在の設定値を取得する(読み取り専用として扱うこと)。
     * @returns {object}
     */
    getAll() {
        return this.current;
    }

    /**
     * 特定のキーの値を取得する。
     * @param {string} key
     * @returns {any}
     */
    get(key) {
        return this.current[key];
    }

    /**
     * 特定のキーの値を更新し、保存する。`settings:changed` イベントを発行する。
     * @param {string} key
     * @param {any} value
     * @returns {void}
     * @fires settings:changed
     */
    set(key, value) {
        const previous = this.current[key];
        this.current[key] = value;
        this.#persist();
        eventBus.emit('settings:changed', { key, value, previous });
    }

    /**
     * 複数の値を一括更新する(設定画面の「保存」ボタン等で使用)。
     * @param {object} partial
     * @returns {void}
     * @fires settings:changed
     */
    setMany(partial) {
        const previous = { ...this.current };
        this.current = { ...this.current, ...partial };
        this.#persist();
        eventBus.emit('settings:changed', { key: null, value: partial, previous });
    }

    /**
     * 設定をデフォルト値へリセットする。
     * @returns {void}
     * @fires settings:changed
     */
    reset() {
        const previous = this.current;
        this.current = this.#cloneDefaults();
        this.#persist();
        eventBus.emit('settings:changed', { key: null, value: this.current, previous });
    }

    /**
     * 現在の設定値をlocalStorageへ保存する。
     * @returns {void}
     */
    #persist() {
        this.save.save(SETTINGS_STORAGE_KEY, this.current, SETTINGS_SCHEMA_VERSION);
    }
}

/**
 * アプリ全体で共有するシングルトンSettingsManagerインスタンス。
 * ブラウザ環境以外(Node単体テスト等)で誤ってlocalStorageへアクセスしないよう、
 * 生成タイミングは呼び出し側で制御してください(必要ならこのexportをコメントアウトし、
 * `new SettingsManager()` を明示的に呼ぶ運用にしても構いません)。
 * @type {SettingsManager}
 */
export const settingsManager = (typeof window !== 'undefined') ? new SettingsManager() : null;
