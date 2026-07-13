/**
 * テンプレート定義: gamushiro Cannon (ガムシロ砲)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "gmsr" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/gmsr
 */

export default {
    id: 'gmsr',
    category: 'td', // tspin | ren | elevator | td | pc | other
    name: { en: "gamushiro Cannon", ja: "ガムシロ砲" },
    board: [
        "1.......44",
        "1.......44",
        "122.....33",
        "12....5533",
        "52.7755133",
        "55..776133",
        "25.7766144",
        "222.776144"
    ],
    hold: "T",
    queue: ["T", "L", "S", "I", "J", "O"]
};
