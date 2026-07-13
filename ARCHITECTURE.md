# テトリス完全版 — アーキテクチャ設計書 (v3設計 / VS Code・Claude Code実装用)

このドキュメントは、`script.js`(10,824行・非モジュール・グローバルスコープ)を
Managerベースのアーキテクチャへ安全に移行するための設計図です。
**このドキュメント自体はコード変更を含みません。** VS Code / Claude Codeで、
このドキュメントを土台に1フェーズずつ実装・テストしながら進めてください。

---

## 0. 現状把握(移行前に必ず読むこと)

実際のコードを調査した結果、移行時に特に注意すべき既存構造は以下の通りです。

| 項目 | 内容 | 移行時の注意 |
|---|---|---|
| `index.html` / `template/template.html` | `onclick="関数名()"` 形式のハンドラが **160箇所以上** | Managerクラス化で関数がグローバルから消えると全滅する。移行期間中は `window.foo = (...args) => gameManager.xxx.foo(...args)` のブリッジ関数を必ず用意する |
| `window.` 直接参照 | 92箇所 | 同上。UIManager/AdminManagerなど各Managerのpublicメソッドを`window`に薄くエクスポートするブリッジ層(`src/bridge/legacyBridge.js`)を用意する |
| Admin Cheatパネル | `チート/admin.html` が別ウィンドウ(iframe)から`postMessage`でscript.js本体と通信。プロトコルは `PANEL_SOURCE='tetris-admin-panel-v1'` / `GAME_SOURCE='tetris-admin-game-v1'` / `token`検証(`adminSession`クエリパラメータ、正規表現 `^[a-zA-Z0-9_-]{24,128}$`) | AdminManager移行時もこのプロトコル文字列・検証ロジックは**変更しないこと**。変えると既存の管理パネルとの互換性が壊れる |
| オンライン対戦 | WebRTC(PeerJS想定)によるP2P通信。`partyClients`配列、`onlineRoomRules`、`DEFAULT_ROOM_RULES` | NetworkManager移行は最優先ではなく**最後**に行うこと。複数ブラウザ/端末での実機テストが必須 |
| テーマ | `THEMES`オブジェクト(色のみ)+ `document.documentElement.dataset.theme`(質感CSS切替用) | 本設計書のThemeManager(theme.json方式)へ移行する際、既存の4テーマ(default/retro/light/dark)と新4テーマ(cyberpunk/soft/anpontan/minimal)の値を1つも欠かさず移すこと |
| 既存チート | `ADMIN_CHEAT_BOOLEAN_KEYS`(37種)、`ADMIN_PACKET_TYPES`(相手操作用) | AdminManager移行時にキー名を変えないこと(セーブされた設定との互換性) |

---

## 1. フォルダ構成

```
src/
    core/
        GameManager.js          # 唯一の「オーケストレーター」。他Managerの初期化順序とライフサイクルのみを司る
        EventBus.js              # pub/sub。Manager間の間接通信はすべてこれ経由
        Logger.js
        Constants.js              # PIECES, COLORS, SRS, KICKS, TSPIN, LINE_CLEAR, SCORE, DEFAULT_SETTINGS
    managers/
        SceneManager.js           # 画面(タイトル/対戦/リザルト/リプレイ等)の切り替えのみ担当
        UIManager.js               # DOM取得・キャッシュ・トースト・ダイアログの開閉のみ担当
        ThemeManager.js
        AudioManager.js
        NetworkManager.js
        ReplayManager.js
        SettingsManager.js
        StatisticsManager.js
        SaveManager.js
        AssetManager.js
        AnimationManager.js
        PluginManager.js
        AdminManager.js
        InputManager.js
    game/                        # 純粋なゲームロジック(DOM非依存。単体テストしやすい層)
        Board.js
        Piece.js
        Rotation.js
        Collision.js
        Gravity.js
    ui/
        components/               # 個別UI部品(ボタン群・HUD等)
    network/
        peer.js
        protocol.js                # postMessage / WebRTC メッセージ型定義
    admin/
        adminCommands.js
        adminCategories.js         # カテゴリ・検索・お気に入り・プリセット定義
    audio/
    animation/
    plugins/                      # ユーザー/MOD向け。空フォルダでも必ず存在させる
        README.md
    themes/
        default/
            theme.json
            theme.css
            theme.js               # 省略可(色のみのテーマはtheme.jsなしでOK)
            assets/
        cyberpunk/ ...
        soft/ ...
        anpontan/
            theme.json
            theme.css
            theme.js
            assets/                 # 現在 theme/anpontan/*.png にある7枚をここへ移動
        minimal/ ...
    assets/
    utils/
        helpers.js
        storage.js
        math.js
        random.js
    bridge/
        legacyBridge.js            # 移行期間中、window.foo = ... の橋渡し専用。移行完了後に削除予定
    main.js                        # エントリーポイント。GameManagerを生成して起動するだけ

css/
    base/
    layout/
    components/
    pages/
    admin/
    themes/                        # 個別テーマCSSは themes/<name>/theme.css を直接読み込むので、
                                    # ここには「テーマ非依存の共通土台」のみ置く
    animations/

template/
    dialogs/
    menus/
    settings/
    admin/
    results/
    multiplayer/
    components/
```

---

## 2. Managerの責務(各1つのみ)

原則: **各Managerは「自分のドメインの状態」だけを持ち、他Managerの内部状態を直接書き換えない。**
他Managerに何かをしてほしい時は、EventBusにイベントを発行する(直接メソッド呼び出しは最小限に)。

