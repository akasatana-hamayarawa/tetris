/**
 * GravitySystem - 自然落下速度・ロック遅延の判定を行う純粋関数群。
 *
 * 重要: script.js の以下の箇所と完全に同じ計算式を、DOM/クラスに依存しない
 * 形で書き写したものです(9563〜9582行付近):
 * ```js
 * let fallSpeed = Math.max(10, Math.pow(Math.max(0.1, 0.8 - ((currentLvl - 1) * 0.007)), currentLvl - 1) * 1000);
 * // ...
 * this.lockDelayCounter += scaledDt;
 * if (this.lockDelayCounter >= this.lockDelayThreshold || (this.lockResetCount || 0) >= LOCK_RESET_LIMIT) { this.lock(); }
 * ```
 * および `registerLockResetAction()`(8916行付近)。
 *
 * @module game/systems/GravitySystem
 */

/** script.js の `LOCK_RESET_LIMIT` 定数と同一値(15回転/移動でロック確定) */
export const LOCK_RESET_LIMIT = 15;

/** script.js の `this.lockDelayThreshold` 初期値と同一(ミリ秒) */
export const DEFAULT_LOCK_DELAY_THRESHOLD = 500;

/**
 * 現在のレベルから、自然落下速度(1マス落ちるまでのミリ秒)を計算する。
 * いわゆる「モダンガイドライン」に準じた指数関数的な速度上昇カーブ。
 * @param {number} level - 現在のレベル(1始まり)。
 * @returns {number} 1マス落下するまでのミリ秒(最低10ms)。
 */
export function calculateFallSpeed(level) {
    return Math.max(10, Math.pow(Math.max(0.1, 0.8 - ((level - 1) * 0.007)), level - 1) * 1000);
}

/**
 * ソフトドロップ中の実際の落下間隔を計算する。
 * @param {number} fallSpeed - `calculateFallSpeed()`の結果。
 * @param {number} sdf - ソフトドロップ倍率(cfg.sdf)。
 * @returns {number}
 */
export function calculateSoftDropInterval(fallSpeed, sdf) {
    return fallSpeed / sdf;
}

/**
 * 現在のロック遅延カウンタ・リセット回数から、ロック(接地固定)すべきかを判定する。
 * @param {number} lockDelayCounter - 接地してから経過した時間(ミリ秒)。
 * @param {number} lockDelayThreshold - ロックまでの猶予時間(通常500ms)。
 * @param {number} lockResetCount - これまでの回転/移動によるリセット回数。
 * @param {number} [lockResetLimit=LOCK_RESET_LIMIT] - リセット回数の上限(超えたら強制ロック)。
 * @returns {boolean}
 */
export function shouldTriggerLock(lockDelayCounter, lockDelayThreshold, lockResetCount, lockResetLimit = LOCK_RESET_LIMIT) {
    return lockDelayCounter >= lockDelayThreshold || (lockResetCount || 0) >= lockResetLimit;
}

/**
 * ミノの回転・移動が発生した際、ロック遅延をリセットしてよいか、
 * またその結果として即ロックすべきかを判定する。
 * 元の `registerLockResetAction()` のロジックを、副作用(this.lock()呼び出し)を除いて再現。
 *
 * @param {object} params
 * @param {boolean} params.hasTouchedGround - このミノが一度でも接地したことがあるか。
 * @param {boolean} params.wasGrounded - アクション実行前に接地していたか。
 * @param {boolean} params.groundedNow - アクション実行後に接地しているか。
 * @param {number} params.lockResetCount - これまでのリセット回数。
 * @param {number} [params.lockResetLimit=LOCK_RESET_LIMIT]
 * @returns {{
 *   didReset: boolean,
 *   newLockResetCount: number,
 *   newHasTouchedGround: boolean,
 *   shouldForceLock: boolean
 * }}
 */
export function registerLockReset({ hasTouchedGround, wasGrounded, groundedNow, lockResetCount, lockResetLimit = LOCK_RESET_LIMIT }) {
    if (!hasTouchedGround && !wasGrounded && !groundedNow) {
        return {
            didReset: false,
            newLockResetCount: lockResetCount,
            newHasTouchedGround: hasTouchedGround,
            shouldForceLock: false
        };
    }
    const newLockResetCount = (lockResetCount || 0) + 1;
    const shouldForceLock = newLockResetCount >= lockResetLimit;
    return {
        didReset: true,
        newLockResetCount,
        newHasTouchedGround: true,
        shouldForceLock
    };
}
