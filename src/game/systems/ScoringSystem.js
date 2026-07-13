/**
 * ScoringSystem - ライン消去時のスコア・攻撃力・表示テキストを計算する純粋関数。
 *
 * 重要: script.js の `Board.prototype.sweep()` (9081〜9176行付近) の
 * **スコア計算部分**を、副作用(実際の `this.player.xxx` への代入、
 * スキルコイン付与、ネットワーク攻撃送信)を除いて純粋関数化したものです。
 *
 * 元のコードは `this.player.ren` や `this.player.btb` を計算の途中で
 * 書き換えながら、その**書き換えた後の値**を後続の式で使っています
 * (例: コンボボーナスは ren を++した後の値を使う)。この関数も
 * 同じ評価順序を再現するため、`previousRen`/`previousBtb` を受け取り、
 * `newRen`/`newBtb` を計算した上で、後続の式にはその新しい値を使っています。
 * 呼び出し側(Board クラス)は、返り値の `newRen`/`newBtb` を
 * 実際に `this.player.ren`/`this.player.btb` へ反映してください。
 *
 * 元の実装の呼び出し条件: `if (lines > 0 || tSpinInfo.isTSpin || genericSpinLabel)` の
 * 中でのみこの計算ブロックが実行されます(それ以外の時は何も起きません)。
 *
 * @module game/systems/ScoringSystem
 */

/**
 * @param {object} params
 * @param {number} params.lines - このロックで消えたライン数。
 * @param {{isTSpin: boolean, isMini: boolean}} params.tSpinInfo
 * @param {string|null} params.genericSpinLabel - All-Spin表示ラベル(T-Spin以外用)。
 * @param {number} params.level - `cfg.lv`に相当。
 * @param {number} params.previousRen - このロック**前**のコンボ数(`this.player.ren`)。
 * @param {boolean} params.previousBtb - このロック**前**のBack-to-Back状態(`this.player.btb`)。
 * @param {boolean} params.isPerfectClear
 * @param {number} [params.garbageMultiplier=1] - `this.ruleSet.garbageMultiplier`に相当。
 * @param {number} [params.adminAttackMultiplier=1] - Admin Cheatの攻撃倍率(`getAdminAttackMultiplier`)。
 * @returns {{
 *   actionText: string,
 *   atk: number,
 *   lineScore: number,
 *   newRen: number,
 *   newBtb: boolean,
 *   coinGain: number,
 *   isTSpinScored: boolean
 * }}
 */
export function calculateLineClearResult({
    lines, tSpinInfo, genericSpinLabel, level,
    previousRen, previousBtb, isPerfectClear,
    garbageMultiplier = 1, adminAttackMultiplier = 1
}) {
    let actionText = '';
    let atk = 0;
    let lineScore = 0;
    const cappedLines = Math.min(lines, 4);
    const overflowLines = Math.max(0, lines - 4);

    if (tSpinInfo.isTSpin) {
        const mini = tSpinInfo.isMini ? 'MINI ' : '';
        const lineNames = ['', 'SINGLE', 'DOUBLE', 'TRIPLE'];
        actionText = `T-SPIN ${mini}${lineNames[Math.min(lines, 3)] || 'NON-LINE'}`;
        atk = tSpinInfo.isMini ? [0, 1, 2, 3][Math.min(lines, 3)] : [0, 2, 4, 6][Math.min(lines, 3)];

        if (tSpinInfo.isMini) {
            lineScore = ([100, 200, 400][Math.min(lines, 2)] || 0) * level;
        } else {
            lineScore = ([400, 800, 1200, 1600][Math.min(lines, 3)] || 0) * level;
        }
    }

    let newRen = previousRen;
    if (lines > 0) {
        if (!tSpinInfo.isTSpin) {
            if (genericSpinLabel) {
                actionText = genericSpinLabel + (overflowLines > 0 ? `+${overflowLines}` : '');
            } else {
                const lineNames = ['', 'SINGLE', 'DOUBLE', 'TRIPLE', 'TETRIS'];
                actionText = lineNames[cappedLines] + (overflowLines > 0 ? `+${overflowLines}` : '');
            }
            atk = [0, 0, 1, 2, 4][cappedLines] + overflowLines * 2;
            lineScore = ([0, 100, 300, 500, 800][cappedLines] + overflowLines * 300) * level;
        }
        newRen = previousRen + 1;
    } else {
        newRen = -1;
        if (!tSpinInfo.isTSpin && genericSpinLabel) actionText = genericSpinLabel;
    }

    let newBtb = previousBtb;
    if ((tSpinInfo.isTSpin || lines === 4) && lines > 0) {
        if (previousBtb) {
            atk += 1;
            actionText = 'B2B ' + actionText;
            lineScore = Math.floor(lineScore * 1.5);
        }
        newBtb = true;
    } else if (lines > 0) {
        newBtb = false;
    }

    if (lines > 0 && newRen > 0) {
        lineScore += 50 * newRen * level;
    }

    atk += Math.floor(newRen / 2);

    if (isPerfectClear) {
        actionText = 'PERFECT CLEAR';
        atk += 10;
        lineScore += ([0, 800, 1200, 1800, 2000][cappedLines] + overflowLines * 400) * level;
    }

    const coinGain = Math.max(0, lines + (tSpinInfo.isTSpin ? 2 : 0) + (lines === 4 ? 2 : 0) + (isPerfectClear ? 3 : 0));

    if (atk > 0) {
        atk = Math.max(0, Math.round(atk * garbageMultiplier * adminAttackMultiplier));
    }

    return {
        actionText,
        atk,
        lineScore,
        newRen,
        newBtb,
        coinGain,
        isTSpinScored: tSpinInfo.isTSpin
    };
}
