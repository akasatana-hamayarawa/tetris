/**
 * テンプレート定義: L mino elevator (Lミノエレベーター)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "lev" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/lev
 */

export default {
    id: 'lev',
    category: 'elevator', // tspin | ren | elevator | td | pc | other
    name: { en: "L mino elevator", ja: "Lミノエレベーター" },
    board: [
        "4.44444..4",
        "3...3333.3",
        "7..777...7",
        "66.666.666",
        "...222.2.2",
        "1.1111...1",
        "5...555..5",
        "4..4.4.4.4",
        "33.......3",
        "........77"
    ],
    hold: null,
    queue: ["L"]
};