| Manager | 責務 | やってはいけないこと |
|---|---|---|
| **GameManager** | 全Managerの生成順序・起動・破棄。ゲームの状態機械(タイトル→対戦中→ポーズ→リザルト)の**遷移許可判定のみ** | 描画・入力処理・通信の実装を書かない |
| **SceneManager** | 現在の画面(DOM上のどのオーバーレイ/画面を表示するか)の管理 | ゲームロジックを持たない |
| **UIManager** | DOM要素のキャッシュ(`querySelector`を毎フレーム呼ばない)、トースト/ダイアログの表示・非表示 | ゲームルールを知らない。「スコアが上がったら表示を更新」はStatisticsManagerが`ui:update-score`イベントを発行し、UIManagerがそれを購読する形にする |
| **ThemeManager** | `themes/`配下を自動スキャンし、`theme.json`を読んでテーマ一覧を構築。CSS変数の適用、`theme.js`のロード | ゲームロジック・入力処理に関与しない |
| **AudioManager** | BGM/SEの再生・音量・ミュート | 何のイベントで何の音を鳴らすかの「ルール」は持たず、他Managerが`audio:play('lineClear')`のように発行する |
| **NetworkManager** | WebRTC接続の確立・切断・メッセージ送受信のみ | ゲームルールを解釈しない(受信データはEventBus経由でGameManager/StatisticsManagerに渡すだけ) |
| **ReplayManager** | 操作ログの記録・再生 | 描画はしない(再生時は`input:replay-frame`イベントを発行し、InputManagerと同じ経路でGameに反映) |
| **SettingsManager** | 設定値の読み書き・バリデーション・デフォルト値管理 | UIは描画しない(UIManagerに`settings:changed`を発行するのみ) |
| **StatisticsManager** | スコア・ライン・レベル・combo・B2B・T-Spin判定結果の集計 | 描画・保存はしない |
| **SaveManager** | localStorageへの読み書き・スキーマバージョン管理・マイグレーション | ゲームロジックを知らない(渡されたオブジェクトをそのまま保存/復元するだけ) |
| **AssetManager** | 画像・音楽・効果音・フォント・テーマ画像の読み込み・キャッシュ・プリロード進捗 | 再生・描画はしない(AudioManager/ThemeManagerがAssetManager経由でリソースを取得する) |
| **AnimationManager** | CSSアニメーションクラスの付与/解除、JSアニメーション(requestAnimationFrameベースのトゥイーン)の一元管理 | ゲームルールを知らない |
| **PluginManager** | `plugins/`フォルダのスキャン・読み込み・ライフサイクルフック(`onLoad`/`onEnable`/`onDisable`)の呼び出し | プラグインの中身を検証・実行制限しない(v1はローカル開発者向けの信頼前提。将来的にサンドボックス化を検討) |
| **AdminManager** | Admin Cheatの状態管理・コマンド実行・カテゴリ/検索/お気に入り/プリセット/最近使用/ショートカット | UIの折りたたみDOM構築はUIManagerに委譲してもよいが、チート判定ロジックはここに閉じる |
| **InputManager** | キーボード/タッチ入力の正規化(`cfg.keys`マッピング適用後の「論理入力イベント」を発行) | ゲームルール(何が起きるか)を知らない。`input:move-left`を発行するだけ |

---

## 3. EventBus 設計

```js
// src/core/EventBus.js
class EventBus {
    #listeners = new Map(); // eventName -> Set<handler>

    on(eventName, handler) { /* ... */ }
    off(eventName, handler) { /* ... */ }
    emit(eventName, payload) { /* ... */ }
    once(eventName, handler) { /* ... */ }
}
export const eventBus = new EventBus(); // シングルトン
```

**イベント命名規則**: `<ドメイン>:<動詞または状態>` (例: `game:line-cleared`, `settings:changed`, `theme:applied`, `admin:cheat-toggled`)

**循環参照を避けるルール**:
1. Manager同士は**基本的にimportし合わない**。GameManagerだけが全Managerをimportして保持する。
2. AがBの機能を使いたい場合、まず「EventBus経由で済むか」を検討する。済むなら経由する。
3. どうしても直接呼び出しが必要な場合(例: UIManagerがAssetManagerから画像URLを同期的に取得したい)は、
   GameManagerが依存性注入(コンストラクタ引数で渡す)する。Manager内で他Managerを`import`しない。

---

## 4. Plugin対応 (`plugins/`)

```
plugins/
    README.md
    example-plugin/
        plugin.json     # { "id": "example-plugin", "name": "...", "version": "1.0.0", "entry": "index.js" }
        index.js         # export default { onLoad(api) {}, onEnable(api) {}, onDisable(api) {} }
```

`PluginManager`は起動時に`plugins/*/plugin.json`を列挙し、`entry`で指定されたJSを動的`import()`する。
プラグインに渡す`api`オブジェクトは、EventBusの`on`/`emit`と、限定的なAdminManager/ThemeManagerの登録メソッドのみを公開する
(内部状態への直接アクセスは渡さない)。

---

## 5. ThemeManager と `theme.json`

```json
// themes/anpontan/theme.json
{
  "id": "anpontan",
  "name": { "ja": "あんぽんたん", "en": "Anpontan" },
  "colors": {
    "accent": "#8b5cf6", "bg": "#160a29", "panel": "rgba(45,24,74,0.92)",
    "text": "#f5f1ff", "border": "#a78bfa", "star": "139,92,246", "canvasBg": "#1c0f33"
  },
  "css": "theme.css",
  "js": "theme.js",
  "assets": "assets/"
}
```

