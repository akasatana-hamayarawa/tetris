/**
 * テンプレート定義: Perfect Clear (合掌パフェ)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "gspc" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/gspc
 */

export default {
    id: 'gspc',
    category: 'pc', // tspin | ren | elevator | td | pc | other
    name: { en: "Perfect Clear", ja: "合掌パフェ" },
    board: [
        "122......3",
        "12...75333",
        "126.775544",
        "16667..544"
    ],
    hold: null,
    queue: ["T", "L", "J"]
};
