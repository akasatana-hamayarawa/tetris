/**
 * NetworkProtocol - script.js のオンライン対戦で実際に使われている
 * パケットtype文字列を一箇所に集約したもの。
 *
 * 重要: これは**通信ロジックを一切含まない、文字列定数の集約のみ**です。
 * 実際に`conn.send({...})`を呼んでいる箇所(script.js内、20箇所以上)は
 * まだこちらを参照していません。今後、通信コードを書き換える際に
 * タイプミスを防ぐための「正解一覧」として先に用意しました。
 *
 * @module network/NetworkProtocol
 */
export const NetworkPacketType = Object.freeze({
    ATTACK: 'attack',
    STATE: 'state',
    MULTI_STATE: 'multi_state',
    PING: 'ping',
    LOBBY_UPDATE: 'lobby_update',
    LOBBY_CHAT: 'lobby_chat',
    ACTION_TEXT: 'action_text',
    FRIEND_REQUEST: 'friend_request',
    FRIEND_ACCEPT: 'friend_accept',
    FRIEND_DECLINE: 'friend_decline',
    PRESENCE_PING: 'presence_ping',
    PRESENCE_PONG: 'presence_pong',
    CHALLENGE_RESPONSE: 'challenge_response',
    REPLAY_ARCHIVE: 'replay_archive',
    REPLAY_ARCHIVE_PAYLOAD: 'replay_archive_payload',
    REPLAY_REQUEST: 'replay_request',
    REMATCH_REQUEST: 'rematch_request',
    QM_READY: 'qm_ready'
});

/**
 * 受信したパケットのtypeが既知の値かどうかを判定する。
 * @param {any} packet
 * @returns {boolean}
 */
export function isKnownPacketType(packet) {
    if (!packet || typeof packet.type !== 'string') return false;
    return Object.values(NetworkPacketType).includes(packet.type);
}
