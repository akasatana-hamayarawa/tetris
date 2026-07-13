import { checkCollision, isPieceGrounded } from './CollisionSystem.js';

/**
 * RotationSystem - ミノの回転行列計算とSRS壁蹴り解決を行う純粋関数群。
 *
 * 重要: このファイルは script.js の `Board.prototype.playerRotate()`
 * (8928行付近)の**回転計算部分だけ**を、副作用を除いて書き写したものです。
 * 元の `playerRotate()` は以下も行っていますが、これらは盤面インスタンスの
 * 状態(演出・リプレイ・O-Spin変形・ロック遅延カウンタ)に関わる副作用のため、
 * このモジュールには含めていません(Board クラス側に残す想定):
 *   - O-Spin判定・ミノ変形演出
 *   - リプレイフレームの記録(captureReplayFrame)
 *   - ロックリセットカウンタの更新(registerLockResetAction)
 *   - Admin Cheatの操作ロック確認(isAdminControlLockActive)
 *
 * 元の実装(該当部分抜粋):
 * ```js
 * const rotated = this.player.matrix[0].map((_, i) => this.player.matrix.map(row => row[i]));
 * this.player.matrix = dir > 0 ? rotated.map(row => row.reverse()) : rotated.reverse();
 * const kickTable = (this.player.type === 'I') ? KICKS_I : KICKS;
 * const kickSet = kickTable[`${oldR}-${newR}`] || [[0, 0]];
 * const kickScale = (this.ruleSet.giantBlocks && this.player.type !== 'B') ? 2 : 1;
 * for (let [kx, ky] of kickSet) {
 *     this.player.pos.x += kx * kickScale; this.player.pos.y -= ky * kickScale;
 *     if (!this.collide()) {
 *         if (this.player.type === 'I' && this.player.pos.y < oldP.y && !this.isPieceGrounded()) {
 *             this.player.pos = { ...oldP };
 *             continue;
 *         }
 *         success = true; usedKick = (kx !== 0 || ky !== 0); break;
 *     }
 *     this.player.pos = { ...oldP };
 * }
 * ```
 *
 * @module game/systems/RotationSystem
 */

/**
 * ミノ行列を90度回転させる(元の実装の転置+反転ロジックと同一)。
 * @param {number[][]} matrix
 * @param {1|-1} dir - 1で右回転(時計回り)、-1で左回転(反時計回り)。
 * @returns {number[][]} 回転後の新しい行列(元の行列は変更しない)。
 */
export function rotateMatrix(matrix, dir) {
    const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
    return dir > 0 ? transposed.map(row => row.slice().reverse()) : transposed.slice().reverse();
}

/**
 * SRS壁蹴りを試行し、回転が成立するかを判定する。
 *
 * @param {object} params
 * @param {number[][]} params.matrix - 回転前のミノ行列。
 * @param {number} params.rotation - 回転前の回転状態(0-3)。
 * @param {{x: number, y: number}} params.position - 回転前の盤面上座標。
 * @param {string} params.pieceType - ミノ種別('I'なら専用キックテーブルを使用)。
 * @param {1|-1} params.dir - 回転方向。
 * @param {number[][]} params.arena - 盤面状態。
 * @param {number} params.boardWidth
 * @param {number} params.arenaHeight
 * @param {Record<string, [number, number][]>} params.kicks - 通常ミノ用SRSキックテーブル。
 * @param {Record<string, [number, number][]>} params.kicksI - Iミノ用SRSキックテーブル。
 * @param {boolean} [params.giantBlocks=false] - 大型ブロックルール(キック幅2倍)。
 * @returns {{
 *   success: boolean,
 *   matrix?: number[][],
 *   rotation?: number,
 *   position?: {x: number, y: number},
 *   usedKick?: boolean
 * }} 成立した場合は新しい行列・回転状態・座標・キック使用有無を返す。
 *   不成立の場合は `{ success: false }` のみを返す(呼び出し側は元の状態を維持すること)。
 */
export function attemptRotation({
    matrix, rotation, position, pieceType, dir,
    arena, boardWidth, arenaHeight, kicks, kicksI, giantBlocks = false
}) {
    const oldRotation = rotation;
    const oldPosition = { ...position };
    const newRotation = (oldRotation + dir + 4) % 4;
    const newMatrix = rotateMatrix(matrix, dir);

    const kickTable = (pieceType === 'I') ? kicksI : kicks;
    const kickSet = kickTable[`${oldRotation}-${newRotation}`] || [[0, 0]];
    const kickScale = (giantBlocks && pieceType !== 'B') ? 2 : 1;

    let currentPos = { ...oldPosition };

    for (const [kx, ky] of kickSet) {
        currentPos = { x: currentPos.x + kx * kickScale, y: currentPos.y - ky * kickScale };

        if (!checkCollision(newMatrix, currentPos, arena, boardWidth, arenaHeight)) {
            // Iミノ特有のルール: キックで上に浮いた状態のまま接地していない回転は不成立にする
            if (pieceType === 'I' && currentPos.y < oldPosition.y &&
                !isPieceGrounded(newMatrix, currentPos, arena, boardWidth, arenaHeight)) {
                currentPos = { ...oldPosition };
                continue;
            }
            return {
                success: true,
                matrix: newMatrix,
                rotation: newRotation,
                position: currentPos,
                usedKick: (kx !== 0 || ky !== 0)
            };
        }
        currentPos = { ...oldPosition };
    }

    return { success: false };
}
