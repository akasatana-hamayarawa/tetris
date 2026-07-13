import { checkCollision } from './CollisionSystem.js';

/**
 * TSpinSystem - T-Spin判定・汎用スピン判定(All-Spin表示用)の純粋関数群。
 *
 * 重要: script.js の `Board.prototype.checkTSpin()` (9053行付近) と
 * `checkGenericSpinLabel()` (9070行付近) を、DOM/クラス状態に依存しない
 * 純粋関数として書き写したものです。判定アルゴリズムは変えていません。
 *
 * @module game/systems/TSpinSystem
 */

/**
 * Tミノの4隅のうち3つ以上が壁/床/既存ブロックで塞がれていればT-Spinと判定する
 * (コーナールール)。フロント側(回転方向に応じた前方2隅)が2つとも塞がっていなければ
 * Mini T-Spin。
 *
 * 元の実装:
 * ```js
 * checkTSpin() {
 *     let corners = 0; let frontCorners = 0; const { x, y } = this.player.pos;
 *     const cornerCoords = [{x:0,y:0},{x:2,y:0},{x:0,y:2},{x:2,y:2}];
 *     const frontMap = { 0: [0,1], 1: [1,3], 2: [2,3], 3: [0,2] };
 *     const myFronts = frontMap[this.player.rotation];
 *     cornerCoords.forEach((c, i) => {
 *         const ay = y + c.y, ax = x + c.x;
 *         if (ax < 0 || ax >= this.getBoardWidth() || ay >= this.getArenaHeight() || (ay >= 0 && this.arena[ay][ax] !== 0)) { corners++; if (myFronts.includes(i)) frontCorners++; }
 *     });
 *     return corners >= 3 ? { isTSpin: true, isMini: frontCorners < 2 } : { isTSpin: false, isMini: false };
 * }
 * ```
 *
 * @param {{x: number, y: number}} position - Tミノの左上座標(3x3行列の左上)。
 * @param {number} rotation - 現在の回転状態(0-3)。
 * @param {number[][]} arena
 * @param {number} boardWidth
 * @param {number} arenaHeight
 * @returns {{isTSpin: boolean, isMini: boolean}}
 */
export function checkTSpin(position, rotation, arena, boardWidth, arenaHeight) {
    let corners = 0;
    let frontCorners = 0;
    const { x, y } = position;
    const cornerCoords = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 }];
    const frontMap = { 0: [0, 1], 1: [1, 3], 2: [2, 3], 3: [0, 2] };
    const myFronts = frontMap[rotation];

    cornerCoords.forEach((c, i) => {
        const ay = y + c.y;
        const ax = x + c.x;
        const blocked = ax < 0 || ax >= boardWidth || ay >= arenaHeight || (ay >= 0 && arena[ay][ax] !== 0);
        if (blocked) {
            corners++;
            if (myFronts.includes(i)) frontCorners++;
        }
    });

    return corners >= 3
        ? { isTSpin: true, isMini: frontCorners < 2 }
        : { isTSpin: false, isMini: false };
}

/**
 * ライン数から表示名を得る("SINGLE"/"DOUBLE"等)。
 * 元の実装: `getSpinLineLabel(lines)`。
 * @param {number} lines
 * @returns {string}
 */
export function getSpinLineLabel(lines) {
    const lineNames = ["NON-LINE", "SINGLE", "DOUBLE", "TRIPLE", "QUAD"];
    return lineNames[Math.min(lines, 4)] || `${lines} LINES`;
}

/**
 * T以外のミノ(I/J/L/S/Z)による「汎用スピン」(All-Spin)を判定する。
 * 回転直後に3方向(下/左/右)のうち十分な数が塞がっていれば成立する。
 *
 * 元の実装:
 * ```js
 * checkGenericSpinLabel(lines = 0) {
 *     if (cfg.allSpinDisplay === false || !this.lastMoveRotate) return null;
 *     if (!['I','J','L','S','Z'].includes(this.player.type)) return null;
 *     const downBlocked = this.collide(this.player.matrix, { x: this.player.pos.x, y: this.player.pos.y + 1 });
 *     const leftBlocked = this.collide(this.player.matrix, { x: this.player.pos.x - 1, y: this.player.pos.y });
 *     const rightBlocked = this.collide(this.player.matrix, { x: this.player.pos.x + 1, y: this.player.pos.y });
 *     const blockedCount = (downBlocked?1:0) + (leftBlocked?1:0) + (rightBlocked?1:0);
 *     if (!this.lastRotationUsedKick && blockedCount < 3 && !(downBlocked && (leftBlocked || rightBlocked))) return null;
 *     return `${this.player.type}-SPIN ${this.getSpinLineLabel(lines)}`;
 * }
 * ```
 *
 * @param {object} params
 * @param {boolean} params.allSpinDisplayEnabled - `cfg.allSpinDisplay`に相当。
 * @param {boolean} params.lastMoveWasRotate - 直前の操作が回転だったか。
 * @param {string} params.pieceType
 * @param {number[][]} params.matrix - 現在のミノ行列。
 * @param {{x: number, y: number}} params.position
 * @param {number[][]} params.arena
 * @param {number} params.boardWidth
 * @param {number} params.arenaHeight
 * @param {boolean} params.lastRotationUsedKick
 * @param {number} [params.lines=0]
 * @returns {string|null}
 */
export function checkGenericSpinLabel({
    allSpinDisplayEnabled, lastMoveWasRotate, pieceType, matrix, position,
    arena, boardWidth, arenaHeight, lastRotationUsedKick, lines = 0
}) {
    if (allSpinDisplayEnabled === false || !lastMoveWasRotate) return null;
    if (!['I', 'J', 'L', 'S', 'Z'].includes(pieceType)) return null;

    const downBlocked = checkCollision(matrix, { x: position.x, y: position.y + 1 }, arena, boardWidth, arenaHeight);
    const leftBlocked = checkCollision(matrix, { x: position.x - 1, y: position.y }, arena, boardWidth, arenaHeight);
    const rightBlocked = checkCollision(matrix, { x: position.x + 1, y: position.y }, arena, boardWidth, arenaHeight);
    const blockedCount = (downBlocked ? 1 : 0) + (leftBlocked ? 1 : 0) + (rightBlocked ? 1 : 0);

    if (!lastRotationUsedKick && blockedCount < 3 && !(downBlocked && (leftBlocked || rightBlocked))) return null;
    return `${pieceType}-SPIN ${getSpinLineLabel(lines)}`;
}
