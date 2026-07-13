/**
 * テンプレート定義: I mino elevator (Iミノエレベーター)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "iev" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/iev
 */

export default {
    id: 'iev',
    category: 'elevator', // tspin | ren | elevator | td | pc | other
    name: { en: "I mino elevator", ja: "Iミノエレベーター" },
    board: [
        "7.777777.7",
        "6.666666.6",
        "2.2......2",
        "1.1.111111",
        "5.5.555555",
        "4.4......4",
        "3.333333.3",
        "7.777777.7",
        "6.6......6",
        "2.2.222222",
        "1.1.1111111",
        "5.5......5",
        "4.444444.4",
        "3.333333.3",
        "7........7"
    ],
    hold: null,
    queue: ["I"]
};
