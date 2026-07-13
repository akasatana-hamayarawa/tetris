/**
 * テンプレート定義: Perfect Clear? Setup (変なパフェ)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "hpc" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/hpc
 */

export default {
    id: 'hpc',
    category: 'pc', // tspin | ren | elevator | td | pc | other
    name: { en: "Perfect Clear? Setup", ja: "変なパフェ" },
    board: [
        "777777..77",
        "7777777..7",
        "333.333333",
        "3...333333",
        "4444444..4",
        "4444444..4",
        "55..555555",
        "5..5555555",
        "222222.222",
        "222222...2",
        "1.11111111",
        "1.11111111",
        "1.11111111",
        "1.11111111",
        "666666...6",
        "6666666.66"
    ],
    hold: null,
    queue: ["Z", "L", "O", "S", "J", "I", "T"]
};