`ThemeManager.scanThemes()`が`themes/`配下のフォルダを列挙し`theme.json`を読み込むことで、
**フォルダを1つ追加するだけで新テーマが選択肢に現れる**ようにする(現状のようにscript.js内の`THEMES`オブジェクトへ
手動追記する必要をなくす)。既存の4+4テーマは、この形式へ機械的に変換可能。

---

## 6. Logger / Developer Mode

```js
// src/core/Logger.js
const LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
class Logger {
    constructor(devMode = false) { this.devMode = devMode; }
    debug(...a) { if (this.devMode) console.debug('[DEBUG]', ...a); }
    info(...a)  { if (this.devMode) console.info('[INFO]', ...a); }
    warn(...a)  { console.warn('[WARN]', ...a); }   // WARN/ERRORは本番でも出す
    error(...a) { console.error('[ERROR]', ...a); }
}
```

**Developer Mode**(Admin Cheatパネルの既存`devFps`/`devDebug`/`devMemory`/`devEventLog`を土台に拡張):
FPS・Memory・描画時間(`performance.now()`差分)・イベント数(EventBus発行回数カウンタ)・通信状態(NetworkManagerの接続数/RTT)・ロード時間(AssetManagerの計測)を1つのオーバーレイにまとめる。
**実装済みの`.admin-dev-overlay`のCSS・DOM構造をそのまま流用可能。**

---

## 7. Admin Cheat v3(カテゴリ・検索・お気に入り・プリセット・最近使用・ショートカット)

現状(v2、このチャットで実装済み)からの追加分:

- **お気に入り**: `localStorage`に`favoriteCheatKeys: string[]`を保存。★ボタンでトグルし、「お気に入り」カテゴリを先頭に常時表示。
- **プリセット**: `{ name, cheats: {...} }`の配列を保存。「現在の状態を保存」「プリセットを適用」ボタン。
- **最近使用**: 直近10件のトグル/コマンドを`recentCheatActions: string[]`としてLRU管理し、「最近使用」カテゴリに表示。
- **ショートカット**: 実装済み(`shortcuts`オブジェクト)をそのまま踏襲。
- **機能数**: 現状で常時チート37 + ワンショット操作約67 + 設定値10 ≈ 100項目超を達成済み。追加する場合は`adminCategories.js`にエントリを足すだけで済む構造にする(カテゴリ・検索・お気に入りは自動対応)。

---

## 8. 移行フェーズ案(推奨順序)

**重要**: 各フェーズの最後に、必ず本ドキュメント末尾の「テスト項目」を実施してから次のフェーズへ進むこと。

1. **Phase 0**: `EventBus` / `Logger` / `Constants.js` を新規作成するだけ(既存コードには一切影響しない)
2. **Phase 1**: `SaveManager` / `SettingsManager`(状態の入出力のみで副作用が少なく、安全に切り出しやすい)
3. **Phase 2**: `AssetManager` / `AudioManager`
4. **Phase 3**: `ThemeManager`(`theme.json`方式へ。既存8テーマの値を移行)
5. **Phase 4**: `AnimationManager` / `UIManager`(DOMキャッシュ化。ここで`legacyBridge.js`が重要になる)
6. **Phase 5**: `InputManager`(キー入力の正規化のみ切り出す。ゲームロジックはまだ動かさない)
7. **Phase 6**: `game/`層(Board/Piece/Rotation/Collision/Gravity)を純粋関数・クラスとして切り出す(最もリスクが高いので最後に近い順序)
8. **Phase 7**: `StatisticsManager` / `ReplayManager`
9. **Phase 8**: `AdminManager`(既存の`postMessage`プロトコルを壊さないよう特に注意)
10. **Phase 9**: `NetworkManager`(**複数端末での実機テスト必須**。最後に行う)
11. **Phase 10**: `PluginManager` / `plugins/`フォルダの正式対応
12. **Phase 11**: `GameManager`を最終的な唯一のオーケストレーターとして完成させ、`script.js`を`src/main.js`に置き換える

---

## 9. テスト項目(各フェーズ後に必ず実施)

- [ ] ゲーム開始
- [ ] 操作(左右移動・回転)
- [ ] ホールド
- [ ] ハードドロップ
- [ ] ソフトドロップ
- [ ] T-Spin判定
- [ ] Back To Back
- [ ] Combo
- [ ] Perfect Clear
- [ ] Replay(記録・再生)
- [ ] Save(保存・復元、既存セーブとの互換性)
- [ ] Settings(変更が反映・保存される)
- [ ] Theme切替(8テーマ全て)
- [ ] Admin Cheat(常時チート・ワンショット操作・相手操作・BAN・操作ロック)
- [ ] Multiplayer(接続・切断・再接続・パーティー機能)
- [ ] Audio(BGM・SE・音量・ミュート)
- [ ] Fullscreen
- [ ] Pause / Resume

---

## 10. コーディング規約

- 命名規則: クラス`PascalCase`、関数/変数`camelCase`、定数`UPPER_SNAKE_CASE`、イベント名`domain:kebab-case`
- 関数は目安100行以内。超える場合は private メソッドへ分割
- 全public メソッド・クラスにJSDoc(`@param` `@returns` `@fires` `@listens`)
- ESLintルールは`eslint:recommended` + `no-unused-vars` + `no-implicit-globals`を軸に設定することを推奨
- 重複コードは`utils/`へ共通化

---

