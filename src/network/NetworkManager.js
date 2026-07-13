import { eventBus } from '../core/EventBus.js';
import { logger } from '../core/Logger.js';
import { calculateRTT, summarizeRTT, isConnectionTimedOut } from './NetworkUtils.js';

/**
 * NetworkManager - 接続の追跡・RTT計測・タイムアウト検知を行うクラス。
 *
 * **重要な設計判断(正直に)**: このクラスは実際のPeerJS/WebRTC接続を
 * 自分では作成しません。`setTransport()`で外部から「送信手段」を注入する
 * 方式(Transport抽象化)にしています。理由:
 *   1. 実際のP2P接続コードは、複数ブラウザ/端末での実機テストなしに
 *      安全に書き換えられないと、このセッションを通じて一貫して判断してきました。
 *   2. Transportを抽象化することで、本物のPeerJSに依存せず、
 *      モック(偽の送信手段)を使ったユニットテストが可能になり、
 *      「接続管理・RTT計算・タイムアウト検知」というロジック部分だけは
 *      実機無しでも確実に検証できます。
 *
 * 実際に`script.js`の`new Peer(...)`や`conn.on('data', ...)`をこちらに
 * 接続する(Transportアダプタを書く)作業は、複数端末での実機テストが
 * できる環境(VS Code + 実際のブラウザ2つ以上)で行うことを強く推奨します。
 *
 * @module network/NetworkManager
 */
export class NetworkManager {
    constructor() {
        /** @type {Map<string, {rttSamples: number[], lastMessageAt: number}>} */
        this.connections = new Map();
        /** @type {{send: (id: string, packet: object) => void}|null} */
        this.transport = null;
        /** @type {number} RTT履歴として保持する最大サンプル数 */
        this.maxRttSamples = 20;
    }

    /**
     * 送信手段(Transportアダプタ)を注入する。
     * @param {{send: (id: string, packet: object) => void}} transport
     * @returns {void}
     */
    setTransport(transport) {
        this.transport = transport;
    }

    /**
     * 新しい接続を登録する。
     * @param {string} id - 接続ID(PeerJSのconnection.peer等)。
     * @returns {void}
     * @fires network:connection-registered
     */
    registerConnection(id) {
        this.connections.set(id, { rttSamples: [], lastMessageAt: Date.now() });
        eventBus.emit('network:connection-registered', { id });
    }

    /**
     * 接続を削除する。
     * @param {string} id
     * @returns {void}
     * @fires network:connection-removed
     */
    removeConnection(id) {
        this.connections.delete(id);
        eventBus.emit('network:connection-removed', { id });
    }

    /**
     * @returns {string[]} 現在登録されている接続ID一覧。
     */
    getConnectionIds() {
        return Array.from(this.connections.keys());
    }

    /**
     * パケットを送信する(Transportが未設定の場合はエラーを投げる)。
     * @param {string} id
     * @param {object} packet
     * @returns {void}
     */
    send(id, packet) {
        if (!this.transport) {
            throw new Error('NetworkManager.send: no transport has been set. Call setTransport() first.');
        }
        this.transport.send(id, packet);
    }

    /**
     * メッセージ受信を記録する(タイムアウト検知用)。
     * @param {string} id
     * @param {number} [timestamp=Date.now()]
     * @returns {void}
     */
    recordMessageReceived(id, timestamp = Date.now()) {
        const conn = this.connections.get(id);
        if (conn) conn.lastMessageAt = timestamp;
    }

    /**
     * pong受信時にRTTを記録する。
     * @param {string} id
     * @param {number} sentAtMs - 対応するping送信時のタイムスタンプ。
     * @param {number} [nowMs=Date.now()]
     * @returns {number} 計算されたRTT。
     * @fires network:rtt-updated
     */
    recordPong(id, sentAtMs, nowMs = Date.now()) {
        const conn = this.connections.get(id);
        if (!conn) {
            logger.warn(`[NetworkManager] recordPong called for unknown connection: "${id}"`);
            return 0;
        }
        const rtt = calculateRTT(sentAtMs, nowMs);
        conn.rttSamples.push(rtt);
        if (conn.rttSamples.length > this.maxRttSamples) conn.rttSamples.shift();
        conn.lastMessageAt = nowMs;

        const summary = summarizeRTT(conn.rttSamples);
        eventBus.emit('network:rtt-updated', { id, rtt, summary });
        return rtt;
    }

    /**
     * 指定接続のRTT統計を取得する。
     * @param {string} id
     * @returns {{average: number, jitter: number, min: number, max: number}|null}
     */
    getConnectionStats(id) {
        const conn = this.connections.get(id);
        if (!conn) return null;
        return summarizeRTT(conn.rttSamples);
    }

    /**
     * 全接続に対してタイムアウトを検知する。タイムアウトした接続IDの一覧を返す。
     * @param {number} timeoutMs
     * @param {number} [nowMs=Date.now()]
     * @returns {string[]}
     * @fires network:connection-timeout
     */
    checkTimeouts(timeoutMs, nowMs = Date.now()) {
        const timedOut = [];
        for (const [id, conn] of this.connections.entries()) {
            if (isConnectionTimedOut(conn.lastMessageAt, timeoutMs, nowMs)) {
                timedOut.push(id);
                eventBus.emit('network:connection-timeout', { id });
            }
        }
        return timedOut;
    }
}

/**
 * アプリ全体で共有するシングルトンNetworkManagerインスタンス。
 * @type {NetworkManager}
 */
export const networkManager = new NetworkManager();
