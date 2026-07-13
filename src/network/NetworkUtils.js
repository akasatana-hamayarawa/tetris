/**
 * NetworkUtils - 通信関連の純粋関数群(RTT計算・接続状態の判定)。
 *
 * script.js の `conn.send({ type: 'ping', token, stamp: Date.now() })` →
 * 応答受信時に `Date.now() - stamp` でRTTを計算するパターンを、
 * 独立した純粋関数として切り出したものです。
 *
 * @module network/NetworkUtils
 */

/**
 * ping送信時刻と現在時刻からRTT(往復遅延)を計算する。
 * @param {number} sentAtMs - ping送信時のタイムスタンプ(ms)。
 * @param {number} [nowMs=Date.now()] - pong受信時のタイムスタンプ(ms)。
 * @returns {number} RTT(ms)。負の値にはならない。
 */
export function calculateRTT(sentAtMs, nowMs = Date.now()) {
    return Math.max(0, nowMs - sentAtMs);
}

/**
 * 直近のRTT測定値一覧から、平均RTTと安定性(ジッター、標準偏差)を計算する。
 * @param {number[]} rttSamples
 * @returns {{average: number, jitter: number, min: number, max: number}}
 */
export function summarizeRTT(rttSamples) {
    if (!rttSamples.length) return { average: 0, jitter: 0, min: 0, max: 0 };
    const average = rttSamples.reduce((a, b) => a + b, 0) / rttSamples.length;
    const variance = rttSamples.reduce((acc, v) => acc + Math.pow(v - average, 2), 0) / rttSamples.length;
    return {
        average: Math.round(average),
        jitter: Math.round(Math.sqrt(variance)),
        min: Math.min(...rttSamples),
        max: Math.max(...rttSamples)
    };
}

/**
 * 最後の通信からの経過時間をもとに、接続がタイムアウトしたとみなすべきかを判定する。
 * @param {number} lastMessageAt - 最後にメッセージを受信した時刻(ms)。
 * @param {number} timeoutMs - タイムアウトとみなす経過時間(ms)。
 * @param {number} [nowMs=Date.now()]
 * @returns {boolean}
 */
export function isConnectionTimedOut(lastMessageAt, timeoutMs, nowMs = Date.now()) {
    return (nowMs - lastMessageAt) > timeoutMs;
}