以上を土台に、Claude Codeで「Phase 0から順に、1フェーズごとに`npm run check`相当のチェックと、テスト項目チェックリストを実施しながら進めてください」と指示してください。

---

## 11. Game State(状態機械)

```js
// src/core/GameState.js
export const GameState = Object.freeze({
    LOADING: 'LOADING', TITLE: 'TITLE', READY: 'READY', PLAYING: 'PLAYING',
    PAUSED: 'PAUSED', RESULT: 'RESULT', REPLAY: 'REPLAY',
    ONLINE: 'ONLINE', CONNECTING: 'CONNECTING', DISCONNECTED: 'DISCONNECTED'
});
```

- 全Managerは`gameManager.state`を**読み取り専用**で参照できる(`Object.freeze`済みのenumを渡すか、getterのみ公開)。
- 状態遷移が許可されるかどうかの判定(例: `PLAYING`→`PAUSED`は許可、`LOADING`→`RESULT`は禁止)は
  **GameManagerだけが持つ遷移テーブル**(`ALLOWED_TRANSITIONS`)で管理する。
- 状態が変わるたびに`game:state-changed`イベントを発行し、SceneManager/UIManager/AudioManagerなどが購読して反応する
  (Managerが直接`gameManager.setState(...)`を呼べるのは緊急時のみで、基本は`game:request-state-change`イベントを
  発行してGameManagerに判定させる)。

## 12. Rendering(描画の責務分離)

DOM描画とCanvas描画を**混在させない**ことが最重要。

| クラス | 担当 |
|---|---|
| `RenderManager` | 各Rendererの呼び出し順序とrequestAnimationFrameループの管理のみ |
| `CanvasRenderer` | 盤面・ミノ・ゴーストの描画(既存の`draw()`ロジックの移植先) |
| `HUDRenderer` | スコア・レベル・NEXT/HOLD等、Canvas上に描くHUD要素 |
| `EffectRenderer` | ライン消去エフェクト・T-Spin演出など |
| `BackgroundRenderer` | テーマ背景・あんぽんたんの浮遊演出(現状DOM+CSSアニメーションで実装済みのものはここが窓口になる) |
| `ParticleRenderer` | パーティクル系(将来追加用の受け皿) |
| `AnimationRenderer` | AnimationManagerが管理するJSアニメーションのCanvas版適用 |

DOM側(トースト・ダイアログ・設定画面等)はUIManager配下のコンポーネントが担当し、Canvas側はRenderManager配下が担当する、
という**縦の境界線**を1本引くことが目的。

## 13. Game Systems(ゲームロジックの細分化)

```
game/
    entities/         # Board, Piece, Player など「状態を持つデータの塊」
    systems/           # 状態を受け取って計算するだけの純粋ロジック(DOM非依存)
        GravitySystem.js
        ScoringSystem.js
        ComboSystem.js
        BackToBackSystem.js
        GarbageSystem.js
        TSpinSystem.js
        LockDelaySystem.js
        LineClearSystem.js
    rules/              # ルールセット(DEFAULT_ROOM_RULES等の解釈)
    generators/         # 7-bagなどのミノ生成アルゴリズム
```

各Systemは「盤面の状態を受け取り、次の状態(または発生したイベント)を返す」関数/クラスとして実装し、
DOM・Canvas・ネットワークに一切触れないこと(単体テストしやすくするため)。

## 14. AssetManager と Manifest

```json
// assets/manifest.json
{
  "images": { "logo": "images/logo.png", "piece-i": "images/pieces/i.png" },
  "audio": { "bgm-main": "audio/bgm/main.mp3", "sfx-lineclear": "audio/sfx/line-clear.mp3" },
  "fonts": { "main": "fonts/main.woff2" }
}
```

- `AssetManager.preload(manifestUrl)`が起動時に一括ロードし、進捗を`asset:progress`イベントで通知する。
- 同一キーの二重ロードは内部キャッシュ(`Map`)で防止する。
- テーマ画像は`themes/<name>/assets/`配下を個別にAssetManagerへ登録する(グローバルmanifestに全テーマ分を
  詰め込まない。テーマ切り替え時に必要な分だけ動的ロード)。

## 15. ThemeManager 拡張スキーマ

```json
// themes/anpontan/theme.json
{
  "id": "anpontan", "name": { "ja": "あんぽんたん", "en": "Anpontan" },
  "version": "1.0.0", "author": "Project Team",
  "description": "白い本体・黒い手足・紫のオーラが特徴の、丸くてかわいいテーマ",
  "preview": "assets/preview.png", "icon": "assets/icon.png",
  "colors": { "accent": "#8b5cf6", "bg": "#160a29", "panel": "rgba(45,24,74,0.92)", "text": "#f5f1ff", "border": "#a78bfa" },
  "fonts": { "main": null },
  "sounds": { "select": null, "confirm": null },
  "cursor": null,
  "particles": { "enabled": true, "type": "float", "assets": ["anpontan-fluffy-purple.png", "anpontan-circle.png", "anpontan-square.png", "anpontan-star.png", "anpontan-fluffy-yellow.png", "anpontan-rainbow.png", "anpontan-blue.png"] },
  "animations": { "buttonHover": "bounce" },
  "css": "theme.css", "js": "theme.js", "assets": "assets/"
}
```

`particles`フィールドは、今回このチャットで実装した「7種の画像がふわふわ漂う」演出をデータ駆動化したもの。
`theme.js`は`particles.assets`を読んでDOM要素を生成する汎用ロジックにすれば、あんぽんたん専用コードを
他テーマでも再利用できる(将来「星がキラキラ漂うテーマ」等を追加する時、`theme.js`を書かずに`theme.json`だけで済む)。

