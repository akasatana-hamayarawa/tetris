import { checkCollision } from './CollisionSystem.js';

/**
 * GhostPieceSystem - ゴーストピース(落下予測地点)の位置計算を行う純粋関数。
 *
 * 重要: script.js の描画処理内にある以下のロジックと完全に同じです(9628行付近):
 * ```js
 * const gp = { ...this.player.pos };
 * while (!this.collide(this.player.matrix, { x: gp.x, y: gp.y + 1 })) gp.y++;
 * ```
 *
 * @module game/systems/GhostPieceSystem
 */

/**
 * 現在のミノが真下に落下できる最終地点(ゴースト位置)を計算する。
 * @param {number[][]} matrix - ミノの行列。
 * @param {{x: number, y: number}} position - 現在の位置。
 * @param {number[][]} arena
 * @param {number} boardWidth
 * @param {number} arenaHeight
 * @returns {{x: number, y: number}} ゴースト位置(新しいオブジェクト。引数は変更しない)。
 */
export function calculateGhostPosition(matrix, position, arena, boardWidth, arenaHeight) {
    const ghostPos = { ...position };
    while (!checkCollision(matrix, { x: ghostPos.x, y: ghostPos.y + 1 }, arena, boardWidth, arenaHeight)) {
        ghostPos.y++;
    }
    return ghostPos;
}
