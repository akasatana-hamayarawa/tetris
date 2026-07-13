/**
 * テンプレート定義: TST Tower (TSTタワー)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "tst" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/tst
 */

export default {
    id: 'tst',
    category: 'tspin', // tspin | ren | elevator | td | pc | other
    name: { en: "TST Tower", ja: "TSTタワー" },
    board: [
        ".7.......3",
        "77..5..333",
        "7...551111",
        "1.33653333",
        "1..3663333",
        "1.53633222",
        "1.55443233",
        "3..5443443",
        "3.77666443",
        "33.7761111"
    ],
    hold: "T",
    queue: ["T", "T"]
};
