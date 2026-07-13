/**
 * GarbageSystem - お邪魔ライン(攻撃)の相殺計算・倍率適用・生成を行う純粋関数群。
 *
 * 重要: script.js の以下の箇所と完全に同じロジックを、DOM/クラスに依存しない
 * 形で書き写したものです(9171〜9220行付近):
 * ```js
 * atk = Math.max(0, Math.round(atk * ((this.ruleSet && this.ruleSet.garbageMultiplier) || 1) * getAdminAttackMultiplier(this)));
 * if (this.pendingGarbage > 0) { const offset = Math.min(atk, this.pendingGarbage); atk -= offset; this.pendingGarbage -= offset; }
 * // ...
 * pushGarbageToArena(n) {
 *     for (let i = 0; i < n; i++) {
 *         const r = new Array(this.getBoardWidth()).fill(8);
 *         r[Math.floor(Math.random() * this.getBoardWidth())] = 0;
 *         this.arena.shift(); this.arena.push(r);
 *     }
 * }
 * ```
 *
 * @module game/systems/GarbageSystem
 */

/**
 * 送信量に倍率(ルールセットの倍率 × Admin Cheatの倍率)を適用する。
 * @param {number} rawAmount - 元の攻撃ライン数。
 * @param {number} [garbageMultiplier=1] - ルールセット由来の倍率。
 * @param {number} [attackMultiplier=1] - Admin Cheat由来の倍率。
 * @returns {number} 倍率適用後の攻撃ライン数(0以上の整数)。
 */
export function applyGarbageMultiplier(rawAmount, garbageMultiplier = 1, attackMultiplier = 1) {
    return Math.max(0, Math.round(rawAmount * (garbageMultiplier || 1) * (attackMultiplier || 1)));
}

/**
 * 保留中のお邪魔(pendingGarbage)で、送信しようとしている攻撃を相殺する。
 * 元の実装と同じ「送信側の保留分で先に相殺してから送る」ロジック。
 * @param {number} attackAmount - 相殺前の攻撃量。
 * @param {number} pendingGarbage - 自分の保留中お邪魔ライン数。
 * @returns {{remainingAttack: number, remainingPending: number}}
 */
export function cancelGarbageWithAttack(attackAmount, pendingGarbage) {
    if (pendingGarbage <= 0) {
        return { remainingAttack: attackAmount, remainingPending: pendingGarbage };
    }
    const offset = Math.min(attackAmount, pendingGarbage);
    return {
        remainingAttack: attackAmount - offset,
        remainingPending: pendingGarbage - offset
    };
}

/**
 * 指定段数分のお邪魔ライン行列を生成する(各行は1箇所だけ穴が空いた状態)。
 * ランダム関数を引数で受け取れるようにし、テストで決定的な結果を検証できるようにしている
 * (script.js側は `Math.random()` を直接使うが、算出方法自体は同一)。
 * @param {number} count - 生成する段数。
 * @param {number} boardWidth - 盤面の横幅。
 * @param {() => number} [randomFn=Math.random] - 0以上1未満の乱数を返す関数。
 * @returns {number[][]} 生成された行の配列(先頭が古い方、末尾が最新)。
 */
export function buildGarbageRows(count, boardWidth, randomFn = Math.random) {
    const rows = [];
    for (let i = 0; i < count; i++) {
        const row = new Array(boardWidth).fill(8);
        const holeX = Math.floor(randomFn() * boardWidth);
        row[holeX] = 0;
        rows.push(row);
    }
    return rows;
}

/**
 * 盤面(arena)へお邪魔ライン行を積む(先頭を捨てて末尾に追加、を段数分繰り返す)。
 * 元の `pushGarbageToArena()` の「シフト+プッシュ」部分のみを純粋関数化したもの
 * (めり込み時の位置補正・ゲームオーバー判定は、盤面インスタンスの責務として残す)。
 * @param {number[][]} arena - 現在の盤面(この関数は変更しない)。
 * @param {number[][]} garbageRows - `buildGarbageRows()`で生成した行の配列。
 * @returns {number[][]} お邪魔ラインを積んだ後の新しい盤面。
 */
export function pushGarbageRows(arena, garbageRows) {
    const next = arena.slice(garbageRows.length);
    return [...next, ...garbageRows];
}
