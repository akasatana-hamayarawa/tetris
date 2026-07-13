# template/definitions/ 新しいテンプレートの追加方法

1. このフォルダに新しいファイルを作成する(例: `mytemplate.js`)。
   他のファイルと同じ形式でコピーして書き換えてください:

```js
export default {
    id: 'mytemplate',
    category: 'other', // tspin | ren | elevator | td | pc | other
    name: { en: 'My Template', ja: '自作テンプレ' },
    board: [
        "..........",
        "1234567.89"
        // 盤面パターン(10文字×任意の段数、0は空白扱い)
    ],
    hold: null,   // ホールドにセットしておくミノ種別('I'/'J'/'L'/'O'/'S'/'T'/'Z')。無ければnull
    queue: ["T", "T"] // 開始時のネクストキュー
};
```

2. `index.js` のimport一覧へ1行追加する:

```js
import mytemplate from './mytemplate.js';
// ...
export const ALL_TEMPLATES = [ ..., mytemplate ];
```

これだけで、`TemplateManager`のカテゴリ分け・検索に自動的に反映されます。

## カテゴリ一覧
`tspin`(T-spin系) / `ren`(REN系) / `elevator`(エレベーター系) / `td`(TD系) / `pc`(パフェ系) / `other`(その他)
