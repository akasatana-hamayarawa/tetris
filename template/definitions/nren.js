/**
 * テンプレート定義: Center REN (中開けREN)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "nren" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/nren
 */

export default {
    id: 'nren',
    category: 'ren', // tspin | ren | elevator | td | pc | other
    name: { en: "Center REN", ja: "中開けREN" },
    board: [
        ".72....222",
        "772....152",
        "722....155",
        "333....155",
        "372....155",
        "772....165",
        "722....166",
        "333....167",
        "443....177",
        "442....177",
        "222....177",
        "222....177",
        "352....166",
        "355....156",
        "335....155",
        "333....155",
        "344....155",
        "244...6775",
        "222..66677"
    ],
    hold: null,
    queue: ["S", "L", "S", "O", "L", "Z", "J", "S", "I", "S", "O", "T", "L", "I", "S", "T", "I", "O", "L"]
};
