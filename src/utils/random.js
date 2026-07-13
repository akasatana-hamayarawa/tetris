/**
 * random.js - 乱数関連の汎用ユーティリティ。
 * 全ての関数は `randomFn` を引数で差し替え可能にしており、
 * テストで決定的な結果を検証できるようにしている(PieceGenerator.jsと同じ方針)。
 * @module utils/random
 */

/**
 * min以上max未満のランダムな整数を返す。
 * @param {number} min
 * @param {number} max
 * @param {() => number} [randomFn=Math.random]
 * @returns {number}
 */
export function randomInt(min, max, randomFn = Math.random) {
    return Math.floor(randomFn() * (max - min)) + min;
}

/**
 * min以上max未満のランダムな浮動小数を返す。
 * @param {number} min
 * @param {number} max
 * @param {() => number} [randomFn=Math.random]
 * @returns {number}
 */
export function randomFloat(min, max, randomFn = Math.random) {
    return randomFn() * (max - min) + min;
}

/**
 * 配列からランダムに1要素を選ぶ。
 * @template T
 * @param {T[]} array
 * @param {() => number} [randomFn=Math.random]
 * @returns {T|undefined}
 */
export function randomChoice(array, randomFn = Math.random) {
    if (!array.length) return undefined;
    return array[Math.floor(randomFn() * array.length)];
}

/**
 * 配列をFisher-Yatesアルゴリズムでシャッフルする(元の配列は変更しない)。
 * @template T
 * @param {T[]} array
 * @param {() => number} [randomFn=Math.random]
 * @returns {T[]}
 */
export function shuffleArray(array, randomFn = Math.random) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(randomFn() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * 指定文字数のランダムなID文字列を生成する(ルームコード等に使用可能)。
 * @param {number} [length=8]
 * @param {string} [alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789']
 * @param {() => number} [randomFn=Math.random]
 * @returns {string}
 */
export function randomId(length = 8, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', randomFn = Math.random) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += alphabet[Math.floor(randomFn() * alphabet.length)];
    }
    return result;
}

/**
 * 指定確率(0〜1)でtrueを返す(演出の抽選等に使用可能)。
 * @param {number} probability - 0〜1。
 * @param {() => number} [randomFn=Math.random]
 * @returns {boolean}
 */
export function chance(probability, randomFn = Math.random) {
    return randomFn() < probability;
}
