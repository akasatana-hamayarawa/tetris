import { eventBus } from '../core/EventBus.js';

/**
 * ReplayManager - 操作ログ(入力イベント)と、一定間隔ごとの状態スナップショットを
 * 記録・再生するクラス。
 *
 * 重要: script.js の `pushReplayInputEvent()`(4464行)と `captureReplayFrame()`
 * (4866行)の**タイミング制御・データ構造部分**を、DOM/ボードインスタンスに
 * 依存しない形で切り出したものです。
 *
 * 「何を記録するか」(p1.getState()等の実際の盤面スナップショット)は、
 * このクラスの責務ではなく呼び出し側が用意します。ReplayManagerは
 * 「いつ記録するか」「どんな形式で保存するか」「どう再生するか」だけを扱います
 * (ARCHITECTURE.md 2章の設計方針: 各Managerは自分のドメインの状態だけを持つ)。
 *
 * 現時点では script.js 本体の呼び出し箇所はまだこちらへ切り替えていません。
 *
 * @module managers/ReplayManager
 */

/** script.js の `REPLAY_FRAME_INTERVAL` と同一値(ミリ秒)。フレームスナップショットの最短間隔。 */
export const REPLAY_FRAME_INTERVAL = 16;

export class ReplayManager {
    constructor() {
        this.#resetState();
    }

    /** @type {object|null} */
    #recording;

    #resetState() {
        /** @type {object|null} */
        this.recording = null;
        /** @type {boolean} */
        this.isPlayback = false;
    }

    /**
     * 新しい記録セッションを開始する。
     * @param {number} [startedAt=performance.now()]
     * @returns {void}
     * @fires replay:recording-started
     */
    startRecording(startedAt = performance.now()) {
        this.recording = {
            startedAt,
            lastCapturedAt: -Infinity,
            frames: [],
            inputs: [],
            sequence: 0
        };
        eventBus.emit('replay:recording-started', { startedAt });
    }

    /**
     * 入力イベントを記録する(再生中は記録しない)。
     * @param {string} kind - 'down' | 'up' 等。
     * @param {string} key - 生キー。
     * @param {string} matchedKey - 正規化後のキー。
     * @param {number} [timestamp=performance.now()]
     * @returns {void}
     */
    recordInput(kind, key, matchedKey, timestamp = performance.now()) {
        if (!this.recording || this.isPlayback) return;
        const startedAt = typeof this.recording.startedAt === 'number' ? this.recording.startedAt : timestamp;
        this.recording.inputs.push({
            at: Math.max(0, Math.round(timestamp - startedAt)),
            kind,
            key: String(key || ''),
            matchedKey: String(matchedKey || key || '')
        });
    }

    /**
     * 一定間隔(`REPLAY_FRAME_INTERVAL`)ごとに呼ぶことを想定した、状態スナップショットの記録。
     * 間隔が短すぎる場合は記録をスキップする(`force`で強制記録可能)。
     * @param {object} stateSnapshot - 呼び出し側が用意した盤面状態(getState()の結果等)。
     * @param {number} [timestamp=performance.now()]
     * @param {boolean} [force=false]
     * @returns {boolean} 実際に記録したか。
     */
    captureFrame(stateSnapshot, timestamp = performance.now(), force = false) {
        if (!this.recording) return false;
        if (!force && (timestamp - this.recording.lastCapturedAt) < REPLAY_FRAME_INTERVAL) return false;
        if (typeof this.recording.startedAt !== 'number') this.recording.startedAt = timestamp;

        this.recording.frames.push({
            at: Math.max(0, Math.round(timestamp - this.recording.startedAt)),
            seq: this.recording.sequence++,
            ...stateSnapshot
        });
        this.recording.lastCapturedAt = timestamp;
        return true;
    }

    /**
     * 記録を終了し、リプレイデータを取得する。
     * @returns {object|null} `{ startedAt, frames, inputs }` 形式。記録が無ければnull。
     * @fires replay:recording-stopped
     */
    stopRecording() {
        if (!this.recording) return null;
        const result = this.recording;
        eventBus.emit('replay:recording-stopped', { frameCount: result.frames.length, inputCount: result.inputs.length });
        this.recording = null;
        return result;
    }

    /**
     * 再生モードを開始する(再生中は`recordInput`が無視される)。
     * @returns {void}
     * @fires replay:playback-started
     */
    startPlayback() {
        this.isPlayback = true;
        eventBus.emit('replay:playback-started', {});
    }

    /**
     * 再生モードを終了する。
     * @returns {void}
     * @fires replay:playback-stopped
     */
    stopPlayback() {
        this.isPlayback = false;
        eventBus.emit('replay:playback-stopped', {});
    }

    /**
     * 記録中かどうか。
     * @returns {boolean}
     */
    isRecording() {
        return !!this.recording;
    }
}

/**
 * アプリ全体で共有するシングルトンReplayManagerインスタンス。
 * @type {ReplayManager}
 */
export const replayManager = new ReplayManager();
