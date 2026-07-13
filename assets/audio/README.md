# assets/audio/ 音声ファイルの置き方

BGM・効果音を追加する時は、このフォルダへファイルを置いた上で、
`assets/manifest.json` の `audio` セクションにキーを追加してください
(`AssetManager` がここに書かれたパスを読み込みます)。

```
assets/audio/
    bgm/     ... BGM(ループ再生される曲)
    sfx/     ... 効果音(短い1回再生の音)
```

## 推奨ファイル名(AudioManager が既定で参照するキー名)

`AudioManager` は最初から以下のキー名でイベント連動できるように用意してあります。
同名のファイルを置いて `manifest.json` に登録するだけで音が鳴るようになります
(ファイルが無い/manifestに未登録の間は、何もせず静かにスキップされるので、
音声ファイルが揃っていない現時点でも安全に動作します)。

### BGM (`assets/audio/bgm/`)
| キー名 | 用途 |
|---|---|
| `bgm-title` | タイトル画面 |
| `bgm-main` | 対戦中 |
| `bgm-result` | リザルト画面 |

### 効果音 (`assets/audio/sfx/`)
| キー名 | 用途 |
|---|---|
| `sfx-move` | 左右移動 |
| `sfx-rotate` | 回転 |
| `sfx-softdrop` | ソフトドロップ |
| `sfx-harddrop` | ハードドロップ |
| `sfx-hold` | ホールド |
| `sfx-lineclear` | ライン消去(1〜3ライン) |
| `sfx-tetris` | テトリス(4ライン) |
| `sfx-tspin` | T-Spin成立 |
| `sfx-combo` | コンボ継続 |
| `sfx-b2b` | Back To Back継続 |
| `sfx-perfectclear` | パーフェクトクリア |
| `sfx-topout` | 積み上がり(ゲームオーバー) |
| `sfx-levelup` | レベルアップ |
| `sfx-garbage` | お邪魔ライン受信 |
| `sfx-win` | 勝利 |
| `sfx-lose` | 敗北 |
| `sfx-menu-select` | メニューのカーソル移動 |
| `sfx-menu-confirm` | メニューの決定 |
| `sfx-countdown` | 対戦開始前のカウントダウン |

## サンプル `manifest.json` の書き方

```json
{
  "audio": {
    "bgm-main": "assets/audio/bgm/main.mp3",
    "sfx-lineclear": "assets/audio/sfx/line-clear.mp3"
  }
}
```

対応フォーマットはブラウザが再生できるもの(`.mp3` / `.ogg` / `.wav` 等)であれば何でも構いません。
