/**
 * テンプレート定義: Stray Cannon (迷走砲)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "meisou" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/meisou
 */

export default {
    id: 'meisou',
    category: 'td', // tspin | ren | elevator | td | pc | other
    name: { en: "Stray Cannon", ja: "迷走砲" },
    board: [
        "......4421",
        "5..7..4421",
        "5577...221",
        "157333.771",
        "13536..277",
        "135566.244",
        "13356.2244"
    ],
    hold: "T",
    queue: ["T"]
};