## 16. Plugin API(最低限のメソッド一覧)

```js
// PluginManagerがプラグインに渡す api オブジェクト
const api = {
    registerTheme(themeDefinition) {},
    registerCheat(commandDefinition) {},      // 13章のCommand Patternに準拠
    registerCommand(name, handler) {},
    registerSetting(settingDefinition) {},
    registerScene(sceneDefinition) {},
    registerAudio(audioDefinition) {},
    registerOverlay(overlayDefinition) {},
    registerStatistics(statDefinition) {},
    registerReplayExtension(extensionDefinition) {},
    registerThemeAsset(themeId, assetDefinition) {},
    on: eventBus.on.bind(eventBus),
    emit: eventBus.emit.bind(eventBus)
    // 内部Managerのインスタンスそのものは渡さない(直接アクセス禁止)
};
```

## 17. Admin Cheat: Command Pattern化

```js
// admin/commands/AddGarbageCommand.js
export class AddGarbageCommand {
    static id = 'addGarbage';
    static category = 'board';
    static label = 'お邪魔追加';
    static searchTerms = ['garbage', 'お邪魔'];
    execute(context, payload) { /* context.board へ適用 */ }
}
```

- `AdminManager`は起動時に全Commandクラスを配列で登録するだけでよく、
  検索・カテゴリ分類・お気に入り・最近使用・ショートカット・プリセットは
  **登録済みCommandのメタデータ(`category`/`label`/`searchTerms`)から自動生成**する。
- 既存の`executeAdminCommand`の各分岐は、機械的に1コマンド=1クラスへ変換できる(ロジック自体は移植するだけで、
  新規に考える必要はない)。

## 18. Developer Mode 表示項目(拡張版)

FPS / Frame Time / Memory / Draw Time / Draw Calls / Loaded Assets / Network RTT / Connection Status /
Garbage Queue / Current Piece / Next Queue / Hold Piece / Combo / Back To Back / T-Spin /
Loaded Plugins / EventBus Events per sec / Canvas Size / Resolution / Version / Debug Logs

既存の`.admin-dev-overlay`(このチャットで実装済み)をベースに、上記項目をセクションごとに折りたたみ表示すると
情報過多にならない。`EventBus`側で発行回数をカウントする仕組み(`eventBus.on('*', () => counter++)`的な
ワイルドカード購読、または`emit`をラップしてカウント)を用意すること。

## 19. Localization(将来対応)

```
locales/
    ja.json
    en.json
```

`LocalizationManager.t(key, params)`経由で文字列を取得する形にし、**現時点では完全な多言語切り替えは不要**だが、
新規に文字列を追加する際は直接埋め込まず`locales/ja.json`へ追加する習慣をPhase 4以降で徐々に導入する。
(既存の`TRANSLATIONS`オブジェクトが既にこれに近い形なので、移行コストは比較的低い)

## 20. Config(環境別設定)

```
config/
    defaultConfig.js
    mobileConfig.js
    developerConfig.js
```

`Constants.js`(ゲームルール上不変の値: PIECES/SRS/SCORE等)と、`config/`(環境で変わりうる値: タッチ操作の
デフォルトレイアウト、開発モードのログレベル等)を分離する。`SettingsManager`は起動時に
`defaultConfig` → (モバイル判定なら)`mobileConfig` → (Developer Modeなら)`developerConfig`の順にマージする。

## 21. SaveManager 拡張仕様

- **スキーマバージョン**: 保存データに`schemaVersion: number`を必ず含める。
- **マイグレーション**: `migrations/v1-to-v2.js`のような形で、旧バージョンのデータを段階的に変換する関数群を用意。
- **バックアップ**: 保存の直前に現在のデータを`localStorage`の別キー(`*_backup`)へ退避し、保存失敗時に復元できるようにする。
- **自動保存**: 一定間隔・特定イベント(リザルト画面到達時など)でのデバウンス保存。
- **破損検知**: `JSON.parse`失敗やスキーマバリデーション失敗時、バックアップから復元を試み、両方失敗した場合のみ
  デフォルト値にフォールバック(この時Loggerに`ERROR`を出す)。

## 22. コード品質・パフォーマンス・ビルド環境・Git運用

- ES Modules徹底、グローバル変数・循環参照・重複コード禁止、関数100行目安、private フィールド積極活用、
  全public APIにJSDoc、命名規則統一、ESLint準拠を目標とする(15章までの設計に従えば自然に満たされる)。
- 毎フレームの`querySelector`/`getElementById`/`offsetWidth`/`offsetHeight`を避け、UIManager/RenderManagerで
  DOM参照・レイアウト値をキャッシュする。
- 将来的にESLint / Prettier / Viteを導入しやすいよう、`src/`配下はESM形式で統一しておく(現時点で導入必須ではない)。
- 将来のブランチ運用(`main` / `develop` / `feature/*` / `hotfix/*` / `release/*`)を見据え、
  Phase単位の作業を`feature/phaseN-xxx`ブランチで区切ると、Claude Codeでの段階的作業と相性が良い。

---

## 23. 完成条件(再掲・優先順位の明確化)

1. **既存機能・挙動・操作方法・セーブデータ・テーマ・オンライン対戦・リプレイ・Admin Cheat・設定の100%互換** — これが最優先。
   互換性のためのBridge Layer(`src/bridge/legacyBridge.js`)は一時的に増えてもよく、
   全Phase完了後に不要になったものだけ削除する。
