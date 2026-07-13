/**
 * テンプレート定義: MountainStackingNo.2 (山岳積み2号)
 *
 * このファイルは script.js の TEMPLATES オブジェクト内、キー "sgk2" のデータを
 * そのまま移植したものです(盤面パターン・ホールド・ネクストキューは一切変更していません)。
 *
 * 新しいテンプレートを追加する場合は、このファイルと同じ形式で
 * template/definitions/ 配下に新規ファイルを作り、
 * template/definitions/index.js の import 一覧へ1行追加してください。
 *
 * @module template/definitions/sgk2
 */

export default {
    id: 'sgk2',
    category: 'td', // tspin | ren | elevator | td | pc | other
    name: { en: "MountainStackingNo.2", ja: "山岳積み2号" },
    board: [
        "2244......",
        "2544..3..1",
        "255...3331",
        "155.773331",
        "155..77631",
        "125.776644",
        "1222.77644"
    ],
    hold: "T",
    queue: ["T", "L", "O", "Z", "I", "J"]
};
