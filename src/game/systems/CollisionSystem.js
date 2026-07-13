/**
 * CollisionSystem - 盤面とミノの当たり判定を行う純粋関数群。
 *
 * 重要: このファイルの `checkCollision` は、script.js の
 * `Board.prototype.collide()`(8900行付近)と**完全に同じアルゴリズム**を、
 * DOM/クラスインスタンスに依存しない純粋関数として書き写したものです。
 * 1行ずつ元の実装と突き合わせて移植しており、ロジックは一切変えていません。
 *
 * 元の実装:
 * ```js
 * collide(m = this.player.matrix, o = this.player.pos) {
 *     for (let y = 0; y < m.length; ++y) {
 *         for (let x = 0; x < m[y].length; ++x) {
 *             if (m[y][x] !== 0) {
 *                 const ay = y + o.y, ax = x + o.x;
 *                 if (ay >= this.getArenaHeight() || ax < 0 || ax >= this.getBoardWidth() || (ay >= 0 && this.arena[ay][ax] !== 0)) return true;
 *             }
 *         }
 *     }
 *     return false;
 * }
 * ```
 *
 * 現時点では script.js 側の `collide()` メソッドはまだこの関数へ委譲していません
 * (Board クラス内で従来通り動作しています)。これは「移植先」として先に
 * 用意したものであり、Phase 6の後半で `Board.collide()` の中身を
 * `return checkCollision(...)` 一行に置き換える形で統合する想定です。
 *
 * @module game/systems/CollisionSystem
 */

/**
 * ミノ行列が、指定位置で盤面外または既存ブロックと衝突するかを判定する。
 * @param {number[][]} matrix - ミノの行列(0=空、0以外=ブロックあり)。
 * @param {{x: number, y: number}} offset - 盤面上でのミノの左上座標。
 * @param {number[][]} arena - 盤面の状態(0=空、0以外=既存ブロック)。
 * @param {number} boardWidth - 盤面の横幅(マス数)。
 * @param {number} arenaHeight - 盤面の縦幅(マス数、非表示の上部バッファも含む)。
 * @returns {boolean} 衝突する場合 true。
 */
export function checkCollision(matrix, offset, arena, boardWidth, arenaHeight) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < matrix[y].length; ++x) {
            if (matrix[y][x] !== 0) {
                const ay = y + offset.y;
                const ax = x + offset.x;
                if (
                    ay >= arenaHeight ||
                    ax < 0 ||
                    ax >= boardWidth ||
                    (ay >= 0 && arena[ay][ax] !== 0)
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * ミノが「接地しているか」(1マス下に動かすと衝突するか)を判定する。
 * 元の実装: `isPieceGrounded(m, o) { return this.collide(m, { x: o.x, y: o.y + 1 }); }`
 * @param {number[][]} matrix
 * @param {{x: number, y: number}} offset
 * @param {number[][]} arena
 * @param {number} boardWidth
 * @param {number} arenaHeight
 * @returns {boolean}
 */
export function isPieceGrounded(matrix, offset, arena, boardWidth, arenaHeight) {
    return checkCollision(matrix, { x: offset.x, y: offset.y + 1 }, arena, boardWidth, arenaHeight);
}
