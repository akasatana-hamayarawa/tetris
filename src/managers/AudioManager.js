import { assetManager } from './AssetManager.js';
import { logger } from '../core/Logger.js';
import { eventBus } from '../core/EventBus.js';

/**
 * AudioManager - BGM・効果音の再生、音量、ミュートを管理するクラス。
 *
 * 現時点でこのプロジェクトには音声ファイルが1つも存在しません。
 * そのため、このクラスは「アセットが登録されていないキーを再生しようとしても
 * 何もせず静かにスキップする」設計になっており、今すぐ組み込んでも安全です。
 * 将来 assets/audio/ 配下にファイルを追加し、assets/manifest.json に
 * 登録すれば、そのまま音が鳴るようになります(命名規則は
 * assets/audio/README.md を参照)。
 *
 * 発火するイベントを他のManagerが購読して呼び出す設計にしているため
 * (例: `audio:play-sfx` を StatisticsManager がライン消去時に発行する)、
 * ゲームロジック側は「AudioManagerを直接呼ぶ」のではなく
 * 「イベントを発行するだけ」で音を鳴らせる。
 *
 * @module managers/AudioManager
 */
export class AudioManager {
    /**
     * @param {import('./AssetManager.js').AssetManager} [assets=assetManager]
     */
    constructor(assets = assetManager) {
        /** @type {import('./AssetManager.js').AssetManager} */
        this.assets = assets;
        /** @type {number} 0.0〜1.0 */
        this.bgmVolume = 0.6;
        /** @type {number} 0.0〜1.0 */
        this.sfxVolume = 0.8;
        /** @type {boolean} */
        this.muted = false;
        /** @type {HTMLAudioElement|null} 現在再生中のBGM要素 */
        this.currentBgmKey = null;
        /** @type {HTMLAudioElement|null} */
        this.currentBgmElement = null;

        this.#bindEvents();
    }

    /**
     * EventBus経由での再生要求を購読する。
     * `audio:play-bgm` { key } / `audio:play-sfx` { key } / `audio:stop-bgm` /
     * `audio:set-volume` { bgm?, sfx? } / `audio:set-muted` { muted }
     * @returns {void}
     */
    #bindEvents() {
        eventBus.on('audio:play-bgm', ({ key, loop = true } = {}) => this.playBgm(key, loop));
        eventBus.on('audio:play-sfx', ({ key } = {}) => this.playSfx(key));
        eventBus.on('audio:stop-bgm', () => this.stopBgm());
        eventBus.on('audio:set-volume', ({ bgm, sfx } = {}) => {
            if (typeof bgm === 'number') this.setBgmVolume(bgm);
            if (typeof sfx === 'number') this.setSfxVolume(sfx);
        });
        eventBus.on('audio:set-muted', ({ muted } = {}) => this.setMuted(!!muted));
    }

    /**
     * BGMを再生する(既に同じキーを再生中なら何もしない。別キーならクロスフェード無しで切り替える)。
     * @param {string} key - assets/manifest.json に登録されたキー名(例: 'bgm-main')。
     * @param {boolean} [loop=true]
     * @returns {Promise<void>}
     */
    async playBgm(key, loop = true) {
        if (!key || this.currentBgmKey === key) return;
        this.stopBgm();

        const audio = await this.#safeGetAudio(key);
        if (!audio) return; // アセット未登録。静かにスキップ(将来ファイルが揃えば自動で鳴るようになる)

        audio.loop = loop;
        audio.volume = this.muted ? 0 : this.bgmVolume;
        this.currentBgmKey = key;
        this.currentBgmElement = audio;
        try {
            await audio.play();
        } catch (err) {
            // ブラウザの自動再生ポリシーでブロックされるケースがあるため、警告のみに留める
            logger.warn(`[AudioManager] BGM playback blocked or failed for "${key}":`, err);
        }
    }

    /**
     * 現在再生中のBGMを停止する。
     * @returns {void}
     */
    stopBgm() {
        if (this.currentBgmElement) {
            this.currentBgmElement.pause();
            this.currentBgmElement.currentTime = 0;
        }
        this.currentBgmKey = null;
        this.currentBgmElement = null;
    }

    /**
     * 効果音を1回再生する。同じ効果音を連打しても重ねて鳴らせるよう、
     * 要素をクローンしてから再生する。
     * @param {string} key - assets/manifest.json に登録されたキー名(例: 'sfx-lineclear')。
     * @returns {Promise<void>}
     */
    async playSfx(key) {
        if (!key || this.muted) return;
        const audio = await this.#safeGetAudio(key);
        if (!audio) return;

        const instance = audio.cloneNode(true);
        instance.volume = this.sfxVolume;
        try {
            await instance.play();
        } catch (err) {
            logger.warn(`[AudioManager] SFX playback failed for "${key}":`, err);
        }
    }

    /**
     * @param {string} key
     * @returns {Promise<HTMLAudioElement|null>}
     */
    async #safeGetAudio(key) {
        try {
            const audio = await this.assets.get(key);
            return audio || null;
        } catch (err) {
            logger.warn(`[AudioManager] could not load audio asset "${key}":`, err);
            return null;
        }
    }

    /**
     * BGM音量を設定する(現在再生中のBGMにも即座に反映)。
     * @param {number} volume - 0.0〜1.0
     * @returns {void}
     */
    setBgmVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.currentBgmElement) {
            this.currentBgmElement.volume = this.muted ? 0 : this.bgmVolume;
        }
    }

    /**
     * 効果音の音量を設定する。
     * @param {number} volume - 0.0〜1.0
     * @returns {void}
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * ミュートのON/OFFを切り替える。
     * @param {boolean} muted
     * @returns {void}
     */
    setMuted(muted) {
        this.muted = !!muted;
        if (this.currentBgmElement) {
            this.currentBgmElement.volume = this.muted ? 0 : this.bgmVolume;
        }
    }
}

/**
 * アプリ全体で共有するシングルトンAudioManagerインスタンス。
 * @type {AudioManager}
 */
export const audioManager = new AudioManager();
