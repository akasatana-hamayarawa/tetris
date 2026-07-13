/**
 * HoldSystem - ホールド操作の「何と何を入れ替えるか」を決定する純粋関数。
 *
 * 重要: script.js の `Board.prototype.playerHold()`(9224行付近)のうち、
 * **入れ替え判定の部分だけ**を純粋関数化したものです。
 * 実際のミノ行列生成(`createPieceMatrix`)やスポーン位置計算(`getSpawnPosition`)は
 * DOM/Canvas設定に依存するため、Board クラス側の責務として残しています。
 *
 * 元の実装(該当部分抜粋):
 * ```js
 * if (this.ruleSet && this.ruleSet.allowHold === false) return;
 * if (!this.player.canHold) return;
 * const curType = this.player.type, curColor = this.player.color;
 * if (this.player.holdType) {
 *     this.player.type = this.player.holdType; this.player.color = this.player.holdColor;
 *     // (matrix/pos/rotationの再計算はBoard側)
 * } else this.reset(); // NEXTキューから引く
 * this.player.holdType = curType; this.player.holdColor = curColor; this.player.canHold = false;
 * ```
 *
 * @module game/systems/HoldSystem
 */

/**
 * ホールドが実行可能かどうかを判定する。
 * @param {boolean} allowHold - ルールセットでホールドが許可されているか(`ruleSet.allowHold !== false`)。
 * @param {boolean} canHold - 現在このミノでまだホールドを使っていないか。
 * @returns {boolean}
 */
export function canPerformHold(allowHold, canHold) {
    return allowHold !== false && !!canHold;
}

/**
 * ホールド実行時に「現在のミノ」と「ホールド中のミノ」をどう入れ替えるかを決定する。
 * @param {string} currentType - 現在操作中のミノ種別。
 * @param {string|null} holdType - ホールド中のミノ種別(未使用ならnull/undefined)。
 * @returns {{
 *   newHoldType: string,
 *   nextCurrentType: string|null,
 *   tookFromQueue: boolean
 * }} `tookFromQueue`がtrueの場合、`nextCurrentType`はnullを返す
 *   (呼び出し側はNEXTキューから新しいミノを取り出す必要がある、という合図)。
 */
export function resolveHoldSwap(currentType, holdType) {
    const newHoldType = currentType;
    if (holdType) {
        return { newHoldType, nextCurrentType: holdType, tookFromQueue: false };
    }
    return { newHoldType, nextCurrentType: null, tookFromQueue: true };
}