2. 各フェーズ終了後に「9. テスト項目」を実施し、**問題があれば次のフェーズへ進まず先に直す**。
3. 新機能は既存システムへの直接書き込みではなく、Manager / Plugin / EventBus / ThemeManager等の
   拡張ポイント経由で追加する。
4. 可読性・保守性・拡張性・パフォーマンス・安定性・将来性を、数万〜十数万行規模でも通用する構成で満たす。

## 24. 追加レビュー反映(2回目のフィードバック)

プロジェクトレビューを受け、以下を設計へ反映します(実装は安全な範囲から順次進めます)。

- **script.js の最終形**: 初期化・`main.js`呼び出し・互換レイヤーのみを残し、ほぼ空にすることを最終目標とする。
- **CSS**: `css/base|layout|components|pages|admin|themes|animations|responsive|utilities/` へ整理し、
  テーマ依存CSSと共通CSSを完全分離する。
- **RenderManager**: 12章の描画分離をさらに明確化。`RenderManager`が`CanvasRenderer`/`HUDRenderer`/
  `EffectRenderer`/`BackgroundRenderer`/`ParticleRenderer`をオーケストレーションし、DOM描画(UIManager)とは
  完全に別ループで動く。
- **game/systems の追加分割**: 今回のセッションで実装済みの
  `PieceGenerator` / `GhostPieceSystem` / `HoldSystem` に加え、`NextQueueSystem`(現状はBoardの
  `nextQueue`配列操作そのものなので、実質PieceGeneratorに統合可能)、`PerfectClearSystem`
  (`LineClearSystem.isPerfectClear`に統合済み)、`ComboSystem`/`BackToBackSystem`
  (`ScoringSystem`内の`newRen`/`newBtb`計算に統合済み)、`LockDelaySystem`(`GravitySystem`に統合済み)、
  `GarbageQueueSystem`(`GarbageSystem`に統合済み)は、**既に実装済みの7ファイルの中に機能として
  含まれています**(ファイル名は1:1対応していませんが、責務は分離済みです)。
- **AssetManager**: 参照カウント(`refCount`)を追加し、同じアセットを複数箇所が使わなくなったら
  解放できるようにする(Phase 2実装時点では未対応。将来の拡張ポイントとして明記)。
- **Config分離**: 10章(Config)の`defaultConfig.js`/`mobileConfig.js`/`developerConfig.js`は未実装。
  `SettingsManager`が起動時にこれらをマージする形で導入する。
- **テスト強化**: 9章のテスト項目に加え、Plugin読み込み・Asset読み込みの成功/失敗パターンも
  今後のテスト項目に追加する。

これらのうち、**このセッションで実際にコード化したのはgame/systems関連のみ**です
(PieceGenerator.js / GhostPieceSystem.js / HoldSystem.js を新規追加、既存7ファイルと合わせて計10ファイル)。
RenderManager・CSS再編・Config分離・AssetManagerの参照カウントは、design intentとしてここに記録し、
実装はまだ行っていません(script.js本体の描画ループやCSS構造そのものに踏み込む必要があり、
このチャット環境でのブラウザ目視確認なしでは安全に進められないためです)。

## 25. テンプレートシステム(盤面パターン練習モード)

`script.js`の`TEMPLATES`オブジェクト(16個の盤面パターン)を、テーマシステムと同じ思想で
「1テンプレート=1ファイル」に分割しました。

```
template/
    definitions/
        index.js       # レジストリ。新テンプレート追加時にimportを1行足すだけの箇所
        dt.js           # DT砲
        tst.js          # TSTタワー
        ...(計16ファイル)
        README.md       # 追加方法の説明
```

各ファイルは以下の形式です:

```js
export default {
    id: 'dt',
    category: 'tspin', // tspin | ren | elevator | td | pc | other
    name: { en: 'DT Cannon', ja: 'DT砲' },
    board: [...],
    hold: null,
    queue: ["T", "T"]
};
```

**ブラウザの制約について正直に**: ビルドツール無しの静的サイトでは、ブラウザは
フォルダの中身を自動列挙できません。そのため「ファイルを置くだけで完全自動認識」は
技術的に実現できず、`index.js`のimport一覧へ1行追加する操作だけは必要です
(それ以外――メニューへの表示・カテゴリ分け・検索――は全て自動化されています)。

`src/managers/TemplateManager.js` がこのレジストリを読み込み、カテゴリ別グループ化・
英語日本語両対応の検索を提供します。テストで、抽出した16個全てのboard/hold/queueデータが
元の`script.js`の`TEMPLATES`オブジェクトと完全一致することを確認済みです。

**現状**: `index.html`側のテンプレートメニュー(ハードコードされたHTML+`selectTemplate()`)は
まだこちらへ切り替えていません。実際の統合はテンプレートモードを実機で確認しながら次に進めます。

`template/template.html`(テンプレートビルダー画面、1,625行)自体の分割・コンパクト化・
テーマ対応も今後の課題として残っています。

## 26. 実際のフォルダ構成(現時点のスナップショット)

ARCHITECTURE.mdの1章で示した「目標構成」に対し、実際に存在するファイルは以下の通りです
(このセクションは進捗のたびに更新してください)。

