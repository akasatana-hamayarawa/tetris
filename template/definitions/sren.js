/**
 * テンプレート定義: Stripe REN (unused) (ストライプREN(未使用))
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "sren" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/sren
 */

export default {
    id: 'sren',
    category: 'other', // tspin | ren | elevator | td | pc | other
    name: { en: "Stripe REN (unused)", ja: "ストライプREN(未使用)" },
    board: [
        "222222....",
        "333333....",
        "111111....",
        "444444....",
        "555555....",
        "666666....",
        "777777....",
        "222222....",
        "333333....",
        "111111...."
    ],
    hold: null,
    queue: ["I", "L", "J", "O", "S", "T", "Z"]
};
