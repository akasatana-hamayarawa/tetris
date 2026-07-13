/**
 * GameState - ゲーム全体の状態(State Machine)の列挙。
 *
 * ARCHITECTURE.md 11章の仕様通り。この値を変更できるのは`GameManager`だけであり、
 * 他のManagerは読み取り専用として参照する。
 *
 * @module core/GameState
 */

/** @typedef {'LOADING'|'TITLE'|'READY'|'PLAYING'|'PAUSED'|'RESULT'|'REPLAY'|'ONLINE'|'CONNECTING'|'DISCONNECTED'} GameStateValue */

export const GameState = Object.freeze({
    LOADING: 'LOADING',
    TITLE: 'TITLE',
    READY: 'READY',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    RESULT: 'RESULT',
    REPLAY: 'REPLAY',
    ONLINE: 'ONLINE',
    CONNECTING: 'CONNECTING',
    DISCONNECTED: 'DISCONNECTED'
});

/**
 * 許可されている状態遷移のテーブル。key=遷移元、value=遷移可能な状態の配列。
 * GameManager以外はこのテーブルを直接参照・変更しないこと。
 * @type {Record<GameStateValue, GameStateValue[]>}
 */
export const ALLOWED_TRANSITIONS = {
    [GameState.LOADING]: [GameState.TITLE],
    [GameState.TITLE]: [GameState.READY, GameState.CONNECTING, GameState.REPLAY],
    [GameState.READY]: [GameState.PLAYING, GameState.TITLE],
    [GameState.PLAYING]: [GameState.PAUSED, GameState.RESULT, GameState.DISCONNECTED, GameState.TITLE],
    [GameState.PAUSED]: [GameState.PLAYING, GameState.TITLE],
    [GameState.RESULT]: [GameState.TITLE, GameState.READY],
    [GameState.REPLAY]: [GameState.TITLE],
    [GameState.CONNECTING]: [GameState.ONLINE, GameState.TITLE, GameState.DISCONNECTED],
    [GameState.ONLINE]: [GameState.PLAYING, GameState.DISCONNECTED, GameState.TITLE],
    [GameState.DISCONNECTED]: [GameState.TITLE]
};

/**
 * ある状態から別の状態への遷移が許可されているかを判定する。
 * @param {GameStateValue} from
 * @param {GameStateValue} to
 * @returns {boolean}
 */
export function isTransitionAllowed(from, to) {
    const allowed = ALLOWED_TRANSITIONS[from];
    return Array.isArray(allowed) && allowed.includes(to);
}
