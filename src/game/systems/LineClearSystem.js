/**
 * LineClearSystem - 揃った行を検出して盤面から取り除く純粋関数群。
 *
 * 重要: script.js の `Board.prototype.sweep()` (9081行付近) の
 * **ライン検出・除去部分だけ**を、副作用(スコア加算・レベル計算・
 * B2B/コンボ更新・攻撃計算など)を除いて純粋関数化したものです。
 * 元のロジック(下から走査し、埋まった行を削除して上に空行を追加する)は
 * 一切変えていません。
 *
 * 元の実装(該当部分抜粋):
 * ```js
 * let lines = 0;
 * outer: for (let y = this.getArenaHeight() - 1; y >= 0; --y) {
 *     for (let x = 0; x < this.getBoardWidth(); ++x) { if (this.arena[y][x] === 0) continue outer; }
 *     this.arena.splice(y, 1); this.arena.unshift(new Array(this.getBoardWidth()).fill(0)); ++y; lines++;
 * }
 * ```
 *
 * @module game/systems/LineClearSystem
 */

/**
 * 盤面を走査し、揃っている行を取り除いた**新しい盤面**と、消えた行数を返す。
 * 元の配列は変更しない(イミュータブル)。
 *
 * @param {number[][]} arena - 現在の盤面状態。
 * @param {number} boardWidth
 * @param {number} arenaHeight
 * @returns {{ arena: number[][], linesCleared: number }}
 */
export function sweepLines(arena, boardWidth, arenaHeight) {
    // 元のロジックを忠実に再現するため、破壊的な splice/unshift 相当の操作を
    // 「作業用コピー」に対して行う(呼び出し側の元配列は変更しない)。
    const working = arena.map(row => row.slice());
    let linesCleared = 0;

    outer:
    for (let y = arenaHeight - 1; y >= 0; --y) {
        for (let x = 0; x < boardWidth; ++x) {
            if (working[y][x] === 0) continue outer;
        }
        working.splice(y, 1);
        working.unshift(new Array(boardWidth).fill(0));
        ++y;
        linesCleared++;
    }

    return { arena: working, linesCleared };
}

/**
 * 盤面が完全に空(パーフェクトクリア)かどうかを判定する。
 * 元の実装: `const isPerfectClear = this.arena.every(row => row.every(cell => cell === 0));`
 * @param {number[][]} arena
 * @returns {boolean}
 */
export function isPerfectClear(arena) {
    return arena.every(row => row.every(cell => cell === 0));
}