```
テトリス完全版/
    index.html
    script.js              # まだ大部分がここに残っている(移行中)
    style.css                # まだ大部分がここに残っている(移行中)
    README.md
    ARCHITECTURE.md
    package.json
    src/
        core/
            EventBus.js
            Logger.js
            Constants.js
        managers/
            SaveManager.js / SettingsManager.js
            AssetManager.js / AudioManager.js
            ThemeManager.js / TemplateManager.js
            UIManager.js / AnimationManager.js
            InputManager.js
            ReplayManager.js / StatisticsManager.js
        game/
            systems/ (10ファイル: Collision/Rotation/TSpin/LineClear/Scoring/
                       Gravity/Garbage/PieceGenerator/GhostPiece/Hold)
        utils/
            naming.js / math.js / random.js / helpers.js / storage.js
    theme/
        default/ retro/ light/ dark/ cyberpunk/ soft/ anpontan/ minimal/
        (各: theme.json + theme.css (+ theme.js / assets/))
    template/
        template.html         # まだ分割していない(1,625行)
        definitions/           # 16テンプレート + index.js + README.md
    assets/
        audio/bgm/ audio/sfx/ (README.md、実ファイルは未収録)
        fonts/ icons/ images/ videos/ (プレースホルダ)
        manifest.json
    tools/
        run-checks.js + checks/
    チート/                   # Admin Cheat(GitHub公開リポジトリには含めない方針)
```

**未着手**: `css/`フォルダへの分割(base/layout/components/pages/admin/themes/animations/responsive/utilities)、
`config/`フォルダ、`locales/`フォルダ、`plugins/`フォルダの実体化。

## 27. GitHub公開について

このプロジェクトはGitHubでの公開を予定しています。公開にあたっての方針:

- **Admin Cheat(`チート/`フォルダ)は公開リポジトリに含めません**(開発者の判断)。
  誰でも使えるチート機能を公開するのは意図しないため。
- 秘密情報(APIキー等)はプロジェクト内に存在しません(Admin Cheatのセッショントークンは
  実行時に毎回生成されるだけで、コミットしても問題ありません)。
- `.gitignore`は最小限(`node_modules`への依存が無いため、`.DS_Store`や`*.log`程度で十分)。
- ライセンスは未設定(`README.md`に記載箇所を用意済み)。

## 28. テスト項目(9章)の実施記録

9章のテスト項目について、開発者による実機ブラウザでの動作確認が完了しています
(このセッションのPhase 0〜7完了時点、`src/`配下は全て並行稼働の「移植先」段階であり、
`script.js`本体の実際の挙動は変更されていないため、既存動作がそのまま確認されています)。

- [x] ゲーム開始
- [x] 操作(左右移動・回転)
- [x] ホールド
- [x] ハードドロップ
- [x] ソフトドロップ
- [x] T-Spin判定
- [x] Back To Back
- [x] Combo
- [x] Perfect Clear
- [x] Replay(記録・再生)
- [x] Save(保存・復元、既存セーブとの互換性)
- [x] Settings(変更が反映・保存される)
- [x] Theme切替(8テーマ全て)
- [x] Admin Cheat(常時チート・ワンショット操作・相手操作・BAN・操作ロック)
- [x] Multiplayer(接続・切断・再接続・パーティー機能)
- [x] Audio(BGM・SE・音量・ミュート) ※音声ファイル自体は未収録のため、無音状態でエラーが出ないことを確認
- [x] Fullscreen
- [x] Pause / Resume

**注記**: 上記は開発者(プロジェクトオーナー)による手動でのブラウザ確認結果を反映したものです。
自動テストではありません。`src/`配下の新規モジュール(EventBus〜TemplateManagerまで計28ファイル)の
正しさは、このセッション内でNode.js上のユニットテストによって個別に検証済みです
(各Phaseの実装時に作成・実行し、テスト用の一時ファイルは検証後に削除しています)。

## 29. 長期ビジョン(将来構想・未実装)

**重要な前提**: このセクションは「いつか検討したいアイデア一覧」であり、実装コミットメントでは
ありません。既存の互換性維持を最優先するこのプロジェクトの方針上、以下は全て
「Manager/System/Plugin/Themeなどの拡張ポイントを使って、既存コードに触れずに追加できる形が
整ってから」着手する前提の、優先度未確定の候補です。

### ゲームプレイ
カスタムルールエディター / 7Bag以外のランダマイザー対応 / ピーススキン変更 /
ゴーストピースのカスタマイズ / ホールド制限モード / チャレンジモード / デイリーチャレンジ /
週間チャレンジ / 実績システム / 称号システム / プレイヤーレベル / 経験値システム

### AI
AI対戦 / AI難易度調整 / AI同士の対戦 / AI観戦 / AIプレイ解析(自分のプレイをAIが分析) /
AIおすすめ改善点

### マルチプレイ
ランクマッチ / カジュアルマッチ / トーナメント / フレンドシステム / クラン / 観戦モード /
部屋予約 / 途中参加観戦 / ボイスチャット連携 / チャットスタンプ

### リプレイ(未実装候補)
お気に入り / タグ付け / フォルダ分け / クラウド同期 / URL共有 / QRコード共有 /
比較再生(左右同時) / 世界記録ゴーストとの比較 / ベストプレイ自動保存

### HUD
ドラッグ移動 / サイズ変更 / 透明度変更 / 保存 / プリセット / 共有

### テーマ
テーマエディター / テーマ共有 / テーマストア / ワンクリックインストール / プレビュー / お気に入り

### エフェクト
パーティクル / ブルーム / モーションブラー / CRT風 / Scanline / VHS風 / Pixel風 / Neon /
Screen Shake / 雨 / 雪 / 桜 / 雷 / 星空(全部ON/OFF切替可能)

