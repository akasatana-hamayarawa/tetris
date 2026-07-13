/**
 * テンプレート定義: Edge Opening (端開けREN)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "hren" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/hren
 */

export default {
    id: 'hren',
    category: 'ren', // tspin | ren | elevator | td | pc | other
    name: { en: "Edge Opening", ja: "端開けREN" },
    board: [
        ".........3",
        "....666333",
        "....163333",
        "....144313",
        "....144313",
        "....122212",
        "....226212",
        "....266122",
        "....276122",
        "....773121",
        "....763121",
        "....663331",
        "....365531",
        "....3556333",
        "....336644",
        "....2276444",
        "....277222",
        "....275562",
        ".111155666"
    ],
    hold: "I",
    queue: ["Z", "O", "I", "T", "J", "O", "I", "I", "T", "L", "Z", "I", "T", "L", "O", "Z", "O", "L"]
};
