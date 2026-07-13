/**
 * naming.js - プレイヤー名の重複防止・整形に関するユーティリティ。
 *
 * ご報告いただいた「プレイヤー名の重複」問題への対応として追加しました。
 * 純粋関数のみで構成しているため、どこからでも安全に呼び出せます。
 *
 * @module utils/naming
 */

/**
 * 候補の名前が既存の名前一覧と重複する場合、末尾に " (2)" のような連番を付けて
 * 一意な名前を生成する。大文字小文字は区別せず比較する(表示上は候補の大文字小文字を維持する)。
 * @param {string} candidateName - 希望する名前。
 * @param {string[]} existingNames - 既に使われている名前の一覧。
 * @param {object} [options]
 * @param {number} [options.maxLength=15] - 名前の最大文字数(script.jsの既存の上限と同じ)。
 * @returns {string} 一意になった名前。
 */
export function ensureUniqueName(candidateName, existingNames, { maxLength = 15 } = {}) {
    const base = String(candidateName || '').trim().slice(0, maxLength) || 'PLAYER';
    const usedLower = new Set(existingNames.map(n => String(n || '').trim().toLowerCase()));

    if (!usedLower.has(base.toLowerCase())) {
        return base;
    }

    let suffix = 2;
    let candidate;
    do {
        const suffixText = ` (${suffix})`;
        const trimmedBase = base.slice(0, Math.max(1, maxLength - suffixText.length));
        candidate = `${trimmedBase}${suffixText}`;
        suffix++;
    } while (usedLower.has(candidate.toLowerCase()) && suffix < 10000);

    return candidate;
}

/**
 * 名前一覧全体を、重複が無くなるまで順番に一意化する。
 * (ルーム参加時など、複数人の名前を一括で正規化したい場合に使用)
 * @param {string[]} names - 元の名前一覧(先に登録された順)。
 * @param {object} [options] - `ensureUniqueName`と同じオプション。
 * @returns {string[]} 重複の無い名前一覧(順序は維持)。
 */
export function deduplicateNames(names, options) {
    const result = [];
    for (const name of names) {
        result.push(ensureUniqueName(name, result, options));
    }
    return result;
}

/**
 * 表示用に名前を安全な範囲へ丸める(script.jsの `.trim().slice(0, 15)` パターンと同一)。
 * @param {string} name
 * @param {number} [maxLength=15]
 * @returns {string}
 */
export function sanitizeName(name, maxLength = 15) {
    return String(name || '').trim().slice(0, maxLength);
}

/**
 * 2つの名前が(大文字小文字を無視して)同一人物を指すかを判定する。
 * script.jsの `adminNameMatches` と同等の比較(空文字はワイルドカードとして扱わない)。
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function namesMatch(a, b) {
    return sanitizeName(a).toLowerCase() === sanitizeName(b).toLowerCase();
}