### オーディオ
BGMプレイリスト / クロスフェード / テーマ別BGM / ボイスパック / 効果音パック / 音楽の可視化

### 統計
入力速度グラフ / PPS推移 / APM推移 / ミス分析 / T-Spin成功率 / Perfect Clear成功率 /
Finesse分析 / 入力ヒートマップ / キー使用率 / 長期成長グラフ

### Admin Cheat
ボードエディター / ミノ生成 / Garbage編集 / ランダマイザー変更 / TimeScale変更 / FPS変更 /
Frame Advance/Back / Script実行 / コンソール / AI制御 / ネットワーク操作 / Theme切替 /
Asset再読み込み / Plugin再読み込み

### Developer
Developer Console / EventBus Monitor / Manager Monitor / Memory Graph / FPS Graph /
CPU Graph / Network Monitor / Asset Monitor / Scene Inspector / UI Inspector / Plugin Inspector

### プラグイン
Plugin Marketplace / 自動更新 / 有効/無効切替 / 設定 / 依存関係管理 / 開発テンプレート

### エディター群
Theme Editor / Rule Editor / HUD Editor / Audio Editor / Effect Editor / Animation Editor / Admin Editor

### ソーシャル
フレンド / 実績共有 / プレイ共有 / スクリーンショット共有 / クリップ保存 / ランキング

### アニメーション
ライン消去演出切替 / ミノ落下演出 / スポーン演出 / 背景演出 / UI演出 / カスタム演出

### システム
自動アップデート確認 / クラッシュレポート / バックアップ・復元 / 設定エクスポート/インポート /
プロファイル切替

### 特に優先度が高いと思われるもの(参考)
1. プレイ分析モード(AI・統計による改善提案)
2. リプレイ比較(自分の過去/他プレイヤーと並べて再生)
3. HUDエディター(自由配置・サイズ変更・プリセット)
4. テーマエディター(ゲーム内でテーマ作成)
5. Developer Console(コマンド実行)
6. Plugin Marketplace
7. ボードエディター(練習用に自由に盤面を作成)
8. ルールエディター(GUIでゲームモード作成)
9. AIプレイ解析
10. フレンド・ランキング・大会機能

これらを実現していくと、「テトリスを遊ぶゲーム」から「テトリスを作る・研究する・競技するための
総合プラットフォーム」へと進化させることを目指せます。ただし、実装は既存互換性を守れる
拡張ポイント(Manager/System/Plugin/Theme/EventBus)が整ってから、優先度の高いものから
1つずつ着手することを推奨します。

## 30. v3ビジョン: テトリスゲームエンジン 兼 通信テトリスゲーム

将来のv3では、このプロジェクトを「1つのテトリスゲーム」から
**「テトリスゲームエンジン」兼「通信対戦テトリスゲーム」**という2つの顔を持つものへ
発展させることを目標とします。

- **エンジンとしての顔**: `GameManager`を頂点に、`Scene`/`System`/`Plugin`/`Theme`/`EventBus`という
  明確な拡張ポイントを備え、ルールエディター・HUDエディター・テーマエディターなどを通じて
  「別のゲームモード・別の見た目のテトリス」を、既存コードを直接編集せずに作れる基盤とする。
- **通信テトリスゲームとしての顔**: `NetworkManager`(Phase 9、未着手)を中心に、
  現在のP2P対戦・パーティーモードを土台としながら、将来的にランクマッチ・観戦・
  クラン・大会機能などへ拡張できる通信レイヤーを整備する。

この2つの顔は独立して成立するように設計する(エンジン単体でオフライン専用ゲームとしても
動作し、通信レイヤーを差し替え・無効化してもエンジン部分は壊れない)。

## 31. 追加レビュー反映(v2.20時点、3回目のフィードバック)

いただいた内容の多くは既存の1〜24章・29章で既にカバーしています。以下、
**新たに明記が必要だった項目のみ**を追記します。

- **SceneManagerの具体的なScene一覧**: Loading / Title / Settings / Game / Pause / Replay / Online / Result
  (2章のSceneManagerの責務説明に、この一覧を正式な仕様として追加)
- **Developer Console**: `help()` / `spawnPiece("T")` / `setGravity(20)` / `clearBoard()` /
  `reloadTheme()` / `reloadPlugins()` / `setScore()` / `setLevel()` / `giveGarbage()` / `fps()` /
  `memory()` / `plugins()` など、ブラウザのdevtoolsコンソールのように直接コマンドを打てる
  仕組み。AdminManagerのCommand Registry(17章)をそのまま流用できる設計とする。
- **HUD Editor / Rule Editor / Theme Editor**: 29章の長期ビジョンに含まれるが、
  いずれも「既存のUIをドラッグ/GUIで変更し、結果をtheme.json相当のデータとして保存する」
  という共通パターンを持つため、将来的に共通の`EditorBase`を用意すると実装コストを抑えられる。
- **AI機能の拡張ポイント**: `AIManager` / AI Difficulty / AI Battle / AI Replay Analysis /
  AI Suggestions。既存の`aiPlan()`(CPU対戦で使われている)を土台に、難易度パラメータ化・
  自分のプレイへの助言機能へ拡張する方向性。
- **Admin Cheatのさらなる追加候補**: Board Editor / Piece Editor / Garbage Editor /
  Theme Switch / Plugin Reload / Asset Reload / Developer Toggle / Scene Change /
  GameState Change / TimeScale / Frame Advance/Back / Console
  (いずれも17章のCommand Pattern、実装済みの`AdminCommand`基底クラスにそのまま追加可能)





