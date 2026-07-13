/**
 * Constants - ゲームルール上不変の値を集約したモジュール。
 *
 * 重要: このファイルの値は script.js 冒頭(1〜45行付近)の定義から
 * **そのままコピー**しています。script.js 側はまだこのファイルを import して
 * いません(Phase 6「game/層の切り出し」で実際に置き換えます)。
 * それまでは script.js 内の元の定義がそのまま使われるため、既存動作への
 * 影響はありません。このファイルは「将来の移行先」として先に用意したものです。
 *
 * 値を変更する場合は、必ず script.js 側の元定義も同時に確認し、
 * 両者が食い違わないようにしてください(Phase 6で一本化するまでの暫定処置)。
 *
 * @module core/Constants
 */

/**
 * 各ミノの形状定義(回転前の初期状態)。
 * 数値はそのまま COLORS 配列のインデックスに対応する(色付け用)。
 * 'B' はお邪魔ブロック、'X' は特殊ブロック用の1マス定義。
 * @type {Record<string, number[][]>}
 */
export const PIECES = {
    'I': [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    'J': [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
    'L': [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
    'O': [[4, 4], [4, 4]],
    'S': [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
    'T': [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    'Z': [[7, 7, 0], [0, 7, 7], [0, 0, 0]],
    'B': [[9]],
    'X': [[10]]
};

/**
 * ブロックの色一覧。インデックスは PIECES 内の数値と対応する。
 * 先頭(0番目)は null(空白マス)。
 * @type {Array<string|null>}
 */
export const COLORS = [null, '#00f0f0', '#0000f0', '#f0a000', '#f0f000', '#00f000', '#a000f0', '#f00000', '#444', '#ff7a00', '#050505'];

/**
 * SRS(Super Rotation System)の壁蹴り(ウォールキック)テーブル。
 * O・I以外のミノ(J/L/S/T/Z)用。キーは "回転前状態-回転後状態"。
 * @type {Record<string, [number, number][]>}
 */
export const SRS_KICKS = {
    "0-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "1-0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "1-2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    "2-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    "2-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    "3-2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "3-0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    "0-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
};

/**
 * SRSの壁蹴りテーブル(Iミノ専用。他ミノと蹴り幅が異なるため別テーブル)。
 * @type {Record<string, [number, number][]>}
 */
export const SRS_KICKS_I = {
    "0-1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    "1-0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    "1-2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    "2-1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    "2-3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    "3-2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    "3-0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    "0-3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
};

/**
 * 通常ミノ7種の一覧(お邪魔・特殊ブロックを除く)。
 * @type {string[]}
 */
export const NORMAL_PIECE_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

/**
 * 設定(cfg)のデフォルト値。script.js の `let cfg = {...}` 初期値と同一。
 * @type {object}
 */
export const DEFAULT_SETTINGS = {
    lang: 'ja', playerName: '', hasCompletedTutorial: false, theme: 'default',
    lv: 5, ghost: 0.15, das: 150, arr: 30, sdf: 20,
    ospin: false, ospinTransform: 'fixed', allSpinDisplay: true, particles: 80, enableLevelUp: true,
    // --- Phase 2 で追加: 音声設定(既存のscript.jsにはまだ音声機能自体が無いため、新規項目) ---
    bgmVolume: 0.6, sfxVolume: 0.8, audioMuted: false,
    keys: { left: 'ArrowLeft', right: 'ArrowRight', soft: 'ArrowDown', hard: ' ', rotR: 'ArrowUp', rotL: 'z', hold: 'c', hold2: 'Shift', pause: 'Escape', retry: 'r' },
    padKeys: { left: 14, right: 15, soft: 13, hard: 12, rotR: 0, rotL: 2, hold: 4, hold2: 5, pause: 9, retry: 8 },
    gamepadDeadzone: 0.5,
    screenScale: 1.0,
    touchLayout: 'balanced',
    touchButtonScale: 1.0,
    touchOpacity: 0.88,
    touchExtraButtons: false,
    touchPos: { dpad: { x: null, y: null }, actions: { x: null, y: null } }
};

/**
 * TODO(Phase 6): TSPIN / LINE_CLEAR / SCORE の定数テーブル化。
 *
 * 現在の script.js では、T-Spin判定・ライン消去・スコア計算が
 * それぞれの関数内に「値が直接埋め込まれた形」で実装されており、
 * PIECES/COLORS/KICKSのような独立した定数テーブルが存在しません。
 *
 * これを安全にテーブル化するには、対象の計算関数を1つずつ読み、
 * 既存のスコア結果が1点も変わらないことを確認しながら数値を抜き出す
 * 必要があります(スコア計算はセーブされたハイスコアやランキングとの
 * 互換性に直結するため、他の定数より慎重な移行が必要です)。
 *
 * このタスクは Phase 6(game/systems 層の切り出し)で、
 * ScoringSystem.js / LineClearSystem.js / TSpinSystem.js を作成する際に
 * 実施することを推奨します。
 */
