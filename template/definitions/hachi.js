/**
 * テンプレート定義: Hachimitsu Cannon (はちみつ砲)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "hachi" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/hachi
 */

export default {
    id: 'hachi',
    category: 'td', // tspin | ren | elevator | td | pc | other
    name: { en: "Hachimitsu Cannon", ja: "はちみつ砲" },
    board: [
        "1333......",
        "1355..22..",
        "155...2442",
        "155.772442",
        "553..77622",
        "333.776644",
        "1111.77644"
    ],
    hold: "T",
    queue: ["T"]
};
