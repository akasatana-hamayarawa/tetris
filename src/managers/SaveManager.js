import { logger } from '../core/Logger.js';
import { eventBus } from '../core/EventBus.js';

/**
 * SaveManager - localStorageへの読み書きを一元管理する汎用サービス。
 *
 * ARCHITECTURE.md 21章の仕様に基づき、以下を提供する:
 *   - スキーマバージョン管理
 *   - マイグレーション(旧バージョン → 新バージョンへの変換関数を登録できる)
 *   - バックアップ(保存直前に旧データを退避)
 *   - 破損検知(JSON.parse失敗時にバックアップから復元を試みる)
 *
 * このファイルは新規追加のみで、既存の script.js の保存処理(saveCfg()等)を
 * まだ置き換えていません。既存のキー名・JSON構造(`tetrisProUltCfg_v14` 等)を
 * 忠実に踏襲した「乗せ替え先」として先に用意したものです。
 *
 * 実際に script.js 側の保存処理をこちらへ委譲する切り替え作業は、
 * cfg オブジェクトへの参照が10,000行超のファイル全体に数百箇所散らばっているため、
 * ARCHITECTURE.md の Phase 4(UIManager整備後)で安全に行うことを推奨します。
 * 現時点で無理に cutover すると、目視テストができないこの環境では
 * 挙動が変わっていないことを確認できません。
 *
 * @module managers/SaveManager
 */

export class SaveManager {
    /**
     * @param {Storage} [storage=window.localStorage] - 差し替え可能にしておくことで、
     *   Node環境でのユニットテストや、将来的なIndexedDB移行にも対応しやすくする。
     */
    constructor(storage = (typeof window !== 'undefined' ? window.localStorage : null)) {
        /** @type {Storage} */
        this.storage = storage;
        /** @type {Map<string, Array<{from: number, to: number, migrate: (data: any) => any}>>} */
        this.migrations = new Map();
    }

    /**
     * 特定キーに対するマイグレーション関数を登録する。
     * @param {string} key - 対象のlocalStorageキー。
     * @param {number} fromVersion - 変換元のスキーマバージョン。
     * @param {number} toVersion - 変換先のスキーマバージョン。
     * @param {(data: any) => any} migrate - 変換関数。
     * @returns {void}
     */
    registerMigration(key, fromVersion, toVersion, migrate) {
        if (!this.migrations.has(key)) this.migrations.set(key, []);
        this.migrations.get(key).push({ from: fromVersion, to: toVersion, migrate });
    }

    /**
     * データを保存する。保存直前に既存データをバックアップキーへ退避する。
     * @param {string} key - localStorageキー。
     * @param {any} data - 保存するデータ(JSON化可能なもの)。
     * @param {number} [schemaVersion=1] - このデータのスキーマバージョン。
     * @returns {boolean} 保存に成功したか。
     */
    save(key, data, schemaVersion = 1) {
        if (!this.storage) {
            logger.warn('[SaveManager] storage is unavailable; save skipped.', key);
            return false;
        }
        try {
            const previous = this.storage.getItem(key);
            if (previous !== null) {
                this.storage.setItem(this.#backupKey(key), previous);
            }
            const envelope = { __schemaVersion: schemaVersion, data };
            this.storage.setItem(key, JSON.stringify(envelope));
            eventBus.emit('save:written', { key, schemaVersion });
            return true;
        } catch (err) {
            logger.error('[SaveManager] save failed:', key, err);
            return false;
        }
    }

    /**
     * データを読み込む。破損している場合はバックアップからの復元を試み、
     * それも失敗した場合は defaultValue を返す。
     * 読み込んだデータのスキーマバージョンが古い場合、登録済みのマイグレーションを
     * 順番に適用してから返す。
     * @param {string} key - localStorageキー。
     * @param {object} [options]
     * @param {any} [options.defaultValue=null] - 読み込めなかった場合のフォールバック値。
     * @param {number} [options.currentVersion=1] - 現在期待しているスキーマバージョン。
     * @returns {any}
     */
    load(key, { defaultValue = null, currentVersion = 1 } = {}) {
        if (!this.storage) return defaultValue;

        const raw = this.storage.getItem(key);
        if (raw === null || raw === undefined) {
            // データがまだ存在しない(初回起動など)。これは正常なケースなので警告は出さない。
            return defaultValue;
        }

        const parsed = this.#tryParseEnvelope(raw);
        if (parsed) {
            return this.#applyMigrations(key, parsed, currentVersion);
        }

        // ここに来るのは「データは存在するがパースに失敗した」= 本当の破損ケース
        logger.warn('[SaveManager] primary data for key looked corrupted, trying backup:', key);
        const backupRaw = this.storage.getItem(this.#backupKey(key));
        const backupParsed = this.#tryParseEnvelope(backupRaw);
        if (backupParsed) {
            eventBus.emit('save:restored-from-backup', { key });
            return this.#applyMigrations(key, backupParsed, currentVersion);
        }

        logger.error('[SaveManager] no valid data or backup for key, using default:', key);
        return defaultValue;
    }

    /**
     * 指定キーのデータとバックアップを完全に削除する。
     * @param {string} key
     * @returns {void}
     */
    remove(key) {
        if (!this.storage) return;
        this.storage.removeItem(key);
        this.storage.removeItem(this.#backupKey(key));
    }

    /**
     * 生のJSON文字列を { __schemaVersion, data } の形へ安全にパースする。
     * 旧形式(バージョン管理なしで直接dataだけが保存されている場合)にも後方互換を持たせる。
     * @param {string|null} raw
     * @returns {{__schemaVersion: number, data: any}|null}
     */
    #tryParseEnvelope(raw) {
        if (raw === null || raw === undefined) return null;
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && '__schemaVersion' in parsed && 'data' in parsed) {
                return parsed;
            }
            // 旧形式(script.js の既存キーはこちら。バージョン管理前のデータ)
            return { __schemaVersion: 0, data: parsed };
        } catch (err) {
            return null;
        }
    }

    /**
     * 登録済みマイグレーションを、読み込んだバージョンから現在バージョンまで順に適用する。
     * @param {string} key
     * @param {{__schemaVersion: number, data: any}} envelope
     * @param {number} currentVersion
     * @returns {any}
     */
    #applyMigrations(key, envelope, currentVersion) {
        let { __schemaVersion: version, data } = envelope;
        const steps = this.migrations.get(key) || [];
        let safety = 0;
        while (version < currentVersion && safety < 50) {
            const step = steps.find(s => s.from === version);
            if (!step) break; // これ以上変換経路がない場合はそこで打ち切り、現状のデータを返す
            data = step.migrate(data);
            version = step.to;
            safety++;
        }
        return data;
    }

    /**
     * バックアップ用のキー名を生成する。
     * @param {string} key
     * @returns {string}
     */
    #backupKey(key) {
        return `${key}__backup`;
    }
}

/**
 * アプリ全体で共有するシングルトンSaveManagerインスタンス。
 * @type {SaveManager}
 */
export const saveManager = new SaveManager();
