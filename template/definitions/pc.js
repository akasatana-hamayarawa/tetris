/**
 * テンプレート定義: Perfect Clear Setup (パフェテンプレ)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "pc" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/pc
 */

export default {
    id: 'pc',
    category: 'pc', // tspin | ren | elevator | td | pc | other
    name: { en: "Perfect Clear Setup", ja: "パフェテンプレ" },
    board: [
        "1111....55",
        "2443...556",
        "2443..7766",
        "2233...776"
    ],
    hold: null,
    queue: ["Z", "L", "I"]
};
