/**
 * テンプレート定義: DT Cannon (DT砲)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "dt" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/dt
 */

export default {
    id: 'dt',
    category: 'tspin', // tspin | ren | elevator | td | pc | other
    name: { en: "DT Cannon", ja: "DT砲" },
    board: [
        ".....5....",
        "..33.55.55",
        "...3775551",
        "22.3677441",
        "2..6661441",
        "2...551771",
        "44.5531277",
        "44.3331222"
    ],
    hold: null,
    queue: ["T", "T"]
};
