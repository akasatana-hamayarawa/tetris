/**
 * PieceGenerator - 7種一巡(7-bag)方式のミノ生成を行う純粋関数群。
 *
 * 重要: script.js の `Board.prototype.pullFromBag()`(8870行付近)の
 * シャッフルアルゴリズムと完全に同じ(Fisher-Yates、末尾から先頭へ向かう方式)。
 *
 * 元の実装:
 * ```js
 * if (this.bag.length === 0) {
 *     this.bag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
 *     for (let i = this.bag.length - 1; i > 0; i--) {
 *         const j = Math.floor(Math.random() * (i + 1));
 *         [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
 *     }
 * }
 * return this.bag.shift();
 * ```
 *
 * @module game/systems/PieceGenerator
 */

import { NORMAL_PIECE_TYPES } from '../../core/Constants.js';

/**
 * 7種類のミノをシャッフルした新しい「バッグ」を生成する。
 * @param {() => number} [randomFn=Math.random] - 0以上1未満の乱数を返す関数(テスト用に差し替え可能)。
 * @returns {string[]} シャッフルされたミノ種別の配列(長さ7)。
 */
export function generateShuffledBag(randomFn = Math.random) {
    const bag = [...NORMAL_PIECE_TYPES];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(randomFn() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
}

/**
 * バッグからミノを1つ取り出す。バッグが空なら新しいバッグを生成してから取り出す。
 * イミュータブル(引数のbagは変更せず、新しいbagを返す)。
 * @param {string[]} bag - 現在のバッグ(空配列可)。
 * @param {() => number} [randomFn=Math.random]
 * @returns {{piece: string, nextBag: string[]}} 取り出したミノと、残りのバッグ。
 */
export function pullFromBag(bag, randomFn = Math.random) {
    const currentBag = bag.length === 0 ? generateShuffledBag(randomFn) : [...bag];
    const piece = currentBag.shift();
    return { piece, nextBag: currentBag };
}
