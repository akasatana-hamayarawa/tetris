import { logger } from '../core/Logger.js';
import { eventBus } from '../core/EventBus.js';

/**
 * AssetManager - 画像・音楽・効果音・フォント・テーマ画像を一元管理するクラス。
 *
 * - `manifest.json` を読み込み、キー名でアセットを取得できるようにする。
 * - 同一キーの二重ロードを防ぐ(ロード中のPromiseをキャッシュする)。
 * - プリロードの進捗を `asset:progress` イベントで通知する。
 *
 * 現時点でこのプロジェクトには画像・音声アセットがまだ存在しないため
 * (`assets/manifest.json` は空)、このクラスは「今後アセットが追加された時に
 * 迷わず使える受け皿」として先に用意したものです。空のmanifestでも
 * エラーにならず、安全に呼び出せます。
 *
 * @module managers/AssetManager
 */
export class AssetManager {
    constructor() {
        /** @type {Map<string, string>} キー -> URLパス */
        this.paths = new Map();
        /** @type {Map<string, any>} キー -> ロード済みアセット(Image要素、AudioBuffer等) */
        this.cache = new Map();
        /** @type {Map<string, Promise<any>>} キー -> ロード中のPromise(二重ロード防止) */
        this.loading = new Map();
        /** @type {'image'|'audio'|'font'} キー -> 種別 の対応表 */
        this.kindByKey = new Map();
    }

    /**
     * manifest.jsonを読み込み、内部のパス一覧を構築する。
     * @param {string} manifestUrl - manifest.jsonのURL。
     * @returns {Promise<void>}
     */
    async loadManifest(manifestUrl) {
        try {
            const res = await fetch(manifestUrl);
            const manifest = await res.json();
            this.#registerSection(manifest.images, 'image');
            this.#registerSection(manifest.audio, 'audio');
            this.#registerSection(manifest.fonts, 'font');
            logger.info(`[AssetManager] manifest loaded: ${this.paths.size} entries.`);
        } catch (err) {
            logger.warn('[AssetManager] failed to load manifest (this is OK if no assets exist yet):', err);
        }
    }

    /**
     * @param {Record<string,string>|undefined} section
     * @param {'image'|'audio'|'font'} kind
     * @returns {void}
     */
    #registerSection(section, kind) {
        if (!section) return;
        for (const [key, path] of Object.entries(section)) {
            this.paths.set(key, path);
            this.kindByKey.set(key, kind);
        }
    }

    /**
     * 手動で1件だけアセットパスを登録する(テーマごとの画像等、manifest外のものに使用)。
     * @param {string} key
     * @param {string} path
     * @param {'image'|'audio'|'font'} kind
     * @returns {void}
     */
    register(key, path, kind) {
        this.paths.set(key, path);
        this.kindByKey.set(key, kind);
    }

    /**
     * 登録済みの全アセットをプリロードする。進捗を `asset:progress` イベントで通知する。
     * @returns {Promise<void>}
     * @fires asset:progress
     * @fires asset:preload-complete
     */
    async preloadAll() {
        const keys = Array.from(this.paths.keys());
        const total = keys.length;
        if (total === 0) {
            eventBus.emit('asset:preload-complete', { total: 0, loaded: 0 });
            return;
        }
        let loaded = 0;
        await Promise.all(keys.map(async (key) => {
            try {
                await this.get(key);
            } catch (err) {
                logger.warn(`[AssetManager] failed to preload "${key}":`, err);
            } finally {
                loaded++;
                eventBus.emit('asset:progress', { key, loaded, total, ratio: loaded / total });
            }
        }));
        eventBus.emit('asset:preload-complete', { total, loaded });
    }

    /**
     * アセットを取得する(未ロードなら読み込んでキャッシュする)。
     * @param {string} key
     * @returns {Promise<any>}
     */
    async get(key) {
        if (this.cache.has(key)) return this.cache.get(key);
        if (this.loading.has(key)) return this.loading.get(key);

        const path = this.paths.get(key);
        if (!path) {
            logger.warn(`[AssetManager] unknown asset key: "${key}"`);
            return null;
        }

        const kind = this.kindByKey.get(key);
        const promise = this.#loadByKind(path, kind).then((asset) => {
            this.cache.set(key, asset);
            this.loading.delete(key);
            return asset;
        }).catch((err) => {
            this.loading.delete(key);
            throw err;
        });

        this.loading.set(key, promise);
        return promise;
    }

    /**
     * 種別に応じたロード処理を行う。
     * @param {string} path
     * @param {'image'|'audio'|'font'} kind
     * @returns {Promise<any>}
     */
    #loadByKind(path, kind) {
        if (kind === 'image') return this.#loadImage(path);
        if (kind === 'audio') return this.#loadAudio(path);
        if (kind === 'font') return this.#loadFont(path);
        // 種別不明の場合は生パスをそのまま返す(呼び出し側で自由に使えるように)
        return Promise.resolve(path);
    }

    /**
     * @param {string} path
     * @returns {Promise<HTMLImageElement>}
     */
    #loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
            img.src = path;
        });
    }

    /**
     * @param {string} path
     * @returns {Promise<HTMLAudioElement>}
     */
    #loadAudio(path) {
        return new Promise((resolve, reject) => {
            const audio = new window.Audio();
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = () => reject(new Error(`Failed to load audio: ${path}`));
            audio.src = path;
            audio.load();
        });
    }

    /**
     * @param {string} path
     * @returns {Promise<FontFace|string>}
     */
    async #loadFont(path) {
        if (typeof FontFace === 'undefined') return path;
        const fontName = path.split('/').pop().split('.')[0];
        const font = new FontFace(fontName, `url(${path})`);
        await font.load();
        document.fonts.add(font);
        return font;
    }

    /**
     * 指定キーがロード済みキャッシュにあるかどうか。
     * @param {string} key
     * @returns {boolean}
     */
    isLoaded(key) {
        return this.cache.has(key);
    }

    /**
     * キャッシュを全て破棄する(テーマ切替時のメモリ解放等に使用可能)。
     * @returns {void}
     */
    clearCache() {
        this.cache.clear();
    }
}

/**
 * アプリ全体で共有するシングルトンAssetManagerインスタンス。
 * @type {AssetManager}
 */
export const assetManager = new AssetManager();
