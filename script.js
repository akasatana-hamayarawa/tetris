        // --- Constants ---
        const PIECES = {
            'I': [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            'J': [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
            'L': [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
            'O': [[4, 4], [4, 4]],
            'S': [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
            'T': [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
            'Z': [[7, 7, 0], [0, 7, 7], [0, 0, 0]],
            'B': [[9]],
            'X': [[10]]
        };
        const COLORS = [null, '#00f0f0', '#0000f0', '#f0a000', '#f0f000', '#00f000', '#a000f0', '#f00000', '#444', '#ff7a00', '#050505'];
        const RISE_MINO_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

        const KICKS = {
            "0-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
            "1-0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
            "1-2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
            "2-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
            "2-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
            "3-2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
            "3-0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
            "0-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        };

        const KICKS_I = {
            "0-1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
            "1-0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
            "1-2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
            "2-1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
            "2-3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
            "3-2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
            "3-0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
            "0-3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
        };

        const TEMPLATES = {
            dt: { board: [".....5....", "..33.55.55", "...3775551", "22.3677441", "2..6661441", "2...551771", "44.5531277", "44.3331222"], hold: null, queue: ["T", "T"] },
            pc: { board: ["1111....55", "2443...556", "2443..7766", "2233...776"], hold: null, queue: ["Z", "L", "I"] },
            nren: { board: [".72....222", "772....152", "722....155", "333....155", "372....155", "772....165", "722....166", "333....167", "443....177", "442....177", "222....177", "222....177", "352....166", "355....156", "335....155", "333....155", "344....155", "244...6775", "222..66677"], hold: null, queue: ["S", "L", "S", "O", "L", "Z", "J", "S", "I", "S", "O", "T", "L", "I", "S", "T", "I", "O", "L"] },
            sren: { board: ["222222....", "333333....", "111111....", "444444....", "555555....", "666666....", "777777....", "222222....", "333333....", "111111...."], hold: null, queue: ["I", "L", "J", "O", "S", "T", "Z"] },
            tst: { board: [".7.......3", "77..5..333", "7...551111", "1.33653333", "1..3663333", "1.53633222", "1.55443233", "3..5443443", "3.77666443", "33.7761111"], hold: "T", queue: ["T", "T"] },
            hachi: { board: ["1333......", "1355..22..", "155...2442", "155.772442", "553..77622", "333.776644", "1111.77644"], hold: "T", queue: ["T"] },
            meisou: { board: ["......4421", "5..7..4421", "5577...221", "157333.771", "13536..277", "135566.244", "13356.2244"], hold: "T", queue: ["T"] },
            iev: { board: ["7.777777.7", "6.666666.6", "2.2......2", "1.1.111111", "5.5.555555", "4.4......4", "3.333333.3", "7.777777.7", "6.6......6", "2.2.222222", "1.1.1111111", "5.5......5", "4.444444.4", "3.333333.3", "7........7"], hold: null, queue: ["I"] },
            hren: {
                "board": [
                    ".........3",
                    "....666333",
                    "....163333",
                    "....144313",
                    "....144313",
                    "....122212",
                    "....226212",
                    "....266122",
                    "....276122",
                    "....773121",
                    "....763121",
                    "....663331",
                    "....365531",
                    "....3556333",
                    "....336644",
                    "....2276444",
                    "....277222",
                    "....275562",
                    ".111155666"
                ],
                "hold": "I",
                "queue": ["Z", "O", "I", "T", "J", "O", "I", "I", "T", "L", "Z", "I", "T", "L", "O", "Z", "O", "L"]
            },
            jev: {
                "board": [
                    "4..44444.4",
                    "3.3333...3",
                    "7...777..7",
                    "666.666.66",
                    "2.2.222...",
                    "1...1111.1",
                    "5..555...5",
                    "4.4.4.4..4",
                    "3.......333",
                    "77........"
                ],
                "hold": null,
                "queue": [
                    "J"
                ]
            },
            lev: {
                "board": [
                    "4.44444..4",
                    "3...3333.3",
                    "7..777...7",
                    "66.666.666",
                    "...222.2.2",
                    "1.1111...1",
                    "5...555..5",
                    "4..4.4.4.4",
                    "33.......3",
                    "........77"
                ],
                "hold": null,
                "queue": [
                    "L"
                ]
            },
            sgk2: {
                "board": [
                    "2244......",
                    "2544..3..1",
                    "255...3331",
                    "155.773331",
                    "155..77631",
                    "125.776644",
                    "1222.77644"
                ],
                "hold": "T",
                "queue": [
                    "T",
                    "L",
                    "O",
                    "Z",
                    "I",
                    "J"
                ]
            },
            gmsr: {
                "board": [
                    "1.......44",
                    "1.......44",
                    "122.....33",
                    "12....5533",
                    "52.7755133",
                    "55..776133",
                    "25.7766144",
                    "222.776144"
                ],
                "hold": "T",
                "queue": [
                    "T",
                    "L",
                    "S",
                    "I",
                    "J",
                    "O"
                ]
            },
            hpc: {
                "board": [
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
                "hold": null,
                "queue": [
                    "Z",
                    "L",
                    "O",
                    "S",
                    "J",
                    "I",
                    "T"
                ]
            },
            gspc: {
                "board": [
                    "122......3",
                    "12...75333",
                    "126.775544",
                    "16667..544"
                ],
                "hold": null,
                "queue": [
                    "T",
                    "L",
                    "J"
                ]
            },
            trsn: {
                "board": [
                    "222....666",
                    "271....561",
                    "771....551",
                    "761...77511",
                    "666....7711",
                    "222333.333",
                    "4423...355",
                    "4432...556",
                    "333222.166",
                    "227333.156",
                    "2773...155",
                    "2762...165",
                    "666222.666",
                    "666333.222",
                    "6553...162",
                    "5512...166",
                    "441222.161",
                    "441333.171",
                    "2213...771",
                    "2442...761",
                    "244222.666"
                ],
                "hold": null,
                "queue": [
                    "J",
                    "T",
                    "J",
                    "T",
                    "J",
                    "T",
                    "J",
                    "T"
                ]
            }
        };

        const LOCK_RESET_LIMIT = 15;
        const CUSTOM_TEMPLATE_STORAGE_KEY = 'tetrisProUltCustomTemplates_v1';
        const TEMPLATE_MINO_SET = new Set(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);
        let customTemplates = [];

        function normalizeCustomTemplateData(input) {
            const data = input && input.template ? input.template : input;
            if (!data || !Array.isArray(data.board)) {
                throw new Error('board が見つかりません。');
            }
            if (data.board.length > 42) {
                throw new Error('board の行数が多すぎます。');
            }

            const board = data.board.map((row) => {
                const rowText = String(row ?? '').padEnd(10, '.').slice(0, 10);
                if (!/^[.1-8]{10}$/.test(rowText)) {
                    throw new Error('board 内に不正な値があります。');
                }
                return rowText;
            });

            const hold = data.hold === undefined || data.hold === null || data.hold === ''
                ? null
                : String(data.hold).toUpperCase();
            if (hold !== null && !TEMPLATE_MINO_SET.has(hold)) {
                throw new Error('hold の値が不正です。');
            }

            const queue = Array.isArray(data.queue)
                ? data.queue.map((mino) => String(mino).toUpperCase()).filter(Boolean)
                : [];
            if (!queue.every((mino) => TEMPLATE_MINO_SET.has(mino))) {
                throw new Error('queue 内に不正なミノがあります。');
            }

            return { board, hold, queue, tallBoard: doesTemplateNeedTallBoard({ board }) };
        }

        function getTemplateStackHeight(template) {
            const rows = Array.isArray(template && template.board) ? template.board : [];
            const firstOccupied = rows.findIndex((row) => /[1-8]/.test(String(row || '')));
            return firstOccupied < 0 ? 0 : rows.length - firstOccupied;
        }

        function doesTemplateNeedTallBoard(template) {
            return getTemplateStackHeight(template) >= 20;
        }

        function sanitizeCustomTemplateName(name) {
            return String(name || '').trim().slice(0, 32);
        }

        function createCustomTemplateId() {
            return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }

        function registerCustomTemplateRecord(record) {
            if (!record || !record.id || !record.template) return;
            TEMPLATES[record.id] = record.template;
        }

        function saveCustomTemplates() {
            localStorage.setItem(CUSTOM_TEMPLATE_STORAGE_KEY, JSON.stringify(customTemplates));
        }

        function loadCustomTemplatesFromStorage() {
            try {
                const stored = JSON.parse(localStorage.getItem(CUSTOM_TEMPLATE_STORAGE_KEY) || '[]');
                customTemplates = Array.isArray(stored) ? stored.map((entry) => {
                    const id = String(entry.id || createCustomTemplateId());
                    const name = sanitizeCustomTemplateName(entry.name) || 'カスタムテンプレート';
                    return {
                        id,
                        name,
                        template: normalizeCustomTemplateData(entry.template || entry),
                        createdAt: entry.createdAt || Date.now()
                    };
                }) : [];
            } catch (error) {
                console.warn('Failed to load custom templates:', error);
                customTemplates = [];
            }
            customTemplates.forEach(registerCustomTemplateRecord);
        }

        function renderCustomTemplateButtons() {
            const list = document.getElementById('custom-template-list');
            if (!list) return;
            list.innerHTML = '';
            customTemplates.forEach((entry) => {
                const btn = document.createElement('button');
                btn.className = 'btn';
                btn.style.setProperty('--accent', '#55aaff');
                btn.textContent = entry.name;
                btn.addEventListener('click', () => selectTemplate(entry.id));
                list.appendChild(btn);
            });
        }

        loadCustomTemplatesFromStorage();

        const TRANSLATIONS = {
            en: { settings: "SETTINGS", "tab-general": "GENERAL", "tab-ui": "UI SETTINGS", "tab-handling": "HANDLING", "tab-keys": "KEYS", "label-lang": "LANGUAGE", "label-name": "PLAYER NAME", "label-theme": "THEME", "label-level": "CPU LEVEL", "solo-levelup": "SOLO LEVEL UP", "stats-time": "TIME", "stats-lines": "LINES", "stats-level": "LEVEL", "label-ghost": "GHOST OPACITY", "label-particles": "BACKGROUND PARTICLES", "label-das": "DAS (Delayed Auto Shift)", "label-arr": "ARR (Auto Repeat Rate)", "label-sdf": "SDF (Soft Drop Factor)", "key-left": "MOVE LEFT", "key-right": "MOVE RIGHT", "key-soft": "SOFT DROP", "key-hard": "HARD DROP", "key-rotR": "ROTATE RIGHT", "key-rotL": "ROTATE LEFT", "key-hold": "HOLD (PRIMARY)", "key-hold2": "HOLD (SECONDARY)", "save-close": "SAVE & CLOSE", "menu-solo": "SOLO PLAY", "menu-cpu": "VS CPU", "menu-template": "TEMPLATE MODE", "menu-continue": "CONTINUE", "menu-online": "ONLINE PLAY", "online-quickmatch": "QUICK MATCH", "online-searching": "Searching for opponent...", "online-err-full": "Room is full", "online-create": "CREATE ROOM", "online-enter-code": "Enter Room Code", "online-join": "JOIN ROOM", "online-lobby-title": "ROOM LOBBY", "online-your-code": "YOUR ROOM CODE", "online-waiting": "Waiting for connection...", "online-connected": "Connected! Ready to start.", "online-start": "START GAME", "online-leave": "LEAVE ROOM", "online-err-notfound": "Invalid or missing room code.", "online-err-idinuse": "Room code is already in use.", "online-err-empty": "Please enter a code.", "tmpl-dt": "DT Cannon", "tmpl-pc": "Perfect Clear Setup", "tmpl-ren": "Center REN", "tmpl-tst": "TST Tower", "tmpl-hachi": "Hachimitsu Cannon", "tmpl-meisou": "Stray Cannon", "tmpl-back": "BACK", "tmpl-RS": "REN series", "tmpl-ES": "Elevator series", "tmpl-TS": "TD series", "tmpl-iev": "I mino elevator", "tmpl-jev": "J mino elevator", "tmpl-lev": "L mino elevator", "tmpl-hren": "Edge Opening", "tmpl-nren": "Center REN", "player-label": "PLAYER", "label-hold": "HOLD", "label-next": "NEXT", "label-score": "SCORE", victory: "VICTORY", defeat: "DEFEAT", gameover: "GAME OVER", "tab-play": "PLAY SETTINGS", "ospin-transform": "O-SPIN TRANSFORM", "ospin-transform-fixed": "I-mino (Fixed)", "ospin-transform-random": "Random (No O)", "tab-play": "PLAY SETTINGS", "ospin-transform": "O-SPIN TRANSFORM", "ospin-transform-fixed": "I-mino (Fixed)", "ospin-transform-random": "Random (No O)", "ospin-label": "O-SPIN ENABLED", "save-game": "SAVE GAME", "select-slot": "Select Slot", "save-name": "Save Name", "save-and-menu": "SAVE & EXIT TO MENU", "load-game": "LOAD GAME", "load-btn": "LOAD", "theme-default": "Default", "theme-retro": "Retro", "theme-light": "Light", "theme-dark": "Dark", "online-settings": "ROOM SETTINGS", "online-target-wins": "Target Wins", "online-party-mode": "Party Mode", "online-party-count": "Players (2-4)", "online-create-btn": "CREATE", "tmpl-cancel": "CANCEL", "key-pause": "PAUSE / CANCEL", "key-retry": "RETRY / RESTART", "pause-title": "PAUSED", "pause-msg": "Press PAUSE to Resume. Press RETRY to Restart.", "scale-label": "Screen Size", "btn-screen-scale": "Change Screen Size" },
            ja: { settings: "設定", "tab-general": "一般", "tab-ui": "UI設定", "tab-handling": "操作速度", "tab-keys": "キー配置", "label-lang": "言語設定", "label-name": "プレイヤー名", "label-theme": "テーマ", "label-level": "CPU レベル", "solo-levelup": "ソロでレベル上昇", "stats-time": "タイム", "stats-lines": "ライン", "stats-level": "レベル", "label-ghost": "影の透明度", "label-das": "横移動の溜め時間 (DAS)", "label-arr": "横移動の速さ (ARR)", "label-sdf": "ソフトドロップ速度 (SDF)", "key-left": "左に移動", "key-right": "右に移動", "key-soft": "ソフトドロップ", "key-hard": "ハードドロップ", "key-rotR": "右回転", "key-rotL": "左回転", "key-hold": "ホールド (メイン)", "key-hold2": "ホールド (サブ)", "save-close": "設定を保存して閉じる", "menu-solo": "一人でプレイ", "menu-cpu": "CPU対戦", "menu-template": "テンプレートモード", "menu-continue": "続きから始める", "menu-online": "対人戦","menu-replay":"リプレイを見る", "online-quickmatch": "ランダムマッチ", "menu-tutorial": "チュートリアル","online-searching": "対戦相手を検索中...", "online-err-full": "満室です", "online-create": "部屋を作る", "online-enter-code": "コードを入力", "online-join": "参加する", "online-lobby-title": "待機ルーム", "online-your-code": "あなたのルームコード", "online-waiting": "接続を待っています...", "online-connected": "接続完了！開始できます。", "online-start": "ゲームスタート", "online-leave": "部屋を退出", "online-err-notfound": "コードが間違っているか、無効です", "online-err-idinuse": "その部屋番号はすでに使われています", "online-err-empty": "コードを入力してください", "tmpl-dt": "DT砲", "tmpl-pc": "パフェテンプレ", "tmpl-nren": "中開けREN", "tmpl-gspc": "合掌パフェ", "tmpl-tst": "TSTタワー", "tmpl-hachi": "はちみつ砲", "tmpl-TSPIN": "T-spin系", "tmpl-meisou": "迷走砲", "tmpl-iev": "Iミノエレベーター", "tmpl-jev": "Jミノエレベーター", "tmpl-hren": "端開けREN", "tmpl-back": "戻る", "tmpl-RS": "REN系", "tmpl-ES": "エレベーター系", "tmpl-TS": "TD系テンプレ", "tmpl-PCS": "パフェ系", "tmpl-lev": "Lミノエレベーター", "tmpl-sgk2": "山岳積み2号", "tmpl-gmsr": "ガムシロ砲", "tmpl-hpc": "変なパフェ", "tmpl-trsn": "超螺旋", "player-label": "プレイヤー", "label-hold": "ホールド", "label-next": "ネクスト", "label-score": "スコア", victory: "勝利", defeat: "敗北", gameover: "ゲームオーバー", "tab-play": "プレイ設定", "ospin-transform": "O-SPIN 変形先", "ospin-transform-fixed": "Iミノに変換 (固定)", "ospin-transform-random": "ランダム (O以外)", "ospin-label": "O-SPIN可能？", "save-game": "ゲームをセーブ", "select-slot": "スロットを選択", "save-name": "セーブデータ名", "save-and-menu": "セーブしてメニューに戻る", "load-game": "続きから始める", "load-btn": "ロード", "theme-default": "デフォルト", "theme-retro": "レトロ", "theme-light": "ライト", "theme-dark": "ダーク", "online-settings": "部屋設定", "online-target-wins": "目標勝利数", "online-party-mode": "パーティーモード", "online-party-count": "プレイ人数 (2-4)", "online-create-btn": "作成", "tmpl-cancel": "キャンセル", "key-pause": "ポーズ / キャンセル", "key-retry": "リトライ", "pause-title": "ポーズ中", "pause-msg": "ポーズボタンで再開。リトライボタンでやり直し。", "scale-label": "画面サイズ", "btn-screen-scale": "画面の大きさを変える" }
        };

        Object.assign(TRANSLATIONS.en, {
            "menu-replay": "VIEW REPLAYS",
            "menu-tutorial": "TUTORIAL",
            "label-config": "CONFIG DATA",
            "config-export": "EXPORT JSON",
            "config-import": "IMPORT JSON",
            "allspin-label": "ALL-SPIN DISPLAY",
            "replay-speed": "SPEED",
            "replay-back10": "-10S",
            "replay-forward10": "+10S",
            "replay-prev-frame": "-1F",
            "replay-next-frame": "+1F",
            "replay-exit": "EXIT",
            "replay-play": "PLAY",
            "replay-pause": "PAUSE"
        });
        Object.assign(TRANSLATIONS.ja, {
            "label-config": "設定データ",
            "config-export": "JSONを書き出す",
            "config-import": "JSONを読み込む",
            "allspin-label": "全ミノSPIN表示",
            "replay-speed": "速度",
            "replay-back10": "-10秒",
            "replay-forward10": "+10秒",
            "replay-prev-frame": "-1F",
            "replay-next-frame": "+1F",
            "replay-exit": "終了",
            "replay-play": "再生",
            "replay-pause": "一時停止"
        });
        TRANSLATIONS.ko = {
            ...TRANSLATIONS.en,
            settings: "설정",
            "tab-general": "일반",
            "tab-ui": "UI 설정",
            "tab-handling": "조작",
            "tab-keys": "키 설정",
            "tab-play": "플레이 설정",
            "label-lang": "언어",
            "label-name": "플레이어 이름",
            "label-level": "CPU 레벨",
            "menu-solo": "솔로 플레이",
            "menu-cpu": "CPU 대전",
            "menu-online": "온라인 플레이",
            "menu-template": "템플릿 모드",
            "menu-replay": "리플레이 보기",
            "menu-tutorial": "튜토리얼",
            "label-config": "설정 데이터",
            "config-export": "JSON 내보내기",
            "config-import": "JSON 가져오기",
            "allspin-label": "올스핀 표시",
            "replay-speed": "속도",
            "replay-exit": "닫기",
            "replay-play": "재생",
            "replay-pause": "일시정지",
            victory: "승리",
            defeat: "패배",
            gameover: "게임 오버"
        };
        TRANSLATIONS.zh = {
            ...TRANSLATIONS.en,
            settings: "设置",
            "tab-general": "常规",
            "tab-ui": "界面设置",
            "tab-handling": "操作",
            "tab-keys": "按键",
            "tab-play": "游戏设置",
            "label-lang": "语言",
            "label-name": "玩家名称",
            "label-level": "CPU 等级",
            "menu-solo": "单人游戏",
            "menu-cpu": "对战 CPU",
            "menu-online": "在线对战",
            "menu-template": "模板模式",
            "menu-replay": "查看回放",
            "menu-tutorial": "教程",
            "label-config": "配置数据",
            "config-export": "导出 JSON",
            "config-import": "导入 JSON",
            "allspin-label": "显示全旋转",
            "replay-speed": "速度",
            "replay-exit": "退出",
            "replay-play": "播放",
            "replay-pause": "暂停",
            victory: "胜利",
            defeat: "失败",
            gameover: "游戏结束"
        };
        TRANSLATIONS.es = {
            ...TRANSLATIONS.en,
            settings: "AJUSTES",
            "tab-general": "GENERAL",
            "tab-ui": "INTERFAZ",
            "tab-handling": "CONTROL",
            "tab-keys": "TECLAS",
            "tab-play": "JUEGO",
            "label-lang": "IDIOMA",
            "label-name": "NOMBRE",
            "menu-solo": "JUEGO SOLO",
            "menu-cpu": "VS CPU",
            "menu-online": "JUEGO EN LÍNEA",
            "menu-template": "MODO PLANTILLA",
            "menu-replay": "VER REPETICIONES",
            "menu-tutorial": "TUTORIAL",
            "label-config": "DATOS DE CONFIG",
            "config-export": "EXPORTAR JSON",
            "config-import": "IMPORTAR JSON",
            "replay-speed": "VELOCIDAD",
            "replay-exit": "SALIR",
            "replay-play": "REPRODUCIR",
            "replay-pause": "PAUSAR",
            victory: "VICTORIA",
            defeat: "DERROTA",
            gameover: "FIN DEL JUEGO"
        };
        TRANSLATIONS.fr = {
            ...TRANSLATIONS.en,
            settings: "PARAMÈTRES",
            "tab-general": "GÉNÉRAL",
            "tab-ui": "INTERFACE",
            "tab-handling": "COMMANDES",
            "tab-keys": "TOUCHES",
            "tab-play": "JEU",
            "label-lang": "LANGUE",
            "label-name": "NOM DU JOUEUR",
            "menu-solo": "SOLO",
            "menu-cpu": "VS CPU",
            "menu-online": "EN LIGNE",
            "menu-template": "MODE MODÈLE",
            "menu-replay": "VOIR LES REPLAYS",
            "menu-tutorial": "TUTORIEL",
            "label-config": "DONNÉES CONFIG",
            "config-export": "EXPORTER JSON",
            "config-import": "IMPORTER JSON",
            "replay-speed": "VITESSE",
            "replay-exit": "QUITTER",
            "replay-play": "LIRE",
            "replay-pause": "PAUSE",
            victory: "VICTOIRE",
            defeat: "DÉFAITE",
            gameover: "PARTIE TERMINÉE"
        };

        Object.assign(TRANSLATIONS.en, {
            "fullscreen-title": "Fullscreen",
            "common-back": "BACK",
            "common-send": "SEND",
            "welcome-msg": "Welcome!",
            "enter-name-msg": "Please enter your player name before starting the tutorial.",
            "tutorial-start": "START TUTORIAL",
            "pause-resume": "RESUME",
            "pause-retry": "RETRY",
            "label-deadzone": "GAMEPAD DEADZONE",
            "key-preset": "KEY PRESET",
            "pad-preset": "PAD PRESET",
            "pause-return-menu": "RETURN TO MENU",
            "match-summary-title": "MATCH SUMMARY",
            "match-summary-replay": "WATCH REPLAY",
            "match-summary-close": "CLOSE",
            "match-summary-rematch": "REMATCH",
            "match-summary-request-rematch": "REQUEST REMATCH",
            "summary-graph": "GRAPH",
            "summary-graph-note": "Shows PPS / APM / LPM progression over time.",
            "summary-detail": "DETAIL",
            "summary-time": "TIME",
            "summary-lines": "LINES",
            "summary-attack": "ATTACK",
            "summary-tspin": "T-SPIN",
            "summary-max-ren": "MAX REN",
            "summary-recv": "RECV",
            "summary-rule": "RULE",
            "summary-replay-code": "REPLAY",
            "summary-rating": "RATING",
            "menu-profile": "VIEW MY PROFILE",
            "solo-menu-title": "SOLO MODE",
            "online-disband": "DISBAND ROOM",
            "online-leave-room": "LEAVE ROOM",
            "lobby-chat-title": "ROOM CHAT",
            "lobby-chat-placeholder": "Message",
            "replay-library-title": "REPLAY LIBRARY",
            "replay-open-code-title": "OPEN BY CODE",
            "replay-code-label": "REPLAY CODE",
            "replay-code-placeholder": "HappyTetris6378",
            "replay-open-btn": "VIEW REPLAY",
            "replay-archive-note": "Browse saved replays from the last 30 days.",
            "replay-filters-title": "FILTERS",
            "replay-filter-mode-label": "MODE",
            "replay-filter-mode-all": "ALL",
            "replay-mode-party": "PARTY MATCH",
            "replay-filter-date-label": "DATE",
            "replay-filter-opponent-label": "OPPONENT",
            "replay-filter-opponent-placeholder": "Name",
            "replay-filter-reset": "RESET",
            "replay-archive-title": "ARCHIVE",
            "replay-empty": "No replays from the last 30 days yet.",
            "replay-no-match": "No replays match the current filters.",
            "replay-source-local": "LOCAL",
            "replay-source-shared": "SHARED",
            "replay-owner": "PLAYER",
            "replay-opponents": "OPPONENTS",
            "replay-stats": "PPS / APM / LPM",
            "replay-time-rating": "TIME / RATING",
            "replay-card-watch": "WATCH",
            "replay-card-use-code": "USE CODE",
            "profile-menu-title": "MY PROFILE",
            "profile-menu-subtitle": "Edit your public card and check your local rate summary here.",
            "profile-preview-section": "PROFILE OVERVIEW",
            "profile-edit-section": "EDIT PROFILE",
            "profile-name-label": "PLAYER NAME",
            "profile-name-note": "This name is linked to the setting you already use in the game.",
            "profile-open-settings": "OPEN SETTINGS",
            "profile-title-label": "PROFILE TITLE",
            "profile-title-placeholder": "Stack Lover",
            "profile-favorite-mode-label": "FAVORITE MODE",
            "profile-bio-label": "PROFILE DESCRIPTION",
            "profile-bio-placeholder": "Write a short profile...",
            "profile-youtube-label": "YOUTUBE LINK",
            "profile-youtube-placeholder": "https://youtube.com/@yourchannel",
            "profile-custom-links-label": "CUSTOM LINKS",
            "profile-link-name-placeholder": "Link name",
            "profile-link-url-placeholder": "https://example.com",
            "profile-save": "SAVE PROFILE",
            "profile-refresh-preview": "REFRESH PREVIEW",
            "profile-link-empty": "No public links have been added yet.",
            "profile-no-title": "No title yet",
            "profile-rate-label": "RATE",
            "profile-rate-sub": "Current local rate",
            "profile-peak-label": "PEAK RATE",
            "profile-peak-sub": "Best local rate",
            "profile-season-label": "SEASON",
            "profile-season-sub": "Current season best",
            "profile-total-label": "TOTAL RECORD",
            "profile-total-sub": "Local versus record",
            "profile-link-youtube": "YouTube",
            "profile-link-custom": "Custom Link",
            "profile-show-details": "OPEN PROFILE",
            "profile-hide-details": "HIDE PROFILE",
            "profile-waiting": "Waiting for a player...",
            "profile-mode-solo": "SOLO PLAY",
            "profile-mode-cpu": "VS CPU",
            "profile-mode-online": "ONLINE PLAY",
            "profile-mode-template": "TEMPLATE MODE",
            "profile-mode-replay": "REPLAYS",
            "profile-mode-ranking": "RANKING MODE"
        });
        Object.assign(TRANSLATIONS.ja, {
            "fullscreen-title": "フルスクリーン",
            "common-back": "戻る",
            "common-send": "送信",
            "welcome-msg": "ようこそ",
            "enter-name-msg": "チュートリアルを始める前にプレイヤー名を入力してください。",
            "tutorial-start": "チュートリアル開始",
            "pause-resume": "続ける",
            "pause-retry": "リトライ",
            "label-deadzone": "ゲームパッドのデッドゾーン",
            "key-preset": "キープリセット",
            "pad-preset": "パッドプリセット",
            "pause-return-menu": "メニューに戻る",
            "match-summary-title": "試合結果",
            "match-summary-replay": "リプレイを見る",
            "match-summary-close": "閉じる",
            "match-summary-rematch": "再戦",
            "match-summary-request-rematch": "再戦申請",
            "summary-graph": "推移",
            "summary-graph-note": "PPS / APM / LPM の時間推移を表示します。",
            "summary-detail": "詳細",
            "summary-time": "時間",
            "summary-lines": "ライン",
            "summary-attack": "攻撃",
            "summary-tspin": "T-SPIN",
            "summary-max-ren": "最大REN",
            "summary-recv": "被弾",
            "summary-rule": "ルール",
            "summary-replay-code": "リプレイコード",
            "summary-rating": "レート",
            "menu-profile": "自分のプロフィールを見る",
            "solo-menu-title": "ソロモード",
            "online-disband": "部屋を解散",
            "online-leave-room": "部屋を退出",
            "lobby-chat-title": "ルームチャット",
            "lobby-chat-placeholder": "メッセージ",
            "replay-library-title": "リプレイライブラリ",
            "replay-open-code-title": "コードで開く",
            "replay-code-label": "リプレイコード",
            "replay-code-placeholder": "HappyTetris6378",
            "replay-open-btn": "リプレイを見る",
            "replay-archive-note": "直近30日間の保存済みリプレイを表示します。",
            "replay-filters-title": "絞り込み",
            "replay-filter-mode-label": "モード",
            "replay-filter-mode-all": "すべて",
            "replay-mode-party": "パーティー対戦",
            "replay-filter-date-label": "日付",
            "replay-filter-opponent-label": "対戦相手",
            "replay-filter-opponent-placeholder": "名前",
            "replay-filter-reset": "解除",
            "replay-archive-title": "アーカイブ",
            "replay-empty": "直近30日間のリプレイはまだありません。",
            "replay-no-match": "条件に一致するリプレイはありません。",
            "replay-source-local": "保存済み",
            "replay-source-shared": "共有",
            "replay-owner": "プレイヤー",
            "replay-opponents": "対戦相手",
            "replay-stats": "PPS / APM / LPM",
            "replay-time-rating": "時間 / レート",
            "replay-card-watch": "再生",
            "replay-card-use-code": "コード入力",
            "profile-menu-title": "自分のプロフィール",
            "profile-menu-subtitle": "公開プロフィールカードの編集とローカル成績の確認ができます。",
            "profile-preview-section": "プロフィール概要",
            "profile-edit-section": "プロフィール編集",
            "profile-name-label": "プレイヤー名",
            "profile-name-note": "この名前は、ゲーム内で使っている設定名と連動しています。",
            "profile-open-settings": "設定を開く",
            "profile-title-label": "プロフィールタイトル",
            "profile-title-placeholder": "積み好きプレイヤー",
            "profile-favorite-mode-label": "好きなモード",
            "profile-bio-label": "プロフィール説明",
            "profile-bio-placeholder": "ひとことプロフィールを書いてください。",
            "profile-youtube-label": "YouTubeリンク",
            "profile-youtube-placeholder": "https://youtube.com/@yourchannel",
            "profile-custom-links-label": "カスタムリンク",
            "profile-link-name-placeholder": "リンク名",
            "profile-link-url-placeholder": "https://example.com",
            "profile-save": "プロフィールを保存",
            "profile-refresh-preview": "プレビューを更新",
            "profile-link-empty": "公開リンクはまだ追加されていません。",
            "profile-no-title": "タイトル未設定",
            "profile-rate-label": "レート",
            "profile-rate-sub": "現在のローカルレート",
            "profile-peak-label": "最高レート",
            "profile-peak-sub": "ローカル最高値",
            "profile-season-label": "シーズン",
            "profile-season-sub": "今シーズンの最高値",
            "profile-total-label": "通算成績",
            "profile-total-sub": "ローカル対戦成績",
            "profile-link-youtube": "YouTube",
            "profile-link-custom": "カスタムリンク",
            "profile-show-details": "プロフィールを見る",
            "profile-hide-details": "閉じる",
            "profile-waiting": "プレイヤーを待っています...",
            "profile-mode-solo": "一人でプレイ",
            "profile-mode-cpu": "CPU対戦",
            "profile-mode-online": "対人戦",
            "profile-mode-template": "テンプレートモード",
            "profile-mode-replay": "リプレイ",
            "profile-mode-ranking": "ランキングモード"
        });
        Object.assign(TRANSLATIONS.ko, {
            "fullscreen-title": "전체 화면",
            "common-back": "뒤로",
            "common-send": "보내기",
            "welcome-msg": "환영합니다!",
            "enter-name-msg": "튜토리얼을 시작하기 전에 플레이어 이름을 입력해 주세요.",
            "tutorial-start": "튜토리얼 시작",
            "pause-resume": "계속하기",
            "pause-retry": "다시 시작",
            "label-deadzone": "게임패드 데드존",
            "key-preset": "키 프리셋",
            "pad-preset": "패드 프리셋",
            "pause-return-menu": "메뉴로 돌아가기",
            "match-summary-title": "경기 결과",
            "match-summary-replay": "리플레이 보기",
            "match-summary-close": "닫기",
            "match-summary-rematch": "재대결",
            "match-summary-request-rematch": "재대결 요청",
            "summary-graph": "그래프",
            "summary-graph-note": "시간에 따른 PPS / APM / LPM 변화를 표시합니다.",
            "summary-detail": "상세",
            "summary-time": "시간",
            "summary-lines": "라인",
            "summary-attack": "공격",
            "summary-tspin": "T-SPIN",
            "summary-max-ren": "최대 REN",
            "summary-recv": "피격",
            "summary-rule": "규칙",
            "summary-replay-code": "리플레이 코드",
            "summary-rating": "레이팅",
            "menu-profile": "내 프로필 보기",
            "solo-menu-title": "솔로 모드",
            "online-disband": "방 해산",
            "online-leave-room": "방 나가기",
            "lobby-chat-title": "방 채팅",
            "lobby-chat-placeholder": "메시지",
            "replay-library-title": "리플레이 라이브러리",
            "replay-open-code-title": "코드로 열기",
            "replay-code-label": "리플레이 코드",
            "replay-open-btn": "리플레이 보기",
            "replay-archive-note": "최근 30일간 저장된 리플레이를 표시합니다.",
            "replay-filters-title": "필터",
            "replay-filter-mode-label": "모드",
            "replay-filter-mode-all": "전체",
            "replay-mode-party": "파티 매치",
            "replay-filter-date-label": "날짜",
            "replay-filter-opponent-label": "상대 이름",
            "replay-filter-opponent-placeholder": "이름",
            "replay-filter-reset": "초기화",
            "replay-archive-title": "보관함",
            "replay-empty": "최근 30일간의 리플레이가 없습니다.",
            "replay-no-match": "현재 조건에 맞는 리플레이가 없습니다.",
            "replay-source-local": "로컬",
            "replay-source-shared": "공유",
            "replay-owner": "플레이어",
            "replay-opponents": "상대",
            "replay-time-rating": "시간 / 레이팅",
            "replay-card-watch": "재생",
            "replay-card-use-code": "코드 입력",
            "profile-menu-title": "내 프로필",
            "profile-menu-subtitle": "공개 프로필 카드와 로컬 레이팅 정보를 확인하고 수정할 수 있습니다.",
            "profile-preview-section": "프로필 개요",
            "profile-edit-section": "프로필 편집",
            "profile-name-label": "플레이어 이름",
            "profile-name-note": "이 이름은 현재 게임 설정의 이름과 연결됩니다.",
            "profile-open-settings": "설정 열기",
            "profile-title-label": "프로필 타이틀",
            "profile-title-placeholder": "스택 애호가",
            "profile-favorite-mode-label": "좋아하는 모드",
            "profile-bio-label": "프로필 설명",
            "profile-bio-placeholder": "짧은 소개를 적어 주세요.",
            "profile-youtube-label": "YouTube 링크",
            "profile-youtube-placeholder": "https://youtube.com/@yourchannel",
            "profile-custom-links-label": "커스텀 링크",
            "profile-link-name-placeholder": "링크 이름",
            "profile-link-url-placeholder": "https://example.com",
            "profile-save": "프로필 저장",
            "profile-refresh-preview": "미리보기 새로고침",
            "profile-link-empty": "공개 링크가 아직 없습니다.",
            "profile-no-title": "아직 제목 없음",
            "profile-rate-label": "레이팅",
            "profile-rate-sub": "현재 로컬 레이팅",
            "profile-peak-label": "최고 레이팅",
            "profile-peak-sub": "로컬 최고치",
            "profile-season-label": "시즌",
            "profile-season-sub": "현재 시즌 최고치",
            "profile-total-label": "총 전적",
            "profile-total-sub": "로컬 대전 전적",
            "profile-link-youtube": "YouTube",
            "profile-link-custom": "커스텀 링크",
            "profile-show-details": "프로필 열기",
            "profile-hide-details": "닫기",
            "profile-waiting": "플레이어를 기다리는 중...",
            "profile-mode-solo": "솔로 플레이",
            "profile-mode-cpu": "CPU 대전",
            "profile-mode-online": "온라인 플레이",
            "profile-mode-template": "템플릿 모드",
            "profile-mode-replay": "리플레이",
            "profile-mode-ranking": "랭킹 모드"
        });
        Object.assign(TRANSLATIONS.zh, {
            "fullscreen-title": "全屏",
            "common-back": "返回",
            "common-send": "发送",
            "welcome-msg": "欢迎！",
            "enter-name-msg": "开始教程之前，请先输入玩家名称。",
            "tutorial-start": "开始教程",
            "pause-resume": "继续",
            "pause-retry": "重试",
            "label-deadzone": "手柄死区",
            "key-preset": "按键预设",
            "pad-preset": "手柄预设",
            "pause-return-menu": "返回菜单",
            "match-summary-title": "比赛结果",
            "match-summary-replay": "观看回放",
            "match-summary-close": "关闭",
            "match-summary-rematch": "再战",
            "match-summary-request-rematch": "请求再战",
            "summary-graph": "图表",
            "summary-graph-note": "显示 PPS / APM / LPM 的时间变化。",
            "summary-detail": "详情",
            "summary-time": "时间",
            "summary-lines": "行数",
            "summary-attack": "攻击",
            "summary-tspin": "T-SPIN",
            "summary-max-ren": "最大 REN",
            "summary-recv": "承伤",
            "summary-rule": "规则",
            "summary-replay-code": "回放代码",
            "summary-rating": "评分",
            "menu-profile": "查看我的资料",
            "solo-menu-title": "单人模式",
            "online-disband": "解散房间",
            "online-leave-room": "离开房间",
            "lobby-chat-title": "房间聊天",
            "lobby-chat-placeholder": "消息",
            "replay-library-title": "回放库",
            "replay-open-code-title": "通过代码打开",
            "replay-code-label": "回放代码",
            "replay-open-btn": "查看回放",
            "replay-archive-note": "显示最近 30 天保存的回放。",
            "replay-filters-title": "筛选",
            "replay-filter-mode-label": "模式",
            "replay-filter-mode-all": "全部",
            "replay-mode-party": "派对对战",
            "replay-filter-date-label": "日期",
            "replay-filter-opponent-label": "对手名称",
            "replay-filter-opponent-placeholder": "名称",
            "replay-filter-reset": "重置",
            "replay-archive-title": "存档",
            "replay-empty": "最近 30 天还没有回放。",
            "replay-no-match": "没有符合当前条件的回放。",
            "replay-source-local": "本地",
            "replay-source-shared": "共享",
            "replay-owner": "玩家",
            "replay-opponents": "对手",
            "replay-time-rating": "时间 / 评分",
            "replay-card-watch": "播放",
            "replay-card-use-code": "输入代码",
            "profile-menu-title": "我的资料",
            "profile-menu-subtitle": "可在此编辑公开资料卡并查看本地评分记录。",
            "profile-preview-section": "资料概览",
            "profile-edit-section": "编辑资料",
            "profile-name-label": "玩家名称",
            "profile-name-note": "这个名字会与游戏设置中的名称保持同步。",
            "profile-open-settings": "打开设置",
            "profile-title-label": "资料标题",
            "profile-title-placeholder": "堆叠爱好者",
            "profile-favorite-mode-label": "喜欢的模式",
            "profile-bio-label": "资料说明",
            "profile-bio-placeholder": "写一段简短介绍。",
            "profile-youtube-label": "YouTube 链接",
            "profile-youtube-placeholder": "https://youtube.com/@yourchannel",
            "profile-custom-links-label": "自定义链接",
            "profile-link-name-placeholder": "链接名称",
            "profile-link-url-placeholder": "https://example.com",
            "profile-save": "保存资料",
            "profile-refresh-preview": "刷新预览",
            "profile-link-empty": "还没有公开链接。",
            "profile-no-title": "尚未设置标题",
            "profile-rate-label": "评分",
            "profile-rate-sub": "当前本地评分",
            "profile-peak-label": "最高评分",
            "profile-peak-sub": "本地最高值",
            "profile-season-label": "赛季",
            "profile-season-sub": "当前赛季最高值",
            "profile-total-label": "总战绩",
            "profile-total-sub": "本地对战记录",
            "profile-link-youtube": "YouTube",
            "profile-link-custom": "自定义链接",
            "profile-show-details": "打开资料",
            "profile-hide-details": "关闭",
            "profile-waiting": "正在等待玩家...",
            "profile-mode-solo": "单人游戏",
            "profile-mode-cpu": "对战 CPU",
            "profile-mode-online": "在线对战",
            "profile-mode-template": "模板模式",
            "profile-mode-replay": "回放",
            "profile-mode-ranking": "排行模式"
        });
        Object.assign(TRANSLATIONS.es, {
            "fullscreen-title": "Pantalla completa",
            "common-back": "VOLVER",
            "common-send": "ENVIAR",
            "welcome-msg": "¡Bienvenido!",
            "enter-name-msg": "Introduce tu nombre de jugador antes de empezar el tutorial.",
            "tutorial-start": "INICIAR TUTORIAL",
            "pause-resume": "CONTINUAR",
            "pause-retry": "REINTENTAR",
            "label-deadzone": "ZONA MUERTA DEL MANDO",
            "key-preset": "PREAJUSTE DE TECLAS",
            "pad-preset": "PREAJUSTE DE MANDO",
            "pause-return-menu": "VOLVER AL MENÚ",
            "match-summary-title": "RESUMEN DEL PARTIDO",
            "match-summary-replay": "VER REPETICIÓN",
            "match-summary-close": "CERRAR",
            "match-summary-rematch": "REVANCHA",
            "match-summary-request-rematch": "PEDIR REVANCHA",
            "summary-graph": "GRÁFICO",
            "summary-graph-note": "Muestra la evolución de PPS / APM / LPM con el tiempo.",
            "summary-detail": "DETALLE",
            "summary-time": "TIEMPO",
            "summary-lines": "LÍNEAS",
            "summary-attack": "ATAQUE",
            "summary-tspin": "T-SPIN",
            "summary-max-ren": "REN MÁX.",
            "summary-recv": "RECIBIDO",
            "summary-rule": "REGLA",
            "summary-replay-code": "CÓDIGO",
            "summary-rating": "RATING",
            "menu-profile": "VER MI PERFIL",
            "solo-menu-title": "MODO SOLO",
            "online-disband": "DISOLVER SALA",
            "online-leave-room": "SALIR DE LA SALA",
            "lobby-chat-title": "CHAT DE SALA",
            "lobby-chat-placeholder": "Mensaje",
            "replay-library-title": "BIBLIOTECA DE REPETICIONES",
            "replay-open-code-title": "ABRIR CON CÓDIGO",
            "replay-code-label": "CÓDIGO DE REPETICIÓN",
            "replay-open-btn": "VER REPETICIÓN",
            "replay-archive-note": "Muestra las repeticiones guardadas de los últimos 30 días.",
            "replay-filters-title": "FILTROS",
            "replay-filter-mode-label": "MODO",
            "replay-filter-mode-all": "TODOS",
            "replay-mode-party": "PARTIDA PARTY",
            "replay-filter-date-label": "FECHA",
            "replay-filter-opponent-label": "RIVAL",
            "replay-filter-opponent-placeholder": "Nombre",
            "replay-filter-reset": "REINICIAR",
            "replay-archive-title": "ARCHIVO",
            "replay-empty": "Todavía no hay repeticiones de los últimos 30 días.",
            "replay-no-match": "No hay repeticiones que coincidan con los filtros actuales.",
            "replay-source-local": "LOCAL",
            "replay-source-shared": "COMPARTIDO",
            "replay-owner": "JUGADOR",
            "replay-opponents": "RIVALES",
            "replay-time-rating": "TIEMPO / RATING",
            "replay-card-watch": "VER",
            "replay-card-use-code": "USAR CÓDIGO",
            "profile-menu-title": "MI PERFIL",
            "profile-menu-subtitle": "Edita tu tarjeta pública y consulta aquí tu resumen de rating local.",
            "profile-preview-section": "RESUMEN DEL PERFIL",
            "profile-edit-section": "EDITAR PERFIL",
            "profile-name-label": "NOMBRE DEL JUGADOR",
            "profile-name-note": "Este nombre está vinculado al ajuste de nombre que ya usas en el juego.",
            "profile-open-settings": "ABRIR AJUSTES",
            "profile-title-label": "TÍTULO DEL PERFIL",
            "profile-title-placeholder": "Amante del stack",
            "profile-favorite-mode-label": "MODO FAVORITO",
            "profile-bio-label": "DESCRIPCIÓN DEL PERFIL",
            "profile-bio-placeholder": "Escribe una breve presentación.",
            "profile-youtube-label": "ENLACE DE YOUTUBE",
            "profile-youtube-placeholder": "https://youtube.com/@yourchannel",
            "profile-custom-links-label": "ENLACES PERSONALIZADOS",
            "profile-link-name-placeholder": "Nombre del enlace",
            "profile-link-url-placeholder": "https://example.com",
            "profile-save": "GUARDAR PERFIL",
            "profile-refresh-preview": "ACTUALIZAR VISTA PREVIA",
            "profile-link-empty": "Todavía no hay enlaces públicos.",
            "profile-no-title": "Sin título todavía",
            "profile-rate-label": "RATING",
            "profile-rate-sub": "Rating local actual",
            "profile-peak-label": "RATING MÁXIMO",
            "profile-peak-sub": "Mejor rating local",
            "profile-season-label": "TEMPORADA",
            "profile-season-sub": "Mejor marca de la temporada",
            "profile-total-label": "RÉCORD TOTAL",
            "profile-total-sub": "Récord local versus",
            "profile-link-youtube": "YouTube",
            "profile-link-custom": "Enlace personalizado",
            "profile-show-details": "ABRIR PERFIL",
            "profile-hide-details": "OCULTAR PERFIL",
            "profile-waiting": "Esperando a un jugador...",
            "profile-mode-solo": "JUEGO SOLO",
            "profile-mode-cpu": "VS CPU",
            "profile-mode-online": "JUEGO EN LÍNEA",
            "profile-mode-template": "MODO PLANTILLA",
            "profile-mode-replay": "REPETICIONES",
            "profile-mode-ranking": "MODO RANKING"
        });
        Object.assign(TRANSLATIONS.fr, {
            "fullscreen-title": "Plein écran",
            "common-back": "RETOUR",
            "common-send": "ENVOYER",
            "welcome-msg": "Bienvenue !",
            "enter-name-msg": "Saisissez votre nom de joueur avant de commencer le tutoriel.",
            "tutorial-start": "DÉMARRER LE TUTORIEL",
            "pause-resume": "REPRENDRE",
            "pause-retry": "RECOMMENCER",
            "label-deadzone": "ZONE MORTE MANETTE",
            "key-preset": "PRÉRÉGLAGE CLAVIER",
            "pad-preset": "PRÉRÉGLAGE MANETTE",
            "pause-return-menu": "RETOUR AU MENU",
            "match-summary-title": "RÉSUMÉ DU MATCH",
            "match-summary-replay": "VOIR LE REPLAY",
            "match-summary-close": "FERMER",
            "match-summary-rematch": "REJOUER",
            "match-summary-request-rematch": "DEMANDER UNE REVANCHE",
            "summary-graph": "GRAPHE",
            "summary-graph-note": "Affiche l'évolution du PPS / APM / LPM au fil du temps.",
            "summary-detail": "DÉTAIL",
            "summary-time": "TEMPS",
            "summary-lines": "LIGNES",
            "summary-attack": "ATTAQUE",
            "summary-tspin": "T-SPIN",
            "summary-max-ren": "REN MAX",
            "summary-recv": "REÇU",
            "summary-rule": "RÈGLE",
            "summary-replay-code": "CODE",
            "summary-rating": "RATING",
            "menu-profile": "VOIR MON PROFIL",
            "solo-menu-title": "MODE SOLO",
            "online-disband": "DISSOUDRE LA SALLE",
            "online-leave-room": "QUITTER LA SALLE",
            "lobby-chat-title": "CHAT DE SALLE",
            "lobby-chat-placeholder": "Message",
            "replay-library-title": "BIBLIOTHÈQUE DE REPLAYS",
            "replay-open-code-title": "OUVRIR AVEC UN CODE",
            "replay-code-label": "CODE DE REPLAY",
            "replay-open-btn": "VOIR LE REPLAY",
            "replay-archive-note": "Affiche les replays enregistrés des 30 derniers jours.",
            "replay-filters-title": "FILTRES",
            "replay-filter-mode-label": "MODE",
            "replay-filter-mode-all": "TOUS",
            "replay-mode-party": "MATCH PARTY",
            "replay-filter-date-label": "DATE",
            "replay-filter-opponent-label": "ADVERSAIRE",
            "replay-filter-opponent-placeholder": "Nom",
            "replay-filter-reset": "RÉINITIALISER",
            "replay-archive-title": "ARCHIVE",
            "replay-empty": "Aucun replay enregistré sur les 30 derniers jours.",
            "replay-no-match": "Aucun replay ne correspond aux filtres actuels.",
            "replay-source-local": "LOCAL",
            "replay-source-shared": "PARTAGÉ",
            "replay-owner": "JOUEUR",
            "replay-opponents": "ADVERSAIRES",
            "replay-time-rating": "TEMPS / RATING",
            "replay-card-watch": "LIRE",
            "replay-card-use-code": "UTILISER LE CODE",
            "profile-menu-title": "MON PROFIL",
            "profile-menu-subtitle": "Modifiez votre carte publique et consultez ici votre résumé de rating local.",
            "profile-preview-section": "APERÇU DU PROFIL",
            "profile-edit-section": "MODIFIER LE PROFIL",
            "profile-name-label": "NOM DU JOUEUR",
            "profile-name-note": "Ce nom est lié au nom déjà utilisé dans les paramètres du jeu.",
            "profile-open-settings": "OUVRIR LES PARAMÈTRES",
            "profile-title-label": "TITRE DU PROFIL",
            "profile-title-placeholder": "Passionné de stack",
            "profile-favorite-mode-label": "MODE FAVORI",
            "profile-bio-label": "DESCRIPTION DU PROFIL",
            "profile-bio-placeholder": "Écrivez une courte présentation.",
            "profile-youtube-label": "LIEN YOUTUBE",
            "profile-youtube-placeholder": "https://youtube.com/@yourchannel",
            "profile-custom-links-label": "LIENS PERSONNALISÉS",
            "profile-link-name-placeholder": "Nom du lien",
            "profile-link-url-placeholder": "https://example.com",
            "profile-save": "ENREGISTRER LE PROFIL",
            "profile-refresh-preview": "ACTUALISER L'APERÇU",
            "profile-link-empty": "Aucun lien public n'a encore été ajouté.",
            "profile-no-title": "Pas encore de titre",
            "profile-rate-label": "RATING",
            "profile-rate-sub": "Rating local actuel",
            "profile-peak-label": "MEILLEUR RATING",
            "profile-peak-sub": "Meilleur rating local",
            "profile-season-label": "SAISON",
            "profile-season-sub": "Meilleure marque de la saison",
            "profile-total-label": "BILAN TOTAL",
            "profile-total-sub": "Bilan local versus",
            "profile-link-youtube": "YouTube",
            "profile-link-custom": "Lien personnalisé",
            "profile-show-details": "OUVRIR LE PROFIL",
            "profile-hide-details": "MASQUER LE PROFIL",
            "profile-waiting": "En attente d'un joueur...",
            "profile-mode-solo": "SOLO",
            "profile-mode-cpu": "VS CPU",
            "profile-mode-online": "EN LIGNE",
            "profile-mode-template": "MODE MODÈLE",
            "profile-mode-replay": "REPLAYS",
            "profile-mode-ranking": "MODE CLASSEMENT"
        });
        Object.assign(TRANSLATIONS.en, { "profile-self-chip": "YOU" });
        Object.assign(TRANSLATIONS.ja, { "profile-self-chip": "自分" });
        Object.assign(TRANSLATIONS.ko, { "profile-self-chip": "나" });
        Object.assign(TRANSLATIONS.zh, { "profile-self-chip": "自己" });
        Object.assign(TRANSLATIONS.es, { "profile-self-chip": "TÚ" });
        Object.assign(TRANSLATIONS.fr, { "profile-self-chip": "VOUS" });
        Object.assign(TRANSLATIONS.en, {
            "connection-quality-title": "CONNECTION QUALITY",
            "room-start-level": "START LEVEL",
            "room-garbage-multiplier": "GARBAGE x",
            "room-allow-hold": "HOLD",
            "party-rule-caption": "PARTY RULE: Choose one",
            "party-rule-shared-title": "SHARED BOARD",
            "party-rule-shared-desc": "Everyone controls the same board together.",
            "party-rule-giant-title": "GIANT BLOCKS",
            "party-rule-giant-desc": "Fight with 2x2 giant pieces on a normal board.",
            "party-rule-tall-title": "40-LINE BOARD",
            "party-rule-tall-desc": "Play on a tall 40-line board.",
            "party-rule-bomb-title": "BOMB MINO",
            "party-rule-bomb-desc": "Bomb pieces blast a 3x3 area.",
            "party-rule-skills-title": "SKILL PARTY",
            "party-rule-skills-desc": "Spend coins on speed, walls, and slowdown skills."
        });
        Object.assign(TRANSLATIONS.ja, {
            "connection-quality-title": "通信品質",
            "room-start-level": "開始レベル",
            "room-garbage-multiplier": "火力倍率",
            "room-allow-hold": "ホールド",
            "party-rule-caption": "パーティールールは1つだけ選択",
            "party-rule-shared-title": "盤面共有",
            "party-rule-shared-desc": "全員で同じ盤面を操作する共有モードです。",
            "party-rule-giant-title": "巨大ミノ",
            "party-rule-giant-desc": "通常盤面のまま 2x2 拡張ミノで戦います。",
            "party-rule-tall-title": "40ライン盤面",
            "party-rule-tall-desc": "縦に長い40ライン盤面で対戦します。",
            "party-rule-bomb-title": "爆弾ミノ",
            "party-rule-bomb-desc": "爆弾ミノを置くと周囲3x3を吹き飛ばします。",
            "party-rule-skills-title": "スキル制",
            "party-rule-skills-desc": "コインを貯めて加速、壁生成、スローを使えます。"
        });
        Object.assign(TRANSLATIONS.ko, {
            "connection-quality-title": "연결 품질",
            "room-start-level": "시작 레벨",
            "room-garbage-multiplier": "가비지 배율",
            "room-allow-hold": "홀드",
            "party-rule-caption": "파티 규칙은 하나만 선택",
            "party-rule-shared-title": "공유 보드",
            "party-rule-shared-desc": "모두가 같은 보드를 함께 조작합니다.",
            "party-rule-giant-title": "거대 미노",
            "party-rule-giant-desc": "일반 보드에서 2x2 거대 미노로 플레이합니다.",
            "party-rule-tall-title": "40라인 보드",
            "party-rule-tall-desc": "세로로 긴 40라인 보드에서 플레이합니다.",
            "party-rule-bomb-title": "폭탄 미노",
            "party-rule-bomb-desc": "폭탄 미노는 주변 3x3 영역을 폭파합니다.",
            "party-rule-skills-title": "스킬 파티",
            "party-rule-skills-desc": "코인을 모아 가속, 벽, 슬로우 스킬을 사용합니다."
        });
        Object.assign(TRANSLATIONS.zh, {
            "connection-quality-title": "连接质量",
            "room-start-level": "起始等级",
            "room-garbage-multiplier": "垃圾倍率",
            "room-allow-hold": "保留",
            "party-rule-caption": "派对规则只能选择一个",
            "party-rule-shared-title": "共享棋盘",
            "party-rule-shared-desc": "所有玩家共同操作同一个棋盘。",
            "party-rule-giant-title": "巨型方块",
            "party-rule-giant-desc": "在普通棋盘上使用 2x2 巨型方块。",
            "party-rule-tall-title": "40行棋盘",
            "party-rule-tall-desc": "在纵向更长的40行棋盘上对战。",
            "party-rule-bomb-title": "炸弹方块",
            "party-rule-bomb-desc": "炸弹方块会炸掉周围 3x3 区域。",
            "party-rule-skills-title": "技能派对",
            "party-rule-skills-desc": "积攒硬币使用加速、墙壁和减速技能。"
        });
        Object.assign(TRANSLATIONS.es, {
            "connection-quality-title": "CALIDAD DE CONEXIÓN",
            "room-start-level": "NIVEL INICIAL",
            "room-garbage-multiplier": "MULTIPLICADOR DE BASURA",
            "room-allow-hold": "HOLD",
            "party-rule-caption": "Elige una sola regla party",
            "party-rule-shared-title": "TABLERO COMPARTIDO",
            "party-rule-shared-desc": "Todos controlan el mismo tablero.",
            "party-rule-giant-title": "PIEZAS GIGANTES",
            "party-rule-giant-desc": "Juega con piezas 2x2 gigantes en un tablero normal.",
            "party-rule-tall-title": "TABLERO DE 40 LÍNEAS",
            "party-rule-tall-desc": "Juega en un tablero alto de 40 líneas.",
            "party-rule-bomb-title": "MINO BOMBA",
            "party-rule-bomb-desc": "Las piezas bomba destruyen un área de 3x3.",
            "party-rule-skills-title": "PARTY DE HABILIDADES",
            "party-rule-skills-desc": "Gasta monedas en velocidad, muros y ralentización."
        });
        Object.assign(TRANSLATIONS.fr, {
            "connection-quality-title": "QUALITÉ DE CONNEXION",
            "room-start-level": "NIVEAU DE DÉPART",
            "room-garbage-multiplier": "MULTIPLICATEUR DE DÉCHETS",
            "room-allow-hold": "HOLD",
            "party-rule-caption": "Choisissez une seule règle party",
            "party-rule-shared-title": "PLATEAU PARTAGÉ",
            "party-rule-shared-desc": "Tout le monde contrôle le même plateau.",
            "party-rule-giant-title": "BLOCS GÉANTS",
            "party-rule-giant-desc": "Affrontez-vous avec des pièces géantes 2x2.",
            "party-rule-tall-title": "PLATEAU 40 LIGNES",
            "party-rule-tall-desc": "Jouez sur un plateau plus haut de 40 lignes.",
            "party-rule-bomb-title": "MINO BOMBE",
            "party-rule-bomb-desc": "Les pièces bombe détruisent une zone de 3x3.",
            "party-rule-skills-title": "PARTY COMPÉTENCES",
            "party-rule-skills-desc": "Dépensez des pièces pour vitesse, murs et ralentissement."
        });
        Object.assign(TRANSLATIONS.en, {
            "common-yes": "YES",
            "common-no": "NO",
            "common-accept": "ACCEPT",
            "common-decline": "DECLINE",
            "common-refresh": "REFRESH",
            "common-close": "CLOSE",
            "qm-ready-label": "READY CHECK",
            "qm-ready-btn": "OK",
            "qm-ready-waiting-btn": "WAITING...",
            "qm-ready-found": "Match found. Say hi and press OK.",
            "qm-ready-waiting": "Your OK is locked in. Waiting for the opponent.",
            "qm-ready-opponent": "Opponent is ready. Press OK to start.",
            "qm-ready-both": "Both players are ready. Starting...",
            "countdown-ready": "GET READY",
            "countdown-go": "GO",
            "profile-friends-section": "FRIENDS",
            "profile-friend-request-label": "ADD FRIEND BY NAME",
            "profile-friend-request-placeholder": "Player name",
            "profile-friend-send": "SEND REQUEST",
            "profile-friends-incoming": "PENDING APPROVAL",
            "profile-friends-outgoing": "SENT REQUESTS",
            "profile-friends-list": "FRIEND LIST",
            "profile-friend-empty": "No friends yet.",
            "profile-friend-empty-incoming": "No pending friend approvals.",
            "profile-friend-empty-outgoing": "No outgoing requests.",
            "profile-friend-open": "VIEW PROFILE",
            "profile-friend-add": "ADD FRIEND",
            "profile-friend-accept": "ACCEPT FRIEND",
            "profile-friend-decline": "DECLINE",
            "profile-friend-sent": "REQUEST SENT",
            "profile-friend-approved": "FRIEND",
            "profile-friend-challenge": "CHALLENGE MATCH",
            "profile-friend-status-online": "ONLINE",
            "profile-friend-status-offline": "OFFLINE",
            "profile-friend-status-in_match": "IN MATCH",
            "profile-viewer-title": "PLAYER PROFILE",
            "profile-view-no-links": "No public links have been added.",
            "toast-friend-self": "You cannot add yourself as a friend.",
            "toast-friend-already": "{name} is already your friend.",
            "toast-friend-request-sent": "Friend request sent to {name}.",
            "toast-friend-request-failed": "Could not deliver a friend request to {name}.",
            "toast-friend-request-received": "{name} sent you a friend request.",
            "toast-friend-accepted": "{name} accepted your friend request.",
            "toast-friend-declined": "{name} declined the request.",
            "toast-friend-added": "{name} is now your friend.",
            "toast-challenge-busy-self": "Leave your current online room before sending a challenge.",
            "toast-challenge-sent": "Challenge sent to {name}.",
            "toast-challenge-accepted": "{name} accepted the challenge.",
            "toast-challenge-declined": "{name} declined the challenge.",
            "toast-challenge-failed": "Could not reach {name} for a challenge.",
            "toast-challenge-received": "{name} wants to battle with you.",
            "toast-challenge-joining": "Joining {name}'s challenge room...",
            "toast-challenge-room-ready": "Challenge room ready for {name}.",
            "toast-challenge-busy": "{name} is already busy right now."
        });
        Object.assign(TRANSLATIONS.ja, {
            "common-yes": "はい",
            "common-no": "いいえ",
            "common-accept": "承認",
            "common-decline": "辞退",
            "common-refresh": "更新",
            "common-close": "閉じる",
            "qm-ready-label": "OK 確認",
            "qm-ready-btn": "OK",
            "qm-ready-waiting-btn": "送信済み",
            "qm-ready-found": "相手が見つかりました。あいさつして OK を押してください。",
            "qm-ready-waiting": "あなたは OK 済みです。相手を待っています。",
            "qm-ready-opponent": "相手は OK 済みです。あなたも OK を押してください。",
            "qm-ready-both": "両者 OK。まもなく開始します。",
            "countdown-ready": "READY",
            "countdown-go": "GO",
            "profile-friends-section": "フレンド",
            "profile-friend-request-label": "名前でフレンド申請",
            "profile-friend-request-placeholder": "プレイヤー名",
            "profile-friend-send": "申請する",
            "profile-friends-incoming": "承認待ち",
            "profile-friends-outgoing": "送信済み申請",
            "profile-friends-list": "フレンド一覧",
            "profile-friend-empty": "まだフレンドがいません。",
            "profile-friend-empty-incoming": "承認待ちの申請はありません。",
            "profile-friend-empty-outgoing": "送信中の申請はありません。",
            "profile-friend-open": "プロフィールを見る",
            "profile-friend-add": "フレンド申請",
            "profile-friend-accept": "フレンド承認",
            "profile-friend-decline": "辞退",
            "profile-friend-sent": "申請送信済み",
            "profile-friend-approved": "フレンド",
            "profile-friend-challenge": "対戦を申し込む",
            "profile-friend-status-online": "オンライン",
            "profile-friend-status-offline": "オフライン",
            "profile-friend-status-in_match": "対戦中",
            "profile-viewer-title": "プロフィール",
            "profile-view-no-links": "公開リンクはまだありません。",
            "toast-friend-self": "自分自身にはフレンド申請できません。",
            "toast-friend-already": "{name} はすでにフレンドです。",
            "toast-friend-request-sent": "{name} にフレンド申請を送りました。",
            "toast-friend-request-failed": "{name} にフレンド申請を送れませんでした。",
            "toast-friend-request-received": "{name} からフレンド申請が届きました。",
            "toast-friend-accepted": "{name} がフレンド申請を承認しました。",
            "toast-friend-declined": "{name} は申請を辞退しました。",
            "toast-friend-added": "{name} とフレンドになりました。",
            "toast-challenge-busy-self": "今のオンライン部屋を抜けてから対戦申請してください。",
            "toast-challenge-sent": "{name} に対戦申請を送りました。",
            "toast-challenge-accepted": "{name} が対戦申請を受けました。",
            "toast-challenge-declined": "{name} は対戦申請を断りました。",
            "toast-challenge-failed": "{name} に対戦申請を送れませんでした。",
            "toast-challenge-received": "{name} から対戦申請が届きました。",
            "toast-challenge-joining": "{name} の対戦部屋に参加します...",
            "toast-challenge-room-ready": "{name} 用の対戦部屋を用意しました。",
            "toast-challenge-busy": "{name} は今取り込み中です。"
        });
        Object.assign(TRANSLATIONS.ko, {
            "common-yes": "예",
            "common-no": "아니오",
            "common-accept": "수락",
            "common-decline": "거절",
            "common-refresh": "새로고침",
            "common-close": "닫기",
            "qm-ready-label": "준비 확인",
            "qm-ready-btn": "OK",
            "qm-ready-waiting-btn": "대기 중",
            "qm-ready-found": "상대를 찾았습니다. 인사하고 OK를 눌러 주세요.",
            "qm-ready-waiting": "내 OK가 완료되었습니다. 상대를 기다리는 중입니다.",
            "qm-ready-opponent": "상대가 준비되었습니다. OK를 눌러 시작하세요.",
            "qm-ready-both": "양쪽 모두 준비 완료. 곧 시작합니다.",
            "countdown-ready": "READY",
            "countdown-go": "GO",
            "profile-friends-section": "친구",
            "profile-friend-request-label": "이름으로 친구 신청",
            "profile-friend-request-placeholder": "플레이어 이름",
            "profile-friend-send": "신청 보내기",
            "profile-friends-incoming": "승인 대기",
            "profile-friends-outgoing": "보낸 요청",
            "profile-friends-list": "친구 목록",
            "profile-friend-empty": "아직 친구가 없습니다.",
            "profile-friend-empty-incoming": "승인할 요청이 없습니다.",
            "profile-friend-empty-outgoing": "보낸 요청이 없습니다.",
            "profile-friend-open": "프로필 보기",
            "profile-friend-add": "친구 신청",
            "profile-friend-accept": "친구 수락",
            "profile-friend-decline": "거절",
            "profile-friend-sent": "요청 전송됨",
            "profile-friend-approved": "친구",
            "profile-friend-challenge": "대전 신청",
            "profile-friend-status-online": "온라인",
            "profile-friend-status-offline": "오프라인",
            "profile-friend-status-in_match": "대전 중",
            "profile-viewer-title": "플레이어 프로필",
            "profile-view-no-links": "공개 링크가 없습니다.",
            "toast-friend-self": "자기 자신에게는 친구 신청을 보낼 수 없습니다.",
            "toast-friend-already": "{name} 님은 이미 친구입니다.",
            "toast-friend-request-sent": "{name} 님에게 친구 신청을 보냈습니다.",
            "toast-friend-request-failed": "{name} 님에게 친구 신청을 보낼 수 없습니다.",
            "toast-friend-request-received": "{name} 님이 친구 신청을 보냈습니다.",
            "toast-friend-accepted": "{name} 님이 친구 신청을 수락했습니다.",
            "toast-friend-declined": "{name} 님이 친구 신청을 거절했습니다.",
            "toast-friend-added": "{name} 님과 친구가 되었습니다.",
            "toast-challenge-busy-self": "현재 온라인 방에서 나간 뒤 대전 신청을 보내 주세요.",
            "toast-challenge-sent": "{name} 님에게 대전 신청을 보냈습니다.",
            "toast-challenge-accepted": "{name} 님이 대전 신청을 수락했습니다.",
            "toast-challenge-declined": "{name} 님이 대전 신청을 거절했습니다.",
            "toast-challenge-failed": "{name} 님에게 대전 신청을 보낼 수 없습니다.",
            "toast-challenge-received": "{name} 님이 대전을 신청했습니다.",
            "toast-challenge-joining": "{name} 님의 대전 방에 참가합니다...",
            "toast-challenge-room-ready": "{name} 님을 위한 대전 방이 준비되었습니다.",
            "toast-challenge-busy": "{name} 님은 지금 바쁩니다."
        });
        Object.assign(TRANSLATIONS.zh, {
            "common-yes": "是",
            "common-no": "否",
            "common-accept": "接受",
            "common-decline": "拒绝",
            "common-refresh": "刷新",
            "common-close": "关闭",
            "qm-ready-label": "开始确认",
            "qm-ready-btn": "OK",
            "qm-ready-waiting-btn": "等待中",
            "qm-ready-found": "已找到对手。先打个招呼，然后按 OK。",
            "qm-ready-waiting": "你已按下 OK，正在等待对手。",
            "qm-ready-opponent": "对手已准备，请按 OK 开始。",
            "qm-ready-both": "双方都已准备，即将开始。",
            "countdown-ready": "READY",
            "countdown-go": "GO",
            "profile-friends-section": "好友",
            "profile-friend-request-label": "按名字添加好友",
            "profile-friend-request-placeholder": "玩家名",
            "profile-friend-send": "发送申请",
            "profile-friends-incoming": "待确认",
            "profile-friends-outgoing": "已发送申请",
            "profile-friends-list": "好友列表",
            "profile-friend-empty": "还没有好友。",
            "profile-friend-empty-incoming": "没有待处理的好友申请。",
            "profile-friend-empty-outgoing": "没有已发送的申请。",
            "profile-friend-open": "查看资料",
            "profile-friend-add": "加好友",
            "profile-friend-accept": "接受好友",
            "profile-friend-decline": "拒绝",
            "profile-friend-sent": "已发送",
            "profile-friend-approved": "好友",
            "profile-friend-challenge": "发起对战",
            "profile-friend-status-online": "在线",
            "profile-friend-status-offline": "离线",
            "profile-friend-status-in_match": "对战中",
            "profile-viewer-title": "玩家资料",
            "profile-view-no-links": "还没有公开链接。",
            "toast-friend-self": "不能给自己发送好友申请。",
            "toast-friend-already": "{name} 已经是你的好友。",
            "toast-friend-request-sent": "已向 {name} 发送好友申请。",
            "toast-friend-request-failed": "无法向 {name} 发送好友申请。",
            "toast-friend-request-received": "{name} 向你发送了好友申请。",
            "toast-friend-accepted": "{name} 接受了你的好友申请。",
            "toast-friend-declined": "{name} 拒绝了好友申请。",
            "toast-friend-added": "{name} 现在是你的好友。",
            "toast-challenge-busy-self": "请先离开当前在线房间，再发送对战申请。",
            "toast-challenge-sent": "已向 {name} 发送对战申请。",
            "toast-challenge-accepted": "{name} 接受了对战申请。",
            "toast-challenge-declined": "{name} 拒绝了对战申请。",
            "toast-challenge-failed": "无法向 {name} 发起对战。",
            "toast-challenge-received": "{name} 想和你对战。",
            "toast-challenge-joining": "正在加入 {name} 的对战房间...",
            "toast-challenge-room-ready": "已为 {name} 准备好对战房间。",
            "toast-challenge-busy": "{name} 现在正忙。"
        });
        Object.assign(TRANSLATIONS.es, {
            "common-yes": "SÍ",
            "common-no": "NO",
            "common-accept": "ACEPTAR",
            "common-decline": "RECHAZAR",
            "common-refresh": "ACTUALIZAR",
            "common-close": "CERRAR",
            "qm-ready-label": "CONFIRMACIÓN",
            "qm-ready-btn": "OK",
            "qm-ready-waiting-btn": "ESPERA",
            "qm-ready-found": "Rival encontrado. Saluda y pulsa OK.",
            "qm-ready-waiting": "Tu OK ya está listo. Esperando al rival.",
            "qm-ready-opponent": "El rival está listo. Pulsa OK para empezar.",
            "qm-ready-both": "Ambos jugadores están listos. Iniciando...",
            "countdown-ready": "READY",
            "countdown-go": "GO",
            "profile-friends-section": "AMIGOS",
            "profile-friend-request-label": "AGREGAR POR NOMBRE",
            "profile-friend-request-placeholder": "Nombre del jugador",
            "profile-friend-send": "ENVIAR SOLICITUD",
            "profile-friends-incoming": "PENDIENTES",
            "profile-friends-outgoing": "SOLICITUDES ENVIADAS",
            "profile-friends-list": "LISTA DE AMIGOS",
            "profile-friend-empty": "Todavía no tienes amigos.",
            "profile-friend-empty-incoming": "No hay solicitudes pendientes.",
            "profile-friend-empty-outgoing": "No hay solicitudes enviadas.",
            "profile-friend-open": "VER PERFIL",
            "profile-friend-add": "AGREGAR",
            "profile-friend-accept": "ACEPTAR AMIGO",
            "profile-friend-decline": "RECHAZAR",
            "profile-friend-sent": "SOLICITUD ENVIADA",
            "profile-friend-approved": "AMIGO",
            "profile-friend-challenge": "RETAR",
            "profile-friend-status-online": "EN LÍNEA",
            "profile-friend-status-offline": "DESCONECTADO",
            "profile-friend-status-in_match": "EN PARTIDA",
            "profile-viewer-title": "PERFIL DEL JUGADOR",
            "profile-view-no-links": "No hay enlaces públicos todavía.",
            "toast-friend-self": "No puedes enviarte una solicitud a ti mismo.",
            "toast-friend-already": "{name} ya es tu amigo.",
            "toast-friend-request-sent": "Solicitud enviada a {name}.",
            "toast-friend-request-failed": "No se pudo enviar una solicitud a {name}.",
            "toast-friend-request-received": "{name} te envió una solicitud de amistad.",
            "toast-friend-accepted": "{name} aceptó tu solicitud.",
            "toast-friend-declined": "{name} rechazó la solicitud.",
            "toast-friend-added": "{name} ahora es tu amigo.",
            "toast-challenge-busy-self": "Sal de tu sala online actual antes de enviar un reto.",
            "toast-challenge-sent": "Reto enviado a {name}.",
            "toast-challenge-accepted": "{name} aceptó el reto.",
            "toast-challenge-declined": "{name} rechazó el reto.",
            "toast-challenge-failed": "No se pudo contactar a {name} para el reto.",
            "toast-challenge-received": "{name} quiere jugar contra ti.",
            "toast-challenge-joining": "Entrando a la sala de reto de {name}...",
            "toast-challenge-room-ready": "Sala de reto lista para {name}.",
            "toast-challenge-busy": "{name} está ocupado ahora mismo."
        });
        Object.assign(TRANSLATIONS.fr, {
            "common-yes": "OUI",
            "common-no": "NON",
            "common-accept": "ACCEPTER",
            "common-decline": "REFUSER",
            "common-refresh": "ACTUALISER",
            "common-close": "FERMER",
            "qm-ready-label": "CONFIRMATION",
            "qm-ready-btn": "OK",
            "qm-ready-waiting-btn": "ATTENTE",
            "qm-ready-found": "Adversaire trouvé. Saluez-le puis appuyez sur OK.",
            "qm-ready-waiting": "Votre OK est validé. En attente de l'adversaire.",
            "qm-ready-opponent": "L'adversaire est prêt. Appuyez sur OK pour commencer.",
            "qm-ready-both": "Les deux joueurs sont prêts. Démarrage...",
            "countdown-ready": "READY",
            "countdown-go": "GO",
            "profile-friends-section": "AMIS",
            "profile-friend-request-label": "AJOUTER PAR NOM",
            "profile-friend-request-placeholder": "Nom du joueur",
            "profile-friend-send": "ENVOYER",
            "profile-friends-incoming": "EN ATTENTE",
            "profile-friends-outgoing": "DEMANDES ENVOYÉES",
            "profile-friends-list": "LISTE D'AMIS",
            "profile-friend-empty": "Vous n'avez pas encore d'amis.",
            "profile-friend-empty-incoming": "Aucune demande en attente.",
            "profile-friend-empty-outgoing": "Aucune demande envoyée.",
            "profile-friend-open": "VOIR LE PROFIL",
            "profile-friend-add": "AJOUTER",
            "profile-friend-accept": "ACCEPTER L'AMI",
            "profile-friend-decline": "REFUSER",
            "profile-friend-sent": "DEMANDE ENVOYÉE",
            "profile-friend-approved": "AMI",
            "profile-friend-challenge": "DÉFIER",
            "profile-friend-status-online": "EN LIGNE",
            "profile-friend-status-offline": "HORS LIGNE",
            "profile-friend-status-in_match": "EN MATCH",
            "profile-viewer-title": "PROFIL DU JOUEUR",
            "profile-view-no-links": "Aucun lien public pour le moment.",
            "toast-friend-self": "Vous ne pouvez pas vous ajouter vous-même.",
            "toast-friend-already": "{name} est déjà votre ami.",
            "toast-friend-request-sent": "Demande d'ami envoyée à {name}.",
            "toast-friend-request-failed": "Impossible d'envoyer une demande à {name}.",
            "toast-friend-request-received": "{name} vous a envoyé une demande d'ami.",
            "toast-friend-accepted": "{name} a accepté votre demande d'ami.",
            "toast-friend-declined": "{name} a refusé la demande.",
            "toast-friend-added": "{name} est maintenant votre ami.",
            "toast-challenge-busy-self": "Quittez votre salle en ligne actuelle avant d'envoyer un défi.",
            "toast-challenge-sent": "Défi envoyé à {name}.",
            "toast-challenge-accepted": "{name} a accepté le défi.",
            "toast-challenge-declined": "{name} a refusé le défi.",
            "toast-challenge-failed": "Impossible de joindre {name} pour un défi.",
            "toast-challenge-received": "{name} veut vous affronter.",
            "toast-challenge-joining": "Connexion à la salle de défi de {name}...",
            "toast-challenge-room-ready": "Salle de défi prête pour {name}.",
            "toast-challenge-busy": "{name} est occupé en ce moment."
        });

        const THEMES = {
            'default': { accent: '#00f0f0', bg: '#050505', panel: 'rgba(20, 20, 20, 0.95)', text: '#ffffff', border: '#333333', star: '0, 240, 240', canvasBg: '#000000' },
            'retro': { accent: '#ff00ff', bg: '#1a001a', panel: 'rgba(51, 0, 51, 0.95)', text: '#ffffff', border: '#ff00ff', star: '255, 0, 255', canvasBg: '#2a002a' },
            'light': { accent: '#0088ff', bg: '#e0e0e0', panel: 'rgba(255, 255, 255, 0.95)', text: '#000000', border: '#cccccc', star: '0, 136, 255', canvasBg: '#f0f0f0' },
            'dark': { accent: '#ff4444', bg: '#000000', panel: 'rgba(5, 5, 5, 0.95)', text: '#dddddd', border: '#444444', star: '255, 68, 68', canvasBg: '#0a0a0a' }
        };

        const DEFAULT_ROOM_RULES = {
            garbageMultiplier: 1,
            startLevel: 1,
            allowHold: true,
            partyVariant: 'shared',
            sharedBoard: false,
            giantBlocks: false,
            tallBoard: false,
            bombMino: false,
            skillMode: false,
            riseMinoMode: false,
            chaosMode: false,
            survivalRush: false,
            sharedDeathMode: 'solo',
            allowSpectators: true,
            autoStartFull: false,
            countdownSeconds: 3.2
        };
        const PARTY_SKILLS = {
            speed: { cost: 4, label: 'OVERCLOCK JAM', duration: 8000 },
            wall: { cost: 5, label: 'WALL DROP', duration: 0 },
            slow: { cost: 3, label: 'FOCUS SLOW', duration: 6000 },
            clean: { cost: 4, label: 'TOP CLEAN', duration: 0 }
        };
        const KEY_PRESETS = {
            guideline: { left: 'ArrowLeft', right: 'ArrowRight', soft: 'ArrowDown', hard: ' ', rotR: 'ArrowUp', rotL: 'z', hold: 'c', hold2: 'Shift', pause: 'Escape', retry: 'r' },
            wasd: { left: 'a', right: 'd', soft: 's', hard: 'w', rotR: 'ArrowUp', rotL: 'Shift', hold: ' ', hold2: 'c', pause: 'Escape', retry: 'r' },
            classic: { left: 'ArrowLeft', right: 'ArrowRight', soft: 'ArrowDown', hard: 'Enter', rotR: 'x', rotL: 'z', hold: 'Shift', hold2: 'c', pause: 'Escape', retry: 'r' }
        };
        const PAD_PRESETS = {
            standard: { left: 14, right: 15, soft: 13, hard: 12, rotR: 0, rotL: 2, hold: 4, hold2: 5, pause: 9, retry: 8 },
            arcade: { left: 14, right: 15, soft: 13, hard: 1, rotR: 0, rotL: 2, hold: 3, hold2: 4, pause: 9, retry: 8 },
            southpaw: { left: 14, right: 15, soft: 13, hard: 12, rotR: 2, rotL: 0, hold: 5, hold2: 4, pause: 9, retry: 8 }
        };
        const PROFILE_STORAGE_KEY = 'tetrisProUltProfile_v1';
        const PROFILE_LINK_COUNT = 5;
        const PROFILE_FAVORITE_MODES = ['solo', 'cpu', 'online', 'template', 'replay', 'ranking'];
        const FRIENDS_STORAGE_KEY = 'tetrisProUltFriends_v1';
        const IDENTITY_PEER_PREFIX = 'TETRIS-ID-';
        const FRIEND_STATUS_VALUES = ['online', 'offline', 'in_match'];
        const ADMIN_RESTRICTION_STORAGE_KEY = 'tetrisProUltAdminRestriction_v1';
        const ADMIN_CONTROL_LOCK_STORAGE_KEY = 'tetrisProUltAdminControlLock_v1';
        const ADMIN_PANEL_SOURCE = 'tetris-admin-panel-v1';
        const ADMIN_GAME_SOURCE = 'tetris-admin-game-v1';
        const ADMIN_PIECE_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        const ADMIN_CHEAT_BOOLEAN_KEYS = [
            'invincible',
            'shield',
            'infiniteHold',
            'autoHoldReady',
            'garbageCleaner',
            'noGravity',
            'lockDelayFreeze',
            'autoClearBoard',
            'autoTetrisReady',
            'hardDropOnlyI',
            'alwaysB2B',
            'comboKeeper',
            'freezeCpu',
            'autoPerfectClearReady',
            'autoSkillCoins',
            'scoreBooster',
            'slowMotion',
            'topOutRescue'
        ];
        const ADMIN_CHEAT_SETTINGS_DEFAULTS = {
            invincibleRescueMode: 'center4',
            indicatorPosition: 'top-left',
            comboMinRen: 10,
            autoSkillCoinsAmount: 1,
            scoreBoostAmount: 1000,
            slowMotionFactor: 0.35
        };
        const ADMIN_PACKET_TYPES = new Set([
            'admin_ban',
            'admin_unban',
            'admin_lock_controls',
            'admin_unlock_controls',
            'admin_clear_board',
            'admin_clear_garbage',
            'admin_set_next_piece',
            'admin_set_current_piece',
            'admin_set_hold_piece',
            'admin_add_garbage',
            'admin_knockout',
            'admin_add_stat',
            'admin_set_stat',
            'admin_perfect_clear_ready',
            'admin_fill_board',
            'admin_random_board'
        ]);
        const SOLO_MODE_DEFS = {
            endless: {
                id: 'endless',
                lineTarget: null,
                storageMetric: 'score',
                maxEntries: 30,
                isEndless: true,
                label: { ja: 'エンドレス', en: 'ENDLESS' },
                desc: { ja: 'ライン数の制限なしで、ゲームオーバーまで続けます。', en: 'Play without a line limit until game over.' }
            },
            height40: {
                id: 'height40',
                lineTarget: null,
                storageMetric: 'score',
                maxEntries: 30,
                isEndless: true,
                ruleSet: { tallBoard: true },
                label: { ja: '40ライン盤面', en: '40 HEIGHT' },
                desc: { ja: '高さ40ラインの盤面で、ゲームオーバーまで続けます。', en: 'Play on a 40-line-high board until game over.' }
            },
            sprint40: {
                id: 'sprint40',
                lineTarget: 40,
                storageMetric: 'time',
                maxEntries: 20,
                label: { ja: '40ライン', en: '40 LINES' },
                desc: { ja: '40ラインを最速で消します。', en: 'Clear 40 lines as fast as possible.' }
            },
            sprint150: {
                id: 'sprint150',
                lineTarget: 150,
                storageMetric: 'time',
                maxEntries: 20,
                label: { ja: '150ライン', en: '150 LINES' },
                desc: { ja: '150ラインを走り切る長距離スプリントです。', en: 'Long-form sprint over 150 lines.' }
            },
            sprint999: {
                id: 'sprint999',
                lineTarget: 999,
                storageMetric: 'time',
                maxEntries: 20,
                label: { ja: '999ライン', en: '999 LINES' },
                desc: { ja: '999ラインを目指す耐久スプリントです。', en: 'Endurance sprint to 999 lines.' }
            },
            ranking: {
                id: 'ranking',
                lineTarget: null,
                storageMetric: 'score',
                maxEntries: 30,
                label: { ja: 'ランキングモード', en: 'RANKING MODE' },
                desc: { ja: 'スコアで競い、順位がリアルタイムで動きます。', en: 'Score attack with a live-updating leaderboard.' }
            }
        };
        const SOLO_LEADERBOARD_STORAGE_KEY = 'tetrisProUltSoloBoards_v1';
        const PEER_BASE_OPTIONS = {
            host: '0.peerjs.com',
            port: 443,
            path: '/',
            secure: true,
            key: 'peerjs',
            pingInterval: 2500,
            debug: 2,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' }
                ],
                sdpSemantics: 'unified-plan'
            }
        };

        let cfg = {
            lang: 'ja', playerName: '', hasCompletedTutorial: false, theme: 'default', lv: 5, ghost: 0.15, das: 150, arr: 30, sdf: 20, ospin: false, ospinTransform: 'fixed', allSpinDisplay: true, particles: 80, enableLevelUp: true,
            keys: { left: 'ArrowLeft', right: 'ArrowRight', soft: 'ArrowDown', hard: ' ', rotR: 'ArrowUp', rotL: 'z', hold: 'c', hold2: 'Shift', pause: 'Escape', retry: 'r' },
            padKeys: { left: 14, right: 15, soft: 13, hard: 12, rotR: 0, rotL: 2, hold: 4, hold2: 5, pause: 9, retry: 8 },
            gamepadDeadzone: 0.5,
            screenScale: 1.0,
            touchLayout: 'balanced',
            touchButtonScale: 1.0,
            touchOpacity: 0.88,
            touchExtraButtons: false,
            touchPos: { dpad: { x: null, y: null }, actions: { x: null, y: null } }
        };
        const urlParams = new URLSearchParams(window.location.search);
        const adminSessionToken = String(urlParams.get('adminSession') || '');
        function isValidAdminSessionToken(token) {
            return /^[a-zA-Z0-9_-]{24,128}$/.test(String(token || ''));
        }
        let adminControlEnabled = urlParams.get('admin') === '1' && isValidAdminSessionToken(adminSessionToken) && window.parent && window.parent !== window;
        let adminCheats = {
            invincible: false,
            shield: false,
            attackMultiplier: 1,
            infiniteHold: false,
            autoHoldReady: false,
            garbageCleaner: false,
            nextPieceType: '',
            noGravity: false,
            lockDelayFreeze: false,
            autoClearBoard: false,
            autoTetrisReady: false,
            hardDropOnlyI: false,
            alwaysB2B: false,
            comboKeeper: false,
            freezeCpu: false,
            autoPerfectClearReady: false,
            autoSkillCoins: false,
            scoreBooster: false,
            slowMotion: false,
            topOutRescue: false,
            shortcuts: {},
            settings: { ...ADMIN_CHEAT_SETTINGS_DEFAULTS }
        };
        let adminRuntime = { scoreBoostAt: 0, skillCoinAt: 0 };
        let adminRestriction = sanitizeAdminRestriction(JSON.parse(localStorage.getItem(ADMIN_RESTRICTION_STORAGE_KEY) || 'null'));
        let adminControlLock = sanitizeAdminControlLock(JSON.parse(localStorage.getItem(ADMIN_CONTROL_LOCK_STORAGE_KEY) || 'null'));
        let isGamepadConnected = false;
        let playerProfile = sanitizePlayerProfile(JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null'));
        let soloLeaderboards = JSON.parse(localStorage.getItem(SOLO_LEADERBOARD_STORAGE_KEY) || '{}');
        let currentSoloModeId = null;
        let activeMatchSession = null;
        let pendingMatchSummary = null;
        let lastReplayData = null;
        let replayPlayback = null;
        let isReplayPlayback = false;
        let onlineRoomRules = { ...DEFAULT_ROOM_RULES };
        let lobbyChatMessages = [];
        let partySlotRoles = ['player', 'player', 'player', 'player'];
        let partySlotTeams = ['A', 'B', 'A', 'B'];
        let connectionQuality = { ping: null, syncDelay: null, packetLoss: 0, missedStates: 0, receivedStates: 0, lastRemoteStateAt: 0 };
        let connectionMonitorInterval = null;
        let onlineStateSequence = 0;
        let pingSerial = 0;
        const REPLAY_FRAME_INTERVAL = 16;
        const REPLAY_ARCHIVE_DB_NAME = 'tetrisUltimateReplayArchive_v1';
        const REPLAY_ARCHIVE_STORE = 'replays';
        const REPLAY_ARCHIVE_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
        const REPLAY_SHARE_PEER_PREFIX = 'TETRIS-REPLAY-';
        const REPLAY_CODE_WORDS_A = ['Happy', 'Lucky', 'Bright', 'Game', 'Pixel', 'Sky', 'Nova', 'Turbo', 'Magic', 'Sunny', 'Hyper', 'Cosmo', 'Dream', 'Silver', 'Ultra', 'Jolly', 'Rapid', 'Alpha', 'Candy', 'Classic'];
        const REPLAY_CODE_WORDS_B = ['Tetris', 'Window', 'Stack', 'Block', 'Puzzle', 'Arena', 'Field', 'Crown', 'Tower', 'Dash', 'Planet', 'Storm', 'Board', 'Neon', 'Fusion', 'Rocket', 'Frame', 'Star', 'Knight', 'Spark'];
        const REPLAY_CODE_WORDS_C = ['Rush', 'Wave', 'Beat', 'Flash', 'Burst', 'Drive', 'Shift', 'Loop', 'Note', 'Light', 'Zone', 'Core', 'Mode', 'Spin', 'Quest'];
        let replayArchiveDbPromise = null;
        let replaySharePeers = new Map();
        let replayArchiveListCache = [];
        let lobbyProfileSnapshots = [];
        let lobbyProfileExpansionState = {};
        let lobbyProfileLookup = {};
        let friendsStore = sanitizeFriendsStore(JSON.parse(localStorage.getItem(FRIENDS_STORAGE_KEY) || 'null'));
        let friendPresenceInterval = null;
        let activeRemoteProfileSnapshot = null;
        let quickMatchReadySelf = false;
        let quickMatchReadyRemote = false;
        let quickMatchConnectionOpen = false;
        let quickMatchStartLock = false;
        let matchCountdownTimer = null;
        let activeChallengeRoomCode = '';
        let activeChallengeTargetName = '';

        let firstTimeNameTemp = "Player1";
        let identityPeer = null;
        let peerGeneration = 0;
        let quickMatchSearchToken = 0;
        let quickMatchRetryTimeout = null;
        let inTutorial = false;
        let tutorialTimeout = null;

        // --- Global Functions ---
        function getPrettyKey(key) {
            if (typeof key === 'number') return `PAD ${key}`;
            if (cfg.lang === 'ja') {
                const map = { 'ArrowLeft': '左矢印キー', 'ArrowRight': '右矢印キー', 'ArrowUp': '上矢印キー', 'ArrowDown': '下矢印キー', ' ': 'スペースキー', 'Shift': 'シフトキー', 'Enter': 'エンターキー', 'Control': 'コントロールキー', 'Escape': 'エスケープキー', 'Alt': 'オルトキー', 'Backspace': 'バックスペースキー', 'r': 'Rキー' };
                return map[key] || key.toUpperCase();
            }
            return key === " " ? "SPACE" : key.toUpperCase();
        }

        function escapeHtml(text) {
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function normalizeGarbageAmount(amount, maxAmount = 10000) {
            const normalized = Math.floor(Number(amount));
            if (!Number.isFinite(normalized)) return 0;
            return Math.max(0, Math.min(maxAmount, normalized));
        }

        function sanitizeAdminRestriction(raw) {
            const source = raw && typeof raw === 'object' ? raw : {};
            const until = Number(source.until) || 0;
            const isExpired = until > 0 && until <= Date.now();
            if (!source.active || isExpired) return { active: false, until: 0, errorCode: '', message: '', lockedName: '' };
            return {
                active: true,
                until,
                errorCode: String(source.errorCode || 'ADMIN-LOCK').slice(0, 32),
                message: String(source.message || '管理者によりオンライン機能が制限されています。').slice(0, 180),
                lockedName: String(source.lockedName || source.playerName || cfg.playerName || '').trim().slice(0, 15),
                issuedBy: String(source.issuedBy || 'ADMIN').slice(0, 40),
                issuedAt: Number(source.issuedAt) || Date.now()
            };
        }

        function sanitizeAdminControlLock(raw) {
            const source = raw && typeof raw === 'object' ? raw : {};
            const until = Number(source.until) || 0;
            const isExpired = until > 0 && until <= Date.now();
            if (!source.active || isExpired) return { active: false, until: 0, message: '' };
            return {
                active: true,
                until,
                message: String(source.message || '管理者により操作が一時停止されています。').slice(0, 160),
                issuedBy: String(source.issuedBy || 'ADMIN').slice(0, 40),
                issuedAt: Number(source.issuedAt) || Date.now()
            };
        }

        function isAdminRestrictionActive() {
            adminRestriction = sanitizeAdminRestriction(adminRestriction);
            if (!adminRestriction.active) {
                localStorage.removeItem(ADMIN_RESTRICTION_STORAGE_KEY);
                return false;
            }
            return true;
        }

        function isAdminControlLockActive() {
            adminControlLock = sanitizeAdminControlLock(adminControlLock);
            if (!adminControlLock.active) {
                localStorage.removeItem(ADMIN_CONTROL_LOCK_STORAGE_KEY);
                return false;
            }
            return true;
        }

        function saveAdminRestriction(restriction) {
            adminRestriction = sanitizeAdminRestriction(restriction);
            if (adminRestriction.active && !adminRestriction.lockedName) {
                adminRestriction.lockedName = String(cfg.playerName || 'PLAYER').trim().slice(0, 15);
            }
            if (adminRestriction.active) {
                localStorage.setItem(ADMIN_RESTRICTION_STORAGE_KEY, JSON.stringify(adminRestriction));
            } else {
                localStorage.removeItem(ADMIN_RESTRICTION_STORAGE_KEY);
            }
            enforceAdminLockedName();
            applyAdminRestrictionUI();
            postAdminState('restriction');
        }

        function saveAdminControlLock(lock) {
            adminControlLock = sanitizeAdminControlLock(lock);
            if (adminControlLock.active) {
                localStorage.setItem(ADMIN_CONTROL_LOCK_STORAGE_KEY, JSON.stringify(adminControlLock));
            } else {
                localStorage.removeItem(ADMIN_CONTROL_LOCK_STORAGE_KEY);
            }
            postAdminState('control-lock');
        }

        function getAdminRestrictionText() {
            if (!isAdminRestrictionActive()) return '';
            const untilText = adminRestriction.until
                ? new Date(adminRestriction.until).toLocaleString()
                : '無期限';
            return `${adminRestriction.errorCode}: ${adminRestriction.message} / 解除予定: ${untilText}`;
        }

        function getAdminControlLockText() {
            if (!isAdminControlLockActive()) return '';
            const untilText = adminControlLock.until
                ? new Date(adminControlLock.until).toLocaleString()
                : '無期限';
            return `${adminControlLock.message} / 解除予定: ${untilText}`;
        }

        function blockAdminRestrictedAction() {
            if (!isAdminRestrictionActive()) return false;
            showToast(getAdminRestrictionText());
            return true;
        }

        function getAdminLockedName() {
            if (!isAdminRestrictionActive()) return '';
            return adminRestriction.lockedName || cfg.playerName || 'PLAYER';
        }

        function enforceAdminLockedName() {
            if (!isAdminRestrictionActive()) return false;
            const lockedName = getAdminLockedName();
            if (lockedName && cfg.playerName !== lockedName) {
                cfg.playerName = lockedName;
                saveCfg();
            }
            const nameInput = document.getElementById('player-name-input');
            if (nameInput) {
                nameInput.value = cfg.playerName;
                nameInput.disabled = true;
                nameInput.title = getAdminRestrictionText();
            }
            const firstNameInput = document.getElementById('first-time-name');
            if (firstNameInput) {
                firstNameInput.value = cfg.playerName;
                firstNameInput.disabled = true;
            }
            return true;
        }

        function applyAdminRestrictionUI() {
            const mainMenu = document.getElementById('main-menu-btns');
            if (!mainMenu) return;
            const active = isAdminRestrictionActive();
            document.body.classList.toggle('admin-restricted', active);
            const buttons = Array.from(mainMenu.querySelectorAll('button'));
            buttons.forEach(button => {
                const action = button.getAttribute('onclick') || '';
                const allowSolo = action.includes('showSoloMenu');
                const allowCpu = /startGame\(\s*true\s*,\s*null/.test(action);
                const allowed = allowSolo || allowCpu;
                button.disabled = active && !allowed;
                button.classList.toggle('admin-restricted-button', active && !allowed);
                if (active && !allowed) {
                    button.title = getAdminRestrictionText();
                } else {
                    button.removeAttribute('title');
                }
            });

            const nameInput = document.getElementById('player-name-input');
            if (nameInput) {
                nameInput.disabled = active;
                if (active) {
                    nameInput.value = getAdminLockedName();
                    nameInput.title = getAdminRestrictionText();
                } else {
                    nameInput.removeAttribute('title');
                }
            }

            let notice = document.getElementById('admin-restriction-notice');
            if (active) {
                if (!notice) {
                    notice = document.createElement('div');
                    notice.id = 'admin-restriction-notice';
                    mainMenu.prepend(notice);
                }
                notice.textContent = `管理者制限中: ${getAdminRestrictionText()}`;
            } else if (notice) {
                notice.remove();
            }
        }

        function enforceAdminRestrictionMode() {
            if (!isAdminRestrictionActive()) return false;
            applyAdminRestrictionUI();
            enforceAdminLockedName();
            const playingAllowedLocalMode = p1 && !isOnline && !isPartyMode && !window.partyModeInstance && !p1.templateKey;
            if (playingAllowedLocalMode) return true;
            if (isOnline) disconnectOnline();
            const idsToHide = ['game-view', 'solo-menu', 'profile-menu', 'online-menu', 'room-settings-menu', 'online-lobby', 'quick-match-lobby', 'replay-menu', 'template-menu', 'mode-select-menu'];
            idsToHide.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
            const menu = document.getElementById('menu');
            const main = document.getElementById('main-menu-btns');
            if (menu) menu.style.display = 'block';
            if (main) main.style.display = 'block';
            applyAdminRestrictionUI();
            return true;
        }

        function normalizeAdminName(name) {
            return String(name || '').trim().toLowerCase();
        }

        function adminNameMatches(targetName, actualName) {
            const target = normalizeAdminName(targetName);
            if (!target || target === '*' || target === 'all') return true;
            return normalizeAdminName(actualName) === target;
        }

        function getAdminConnections() {
            const list = [];
            if (typeof conn !== 'undefined' && conn && conn.open) list.push(conn);
            if (typeof partyClients !== 'undefined') {
                partyClients.forEach(client => {
                    if (client && client.open && !list.includes(client)) list.push(client);
                });
            }
            return list;
        }

        function getAdminPlayerList() {
            const players = [{ id: 'self', name: cfg.playerName || 'PLAYER', self: true }];
            getAdminConnections().forEach((connection, index) => {
                players.push({
                    id: connection.networkId !== undefined ? connection.networkId : `conn-${index + 1}`,
                    name: connection.peerName || (connection.peerProfile && connection.peerProfile.name) || `PLAYER ${index + 2}`,
                    self: false
                });
            });
            return players;
        }

        const ADMIN_CHEAT_LABELS = {
            invincible: '無敵',
            shield: '攻撃無効',
            infiniteHold: '無限ホールド',
            autoHoldReady: 'ホールド常時可',
            garbageCleaner: 'お邪魔掃除',
            noGravity: '重力停止',
            lockDelayFreeze: 'ロック停止',
            autoClearBoard: '盤面消去',
            autoTetrisReady: '4段維持',
            hardDropOnlyI: 'I固定',
            alwaysB2B: 'BTB維持',
            comboKeeper: 'REN維持',
            freezeCpu: 'CPU停止',
            autoPerfectClearReady: 'パフェ待ち',
            autoSkillCoins: 'コイン補充',
            scoreBooster: 'スコア加算',
            slowMotion: 'スロー',
            topOutRescue: '救済'
        };

        function clampAdminNumber(value, min, max, fallback) {
            const numeric = Number(value);
            if (!Number.isFinite(numeric)) return fallback;
            return Math.max(min, Math.min(max, numeric));
        }

        function normalizeAdminShortcutMap(shortcuts = {}) {
            const normalized = {};
            ADMIN_CHEAT_BOOLEAN_KEYS.forEach(key => {
                const raw = String(shortcuts[key] || '').trim();
                normalized[key] = raw.slice(0, 32);
            });
            return normalized;
        }

        function normalizeAdminCheatSettings(settings = {}) {
            const rescueMode = ['top', 'center4'].includes(settings.invincibleRescueMode) ? settings.invincibleRescueMode : ADMIN_CHEAT_SETTINGS_DEFAULTS.invincibleRescueMode;
            const indicatorPosition = ['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(settings.indicatorPosition) ? settings.indicatorPosition : ADMIN_CHEAT_SETTINGS_DEFAULTS.indicatorPosition;
            return {
                invincibleRescueMode: rescueMode,
                indicatorPosition,
                comboMinRen: Math.floor(clampAdminNumber(settings.comboMinRen, 0, 999, ADMIN_CHEAT_SETTINGS_DEFAULTS.comboMinRen)),
                autoSkillCoinsAmount: Math.floor(clampAdminNumber(settings.autoSkillCoinsAmount, 1, 99, ADMIN_CHEAT_SETTINGS_DEFAULTS.autoSkillCoinsAmount)),
                scoreBoostAmount: Math.floor(clampAdminNumber(settings.scoreBoostAmount, 1, 999999, ADMIN_CHEAT_SETTINGS_DEFAULTS.scoreBoostAmount)),
                slowMotionFactor: clampAdminNumber(settings.slowMotionFactor, 0.05, 1, ADMIN_CHEAT_SETTINGS_DEFAULTS.slowMotionFactor)
            };
        }

        function normalizeAdminCheatState(nextCheats = {}, baseCheats = adminCheats) {
            const merged = { ...(baseCheats || {}), ...(nextCheats || {}) };
            const normalized = {
                invincible: false,
                shield: false,
                attackMultiplier: Math.max(1, Math.min(100, Math.floor(Number(merged.attackMultiplier) || 1))),
                infiniteHold: false,
                autoHoldReady: false,
                garbageCleaner: false,
                nextPieceType: ADMIN_PIECE_TYPES.includes(merged.nextPieceType) ? merged.nextPieceType : '',
                noGravity: false,
                lockDelayFreeze: false,
                autoClearBoard: false,
                autoTetrisReady: false,
                hardDropOnlyI: false,
                alwaysB2B: false,
                comboKeeper: false,
                freezeCpu: false,
                autoPerfectClearReady: false,
                autoSkillCoins: false,
                scoreBooster: false,
                slowMotion: false,
                topOutRescue: false,
                shortcuts: normalizeAdminShortcutMap(merged.shortcuts || {}),
                settings: normalizeAdminCheatSettings({ ...ADMIN_CHEAT_SETTINGS_DEFAULTS, ...(merged.settings || {}) })
            };
            ADMIN_CHEAT_BOOLEAN_KEYS.forEach(key => {
                normalized[key] = !!merged[key];
            });
            return normalized;
        }

        function getAdminCheatShortcutKey(rawKey = '') {
            const key = String(rawKey || '').trim();
            return key.length === 1 ? key.toLowerCase() : key.toLowerCase();
        }

        function findAdminShortcutCheat(eventKey) {
            const normalizedEventKey = getAdminCheatShortcutKey(eventKey);
            if (!normalizedEventKey) return '';
            const shortcuts = adminCheats.shortcuts || {};
            return ADMIN_CHEAT_BOOLEAN_KEYS.find(key => getAdminCheatShortcutKey(shortcuts[key]) === normalizedEventKey) || '';
        }

        function isEditableElement(element) {
            if (!element) return false;
            const tag = String(element.tagName || '').toUpperCase();
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || !!element.isContentEditable;
        }

        function updateAdminCheatIndicator() {
            let indicator = document.getElementById('admin-cheat-indicator');
            if (!adminControlEnabled) {
                if (indicator) indicator.style.display = 'none';
                return;
            }
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'admin-cheat-indicator';
                indicator.className = 'admin-cheat-indicator';
                document.body.appendChild(indicator);
            }
            const active = ADMIN_CHEAT_BOOLEAN_KEYS
                .filter(key => adminCheats[key])
                .map(key => ADMIN_CHEAT_LABELS[key] || key);
            if ((adminCheats.attackMultiplier || 1) > 1) active.push(`火力x${adminCheats.attackMultiplier}`);
            if (adminCheats.nextPieceType) active.push(`NEXT ${adminCheats.nextPieceType}`);
            indicator.className = `admin-cheat-indicator ${adminCheats.settings.indicatorPosition}`;
            indicator.innerHTML = active.length
                ? `<div class="admin-cheat-title">ADMIN CHEATS</div><div>${active.map(escapeHtml).join('</div><div>')}</div>`
                : '';
            indicator.style.display = active.length ? 'block' : 'none';
        }

        function toggleAdminCheatByShortcut(eventKey) {
            const cheatKey = findAdminShortcutCheat(eventKey);
            if (!cheatKey) return false;
            adminCheats[cheatKey] = !adminCheats[cheatKey];
            applyAdminCheatState(adminCheats);
            showToast(`${ADMIN_CHEAT_LABELS[cheatKey] || cheatKey}: ${adminCheats[cheatKey] ? 'ON' : 'OFF'}`);
            return true;
        }

        function postAdminMessage(type, payload = {}) {
            if (!adminControlEnabled || !window.parent || window.parent === window) return;
            window.parent.postMessage({ source: ADMIN_GAME_SOURCE, type, token: adminSessionToken, payload }, '*');
        }

        function postAdminState(reason = 'state') {
            adminCheats = normalizeAdminCheatState(adminCheats, {});
            updateAdminCheatIndicator();
            postAdminMessage('state', {
                reason,
                cheats: { ...adminCheats, shortcuts: { ...adminCheats.shortcuts }, settings: { ...adminCheats.settings } },
                restriction: { ...adminRestriction, active: isAdminRestrictionActive() },
                controlLock: { ...adminControlLock, active: isAdminControlLockActive() },
                players: getAdminPlayerList(),
                inGame: !!p1,
                isOnline: !!isOnline
            });
        }

        function applyAdminRestrictionFromPacket(packet) {
            if (packet.targetName && !adminNameMatches(packet.targetName, cfg.playerName)) return false;
            const durationMinutes = Math.max(0, Number(packet.durationMinutes) || 0);
            const until = durationMinutes > 0 ? Date.now() + durationMinutes * 60 * 1000 : 0;
            saveAdminRestriction({
                active: true,
                until,
                errorCode: packet.errorCode || 'ADMIN-BAN',
                message: packet.message || '管理者によりオンライン機能が制限されました。',
                lockedName: cfg.playerName || packet.targetName || 'PLAYER',
                issuedBy: packet.issuedBy || 'ADMIN',
                issuedAt: Date.now()
            });
            if (isOnline) disconnectOnline();
            updateTutorialEntryUI();
            enforceAdminRestrictionMode();
            showToast(getAdminRestrictionText());
            return true;
        }

        function applyAdminControlLockFromPacket(packet) {
            const durationMinutes = Math.max(0, Number(packet.durationMinutes) || 0);
            const until = durationMinutes > 0 ? Date.now() + durationMinutes * 60 * 1000 : 0;
            saveAdminControlLock({
                active: true,
                until,
                message: packet.message || '管理者により操作が一時停止されています。',
                issuedBy: packet.issuedBy || 'ADMIN',
                issuedAt: Date.now()
            });
            keysDown = {};
            keysDownTime = {};
            showToast(getAdminControlLockText());
            return true;
        }

        function clearAdminRestrictionFromPacket(packet = {}) {
            if (packet.targetName && !adminNameMatches(packet.targetName, cfg.playerName)) return false;
            saveAdminRestriction({ active: false });
            showToast(cfg.lang === 'ja' ? '管理者制限を解除しました' : 'Admin restriction cleared.');
            return true;
        }

        function clearAdminControlLockFromPacket(packet = {}) {
            if (packet.targetName && !adminNameMatches(packet.targetName, cfg.playerName)) return false;
            saveAdminControlLock({ active: false });
            keysDown = {};
            keysDownTime = {};
            showToast(cfg.lang === 'ja' ? '操作ロックを解除しました' : 'Control lock cleared.');
            return true;
        }

        function clearAdminBoard(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            const height = typeof board.getArenaHeight === 'function' ? board.getArenaHeight() : board.arena.length;
            const width = typeof board.getBoardWidth === 'function' ? board.getBoardWidth() : (board.arena[0] ? board.arena[0].length : 10);
            board.arena = Array.from({ length: height }, () => new Array(width).fill(0));
            board.pendingGarbage = 0;
            if (typeof board.updateMeter === 'function') board.updateMeter();
            if (typeof board.updateUI === 'function') board.updateUI();
            if (typeof board.draw === 'function') board.draw();
            return true;
        }

        function clearAdminGarbage(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            board.pendingGarbage = 0;
            board.arena.forEach(row => {
                if (!Array.isArray(row)) return;
                for (let x = 0; x < row.length; x++) {
                    if (row[x] === 8) row[x] = 0;
                }
            });
            if (typeof board.updateMeter === 'function') board.updateMeter();
            if (typeof board.updateUI === 'function') board.updateUI();
            if (typeof board.draw === 'function') board.draw();
            return true;
        }

        function clearAdminTopLine(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            const width = typeof board.getBoardWidth === 'function' ? board.getBoardWidth() : (board.arena[0] ? board.arena[0].length : 10);
            const topY = Math.max(0, Math.min(board.arena.length - 1, board.hiddenRows || 0));
            board.arena[topY] = new Array(width).fill(0);
            return true;
        }

        function clearAdminCenterFourColumns(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            const width = typeof board.getBoardWidth === 'function' ? board.getBoardWidth() : (board.arena[0] ? board.arena[0].length : 10);
            const startX = Math.max(0, Math.min(width - 1, Math.floor(width / 2) - 2));
            board.arena.forEach(row => {
                if (!Array.isArray(row)) return;
                for (let x = startX; x < Math.min(width, startX + 4); x++) row[x] = 0;
            });
            return true;
        }

        function rescueAdminTopOut(board = p1) {
            if (!board || !board.player || !Array.isArray(board.arena)) return false;
            const mode = adminCheats.settings && adminCheats.settings.invincibleRescueMode === 'top' ? 'top' : 'center4';
            if (mode === 'top') clearAdminTopLine(board);
            else clearAdminCenterFourColumns(board);
            board.pendingGarbage = 0;
            board.isGameOver = false;
            if (typeof board.updateMeter === 'function') board.updateMeter();
            if (board.player.matrix && typeof board.getSpawnPosition === 'function') {
                board.player.pos = board.getSpawnPosition(board.player.matrix);
                if (typeof board.collide === 'function' && board.collide()) {
                    clearAdminTopLine(board);
                    clearAdminCenterFourColumns(board);
                    board.player.pos = board.getSpawnPosition(board.player.matrix);
                }
            }
            board.lockDelayCounter = 0;
            board.lockResetCount = 0;
            board.hasTouchedGround = false;
            refreshAdminBoard(board);
            return true;
        }

        function setAdminCurrentPiece(type, board = p1) {
            if (!ADMIN_PIECE_TYPES.includes(type) || !board || !board.player || typeof board.createPieceMatrix !== 'function') return false;
            board.player.type = type;
            board.player.matrix = board.createPieceMatrix(type);
            board.player.color = board.getPieceColor(type);
            board.player.rotation = 0;
            board.player.pos = board.getSpawnPosition(board.player.matrix);
            if (typeof board.updateUI === 'function') board.updateUI();
            if (typeof board.draw === 'function') board.draw();
            return true;
        }

        function setAdminHoldPiece(type, board = p1) {
            if (!ADMIN_PIECE_TYPES.includes(type) || !board || !board.player) return false;
            board.player.holdType = type;
            board.player.holdColor = board.getPieceColor(type);
            board.player.canHold = true;
            if (typeof board.updateUI === 'function') board.updateUI();
            return true;
        }

        function buildAdminTetrisReady(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            clearAdminBoard(board);
            const height = typeof board.getArenaHeight === 'function' ? board.getArenaHeight() : board.arena.length;
            const width = typeof board.getBoardWidth === 'function' ? board.getBoardWidth() : 10;
            const startY = Math.max(0, height - 4);
            for (let y = startY; y < height; y++) {
                board.arena[y] = new Array(width).fill(8);
                const hole = Math.min(width - 1, Math.max(0, Math.floor(width / 2) - 1));
                board.arena[y][hole] = 0;
            }
            forceAdminNextPiece('I');
            if (typeof board.draw === 'function') board.draw();
            return true;
        }

        function refreshAdminBoard(board = p1) {
            if (!board) return false;
            if (typeof board.updateMeter === 'function') board.updateMeter();
            if (typeof board.updateUI === 'function') board.updateUI();
            if (typeof board.draw === 'function') board.draw();
            return true;
        }

        function buildAdminPerfectClearReady(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            clearAdminBoard(board);
            const height = typeof board.getArenaHeight === 'function' ? board.getArenaHeight() : board.arena.length;
            const width = typeof board.getBoardWidth === 'function' ? board.getBoardWidth() : 10;
            const holeStart = Math.max(0, Math.min(width - 4, Math.floor((width - 4) / 2)));
            board.arena[height - 1] = new Array(width).fill(8);
            for (let x = holeStart; x < holeStart + 4; x++) board.arena[height - 1][x] = 0;
            setAdminCurrentPiece('I', board);
            if (board.player && board.player.pos) board.player.pos.x = holeStart;
            setAdminHoldPiece('I', board);
            if (Array.isArray(board.nextQueue)) board.nextQueue = ['I', ...board.nextQueue.filter(piece => piece !== 'I')].slice(0, 10);
            return refreshAdminBoard(board);
        }

        function fillAdminDangerBoard(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            clearAdminBoard(board);
            const height = typeof board.getArenaHeight === 'function' ? board.getArenaHeight() : board.arena.length;
            const width = typeof board.getBoardWidth === 'function' ? board.getBoardWidth() : 10;
            const startY = Math.max(0, height - 12);
            for (let y = startY; y < height; y++) {
                const hole = (y + Math.floor(width / 2)) % width;
                board.arena[y] = new Array(width).fill(0).map((_, x) => x === hole ? 0 : 8);
            }
            return refreshAdminBoard(board);
        }

        function randomizeAdminBoard(board = p1) {
            if (!board || !Array.isArray(board.arena)) return false;
            clearAdminBoard(board);
            const height = typeof board.getArenaHeight === 'function' ? board.getArenaHeight() : board.arena.length;
            const width = typeof board.getBoardWidth === 'function' ? board.getBoardWidth() : 10;
            const startY = Math.max(0, height - 14);
            for (let y = startY; y < height; y++) {
                board.arena[y] = Array.from({ length: width }, () => Math.random() < 0.58 ? 1 + Math.floor(Math.random() * 7) : 0);
                if (board.arena[y].every(Boolean)) board.arena[y][Math.floor(Math.random() * width)] = 0;
            }
            return refreshAdminBoard(board);
        }

        function changeAdminBoardStat(stat, value, mode = 'set', board = p1) {
            if (!board || !board.player) return false;
            const allowedStats = new Set(['score', 'lines', 'level', 'ren', 'attacks', 'skillCoins', 'perfectClears']);
            if (!allowedStats.has(stat)) return false;
            const numeric = Math.floor(Number(value));
            if (!Number.isFinite(numeric)) return false;
            const current = Number(board.player[stat]) || 0;
            let next = mode === 'add' ? current + numeric : numeric;
            if (stat === 'ren') next = Math.max(-1, Math.min(999, next));
            else if (stat === 'level') next = Math.max(1, Math.min(999, next));
            else next = Math.max(0, Math.min(999999999, next));
            board.player[stat] = next;
            if (stat === 'lines') board.player.maxLines = Math.max(board.player.maxLines || 0, next);
            return refreshAdminBoard(board);
        }

        function applyAdminPacketToBoard(packet, board = p1) {
            if (!packet || !packet.type || !board) return false;
            if (packet.type === 'admin_clear_board') return clearAdminBoard(board);
            if (packet.type === 'admin_clear_garbage') return clearAdminGarbage(board);
            if (packet.type === 'admin_set_next_piece') return setAdminNextPiece(packet.piece, board);
            if (packet.type === 'admin_set_current_piece') return setAdminCurrentPiece(packet.piece, board);
            if (packet.type === 'admin_set_hold_piece') return setAdminHoldPiece(packet.piece, board);
            if (packet.type === 'admin_add_garbage') {
                if (typeof board.receiveGarbage === 'function') {
                    board.receiveGarbage(packet.amount);
                    return true;
                }
                return false;
            }
            if (packet.type === 'admin_knockout') return forceAdminGameOver(board);
            if (packet.type === 'admin_add_stat') return changeAdminBoardStat(packet.stat, packet.value, 'add', board);
            if (packet.type === 'admin_set_stat') return changeAdminBoardStat(packet.stat, packet.value, 'set', board);
            if (packet.type === 'admin_perfect_clear_ready') return buildAdminPerfectClearReady(board);
            if (packet.type === 'admin_fill_board') return fillAdminDangerBoard(board);
            if (packet.type === 'admin_random_board') return randomizeAdminBoard(board);
            return false;
        }

        function forceAdminGameOver(board = p1) {
            if (!board) return false;
            const prevInvincible = adminCheats.invincible;
            adminCheats.invincible = false;
            try {
                if (typeof board.gameOver === 'function') board.gameOver();
                else board.isGameOver = true;
            } finally {
                adminCheats.invincible = prevInvincible;
            }
            return true;
        }

        function applyAdminPacketToLocal(packet) {
            if (!packet || !packet.type) return false;
            if (packet.type === 'admin_ban') return !!applyAdminRestrictionFromPacket(packet);
            if (packet.type === 'admin_unban') return clearAdminRestrictionFromPacket(packet);
            if (packet.type === 'admin_lock_controls') return !!applyAdminControlLockFromPacket(packet);
            if (packet.type === 'admin_unlock_controls') return clearAdminControlLockFromPacket(packet);
            if (packet.type === 'admin_set_next_piece') return forceAdminNextPiece(packet.piece);
            return applyAdminPacketToBoard(packet, p1);
        }

        function routeAdminPacket(packet, sourceConnection = null) {
            const targetName = packet.targetName || '';
            let delivered = 0;
            if (adminNameMatches(targetName, cfg.playerName)) {
                applyAdminPacketToLocal(packet);
                delivered++;
            }
            if (cpu && adminNameMatches(targetName, 'CPU')) {
                applyAdminPacketToBoard(packet, cpu);
                delivered++;
            }
            getAdminConnections().forEach(connection => {
                if (!connection || !connection.open || connection === sourceConnection) return;
                const peerName = connection.peerName || (connection.peerProfile && connection.peerProfile.name) || '';
                if (!adminNameMatches(targetName, peerName)) return;
                connection.send(packet);
                delivered++;
            });
            if (delivered === 0 && typeof conn !== 'undefined' && conn && conn.open && conn !== sourceConnection) {
                conn.send(packet);
                delivered++;
            }
            return delivered;
        }

        function handleIncomingAdminPacket(packet, sourceConnection = null) {
            if (!packet || !packet.type) return false;
            if (packet.targetName && !adminNameMatches(packet.targetName, cfg.playerName)) {
                if (isHost) routeAdminPacket(packet, sourceConnection);
                return true;
            }
            applyAdminPacketToLocal(packet);
            return true;
        }

        function applyAdminCheatState(nextCheats = {}) {
            adminCheats = normalizeAdminCheatState(nextCheats, adminCheats);
            applyAdminPassiveCheats();
            updateAdminCheatIndicator();
            postAdminState('cheats');
        }

        function getAdminAttackMultiplier(board) {
            if (!adminControlEnabled || !board || board !== p1) return 1;
            return Math.max(1, Math.min(100, adminCheats.attackMultiplier || 1));
        }

        function setAdminNextPiece(type, board = p1) {
            if (!ADMIN_PIECE_TYPES.includes(type) || !board || !Array.isArray(board.nextQueue)) return false;
            board.nextQueue[0] = type;
            if (typeof board.updateUI === 'function') board.updateUI();
            return true;
        }

        function forceAdminNextPiece(type) {
            return setAdminNextPiece(type, p1);
        }

        function applyAdminPassiveCheats() {
            if (!adminControlEnabled || !p1) return;
            const now = performance.now();
            if ((adminCheats.infiniteHold || adminCheats.autoHoldReady) && p1.player) p1.player.canHold = true;
            if (adminCheats.alwaysB2B && p1.player) p1.player.btb = true;
            if (adminCheats.comboKeeper && p1.player) {
                const minRen = adminCheats.settings ? adminCheats.settings.comboMinRen : 10;
                p1.player.ren = Math.max(Number(p1.player.ren) || 0, minRen);
                p1.player.maxRen = Math.max(Number(p1.player.maxRen) || 0, p1.player.ren);
            }
            if (adminCheats.lockDelayFreeze) {
                p1.lockDelayCounter = 0;
                p1.lockResetCount = 0;
            }
            if (adminCheats.garbageCleaner) {
                p1.pendingGarbage = 0;
                if (Array.isArray(p1.arena)) {
                    p1.arena.forEach(row => {
                        if (!Array.isArray(row)) return;
                        for (let x = 0; x < row.length; x++) {
                            if (row[x] === 8) row[x] = 0;
                        }
                    });
                }
                if (typeof p1.updateMeter === 'function') p1.updateMeter();
            }
            if (adminCheats.autoSkillCoins && p1.player && now - adminRuntime.skillCoinAt >= 1000) {
                p1.player.skillCoins = Math.max(0, Math.min(9999, (Number(p1.player.skillCoins) || 0) + (adminCheats.settings.autoSkillCoinsAmount || 1)));
                adminRuntime.skillCoinAt = now;
                refreshSkillPanel(p1);
            }
            if (adminCheats.scoreBooster && p1.player && now - adminRuntime.scoreBoostAt >= 1000) {
                p1.player.score = Math.max(0, Math.min(999999999, (Number(p1.player.score) || 0) + (adminCheats.settings.scoreBoostAmount || 1000)));
                adminRuntime.scoreBoostAt = now;
                if (typeof p1.updateUI === 'function') p1.updateUI();
            }
            if (adminCheats.autoClearBoard) clearAdminBoard(p1);
            if (adminCheats.autoTetrisReady) buildAdminTetrisReady(p1);
            if (adminCheats.autoPerfectClearReady) buildAdminPerfectClearReady(p1);
            if (adminCheats.topOutRescue && p1.player && typeof p1.collide === 'function' && p1.collide()) rescueAdminTopOut(p1);
            if (adminCheats.nextPieceType) forceAdminNextPiece(adminCheats.nextPieceType);
            updateAdminCheatIndicator();
        }

        function sendAdminAttack(amountValue, targetName = '') {
            const amount = normalizeGarbageAmount(amountValue, 10000);
            if (amount <= 0) return false;
            let sent = false;
            if (p1 && p1.opponent && typeof p1.opponent.receiveGarbage === 'function' && adminNameMatches(targetName, 'CPU')) {
                p1.opponent.receiveGarbage(amount);
                sent = true;
            }
            if (isStandardOnlineMatch()) {
                if (!targetName) sent = sendStandardOnlineAttack(amount, p1 && typeof p1.networkId === 'number' ? p1.networkId : onlineMyIndex) || sent;
                getAdminConnections().forEach(connection => {
                    const peerName = connection.peerName || (connection.peerProfile && connection.peerProfile.name) || '';
                    if (!adminNameMatches(targetName, peerName)) return;
                    connection.send({ type: 'attack', amount, fromId: onlineMyIndex });
                    sent = true;
                });
            } else if (conn && conn.open && !targetName) {
                conn.send({ type: 'attack', amount });
                sent = true;
            }
            postAdminState(sent ? 'attack-sent' : 'attack-no-target');
            return sent;
        }

        function executeAdminCommand(command, payload = {}) {
            if (!adminControlEnabled) return;
            if (command === 'getState') {
                postAdminState('manual');
            } else if (command === 'setCheats') {
                applyAdminCheatState(payload.cheats || {});
            } else if (command === 'setNextPiece') {
                const ok = forceAdminNextPiece(payload.piece);
                if (ok) adminCheats.nextPieceType = '';
                postAdminState(ok ? 'next-piece' : 'next-piece-failed');
            } else if (command === 'sendAttack') {
                sendAdminAttack(payload.amount, payload.targetName || '');
            } else if (command === 'clearOwnBoard') {
                clearAdminBoard(p1);
                postAdminState('clear-own-board');
            } else if (command === 'clearGarbage') {
                clearAdminGarbage(p1);
                postAdminState('clear-garbage');
            } else if (command === 'tetrisReady') {
                buildAdminTetrisReady(p1);
                postAdminState('tetris-ready');
            } else if (command === 'perfectClearReady') {
                buildAdminPerfectClearReady(p1);
                postAdminState('perfect-clear-ready');
            } else if (command === 'fillBoardSelf') {
                fillAdminDangerBoard(p1);
                postAdminState('fill-board');
            } else if (command === 'randomBoardSelf') {
                randomizeAdminBoard(p1);
                postAdminState('random-board');
            } else if (command === 'setCurrentPiece') {
                setAdminCurrentPiece(payload.piece);
                postAdminState('current-piece');
            } else if (command === 'setHoldPiece') {
                setAdminHoldPiece(payload.piece);
                postAdminState('hold-piece');
            } else if (command === 'addGarbageSelf') {
                if (p1 && typeof p1.receiveGarbage === 'function') p1.receiveGarbage(payload.amount);
                postAdminState('self-garbage');
            } else if (command === 'addStatSelf') {
                changeAdminBoardStat(payload.stat, payload.value, 'add', p1);
                postAdminState('add-stat');
            } else if (command === 'setStatSelf') {
                changeAdminBoardStat(payload.stat, payload.value, 'set', p1);
                postAdminState('set-stat');
            } else if (command === 'targetCommand') {
                const packet = {
                    type: payload.packetType,
                    targetName: payload.targetName || '',
                    piece: payload.piece || '',
                    amount: normalizeGarbageAmount(payload.amount || 0),
                    stat: payload.stat || '',
                    value: Number(payload.value) || 0,
                    durationMinutes: Math.max(0, Number(payload.durationMinutes) || 0),
                    message: payload.message || '管理者命令を受信しました。',
                    issuedBy: cfg.playerName || 'ADMIN'
                };
                if (ADMIN_PACKET_TYPES.has(packet.type)) routeAdminPacket(packet);
                postAdminState('target-command');
            } else if (command === 'ban') {
                const packet = {
                    type: 'admin_ban',
                    targetName: payload.targetName || '',
                    durationMinutes: Math.max(0, Number(payload.durationMinutes) || 0),
                    errorCode: payload.errorCode || 'ADMIN-BAN',
                    message: payload.message || '管理者によりオンライン機能が制限されました。',
                    issuedBy: cfg.playerName || 'ADMIN'
                };
                routeAdminPacket(packet);
                postAdminState('ban');
            } else if (command === 'unban') {
                const packet = { type: 'admin_unban', targetName: payload.targetName || '', issuedBy: cfg.playerName || 'ADMIN' };
                routeAdminPacket(packet);
                postAdminState('unban');
            } else if (command === 'clearLocalBan') {
                clearAdminRestrictionFromPacket();
                postAdminState('local-unban');
            }
        }

        function getDefaultProfile() {
            return {
                rating: 1000,
                peakRating: 1000,
                seasonId: '',
                seasonBest: 1000,
                seasonWins: 0,
                seasonLosses: 0,
                totalWins: 0,
                totalLosses: 0,
                title: '',
                bio: '',
                favoriteMode: 'solo',
                youtubeUrl: '',
                customLinks: Array.from({ length: PROFILE_LINK_COUNT }, () => ({ label: '', url: '' }))
            };
        }

        function normalizeProfileUrl(rawUrl) {
            const trimmed = String(rawUrl || '').trim();
            if (!trimmed) return '';
            let normalized = trimmed;
            if (!/^[a-z]+:\/\//i.test(normalized)) normalized = `https://${normalized}`;
            try {
                const parsed = new URL(normalized);
                if (!/^https?:$/i.test(parsed.protocol)) return '';
                return parsed.toString();
            } catch (err) {
                return '';
            }
        }

        function sanitizeProfileLink(rawLink) {
            const source = rawLink && typeof rawLink === 'object' ? rawLink : {};
            return {
                label: String(source.label || '').trim().slice(0, 28),
                url: normalizeProfileUrl(source.url || '')
            };
        }

        function sanitizePlayerProfile(rawProfile) {
            const base = getDefaultProfile();
            const source = rawProfile && typeof rawProfile === 'object' ? rawProfile : {};
            const customLinks = Array.from({ length: PROFILE_LINK_COUNT }, (_, index) =>
                sanitizeProfileLink(Array.isArray(source.customLinks) ? source.customLinks[index] : null)
            );
            const rating = Math.max(100, parseInt(source.rating, 10) || base.rating);
            const peakRating = Math.max(rating, parseInt(source.peakRating, 10) || base.peakRating);
            const seasonBest = Math.max(rating, parseInt(source.seasonBest, 10) || peakRating);
            return {
                ...base,
                ...source,
                rating,
                peakRating,
                seasonId: String(source.seasonId || '').trim(),
                seasonBest,
                seasonWins: Math.max(0, parseInt(source.seasonWins, 10) || 0),
                seasonLosses: Math.max(0, parseInt(source.seasonLosses, 10) || 0),
                totalWins: Math.max(0, parseInt(source.totalWins, 10) || 0),
                totalLosses: Math.max(0, parseInt(source.totalLosses, 10) || 0),
                title: String(source.title || '').trim().slice(0, 32),
                bio: String(source.bio || '').trim().slice(0, 280),
                favoriteMode: PROFILE_FAVORITE_MODES.includes(source.favoriteMode) ? source.favoriteMode : base.favoriteMode,
                youtubeUrl: normalizeProfileUrl(source.youtubeUrl || ''),
                customLinks
            };
        }

        function sanitizePublicProfileSnapshot(rawSnapshot, fallbackName = '') {
            const source = rawSnapshot && typeof rawSnapshot === 'object' ? rawSnapshot : {};
            const customLinks = Array.from({ length: PROFILE_LINK_COUNT }, (_, index) =>
                sanitizeProfileLink(Array.isArray(source.customLinks) ? source.customLinks[index] : null)
            ).filter(link => link.url);
            return {
                name: String(source.name || fallbackName || cfg.playerName || 'PLAYER').trim().slice(0, 15) || 'PLAYER',
                title: String(source.title || '').trim().slice(0, 32),
                bio: String(source.bio || '').trim().slice(0, 280),
                favoriteMode: PROFILE_FAVORITE_MODES.includes(source.favoriteMode) ? source.favoriteMode : 'solo',
                rating: Math.max(100, parseInt(source.rating, 10) || 1000),
                youtubeUrl: normalizeProfileUrl(source.youtubeUrl || ''),
                customLinks
            };
        }

        function buildPublicProfileSnapshot(nameOverride = null) {
            const safeProfile = sanitizePlayerProfile(playerProfile);
            return sanitizePublicProfileSnapshot({
                name: nameOverride || cfg.playerName || 'PLAYER',
                title: safeProfile.title,
                bio: safeProfile.bio,
                favoriteMode: safeProfile.favoriteMode,
                rating: safeProfile.rating,
                youtubeUrl: safeProfile.youtubeUrl,
                customLinks: safeProfile.customLinks
            }, nameOverride || cfg.playerName || 'PLAYER');
        }

        function sanitizeFriendRecord(rawRecord, fallbackName = '') {
            const source = rawRecord && typeof rawRecord === 'object' ? rawRecord : {};
            const safeProfile = sanitizePublicProfileSnapshot(source.profile, fallbackName);
            const safeName = String(source.name || safeProfile.name || fallbackName).trim().slice(0, 15);
            if (!safeName) return null;
            return {
                name: safeName,
                profile: safeProfile,
                updatedAt: Math.max(0, parseInt(source.updatedAt, 10) || Date.now()),
                lastStatus: FRIEND_STATUS_VALUES.includes(source.lastStatus) ? source.lastStatus : 'offline'
            };
        }

        function sanitizeFriendBucket(rawBucket) {
            const safeBucket = {};
            const source = rawBucket && typeof rawBucket === 'object' ? rawBucket : {};
            Object.keys(source).forEach((key) => {
                const record = sanitizeFriendRecord(source[key], key);
                if (record && record.name) safeBucket[record.name] = record;
            });
            return safeBucket;
        }

        function sanitizeFriendsStore(rawStore) {
            const source = rawStore && typeof rawStore === 'object' ? rawStore : {};
            return {
                approved: sanitizeFriendBucket(source.approved),
                incoming: sanitizeFriendBucket(source.incoming),
                outgoing: sanitizeFriendBucket(source.outgoing)
            };
        }

        function persistFriendsStore() {
            friendsStore = sanitizeFriendsStore(friendsStore);
            localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friendsStore));
            renderFriendLists();
            renderRemoteProfileOverlay();
        }

        function upsertFriendRecord(bucketName, name, profileSnapshot = null, extra = {}) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName || !friendsStore[bucketName]) return null;
            const base = friendsStore[bucketName][safeName] || {};
            const record = sanitizeFriendRecord({
                ...base,
                ...extra,
                name: safeName,
                profile: profileSnapshot ? sanitizePublicProfileSnapshot(profileSnapshot, safeName) : (base.profile || { name: safeName })
            }, safeName);
            if (record) friendsStore[bucketName][safeName] = record;
            return record;
        }

        function removeFriendRecord(bucketName, name) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName || !friendsStore[bucketName]) return;
            delete friendsStore[bucketName][safeName];
        }

        function getFriendRecord(name) {
            const safeName = String(name || '').trim().slice(0, 15);
            return friendsStore.approved[safeName] || friendsStore.incoming[safeName] || friendsStore.outgoing[safeName] || null;
        }

        function getFriendRelationship(name) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (friendsStore.approved[safeName]) return 'approved';
            if (friendsStore.incoming[safeName]) return 'incoming';
            if (friendsStore.outgoing[safeName]) return 'outgoing';
            return 'none';
        }

        function getIdentityPeerId(name) {
            return `${IDENTITY_PEER_PREFIX}${String(name || '').trim()}`;
        }

        function getCurrentPresenceState() {
            const gameView = document.getElementById('game-view');
            const inOnlineBattle = !!((isOnline || window.partyModeInstance) && gameView && gameView.style.display === 'flex');
            return inOnlineBattle ? 'in_match' : 'online';
        }

        function isBusyForChallenge() {
            return !!(
                isQuickMatch ||
                isOnline ||
                document.getElementById('online-lobby').style.display === 'block' ||
                document.getElementById('quick-match-lobby').style.display === 'block' ||
                document.getElementById('room-settings-menu').style.display === 'block'
            );
        }

        function getFriendStatusLabel(status) {
            const safeStatus = FRIEND_STATUS_VALUES.includes(status) ? status : 'offline';
            return tr(`profile-friend-status-${safeStatus}`);
        }

        function buildFriendStatusPill(status) {
            const safeStatus = FRIEND_STATUS_VALUES.includes(status) ? status : 'offline';
            return `<span class="friend-status-pill ${safeStatus}">${escapeHtml(getFriendStatusLabel(safeStatus))}</span>`;
        }

        function closeIdentityConnection(connection) {
            if (!connection) return;
            setTimeout(() => {
                try {
                    connection.close();
                } catch (err) {
                    console.warn('Failed to close identity connection:', err);
                }
            }, 120);
        }

        function bindIdentityPeerHandlers(reservedPeer) {
            if (!reservedPeer || reservedPeer.__tetrisIdentityBound) return;
            reservedPeer.__tetrisIdentityBound = true;
            reservedPeer.on('connection', (connection) => {
                setupIdentityConnection(connection);
            });
            reservedPeer.on('close', () => {
                if (identityPeer === reservedPeer) identityPeer = null;
            });
            reservedPeer.on('error', (err) => {
                console.warn('Identity peer error:', err);
                if (identityPeer === reservedPeer) identityPeer = null;
            });
        }

        function openIdentityChannel(targetName, payload, callbacks = {}) {
            const safeName = String(targetName || '').trim().slice(0, 15);
            if (!safeName) {
                if (typeof callbacks.onError === 'function') callbacks.onError(new Error('missing-target'));
                return null;
            }
            resumeIdentityReservation();
            if (!identityPeer) {
                if (typeof callbacks.onError === 'function') callbacks.onError(new Error('identity-unavailable'));
                return null;
            }
            let connection = null;
            let timeoutId = null;
            try {
                connection = identityPeer.connect(getIdentityPeerId(safeName), { reliable: true });
            } catch (err) {
                if (typeof callbacks.onError === 'function') callbacks.onError(err);
                return null;
            }
            const clearTimer = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            };
            const scheduleTimeout = () => {
                clearTimer();
                if (!callbacks.timeoutMs) return;
                timeoutId = setTimeout(() => {
                    clearTimer();
                    if (typeof callbacks.onTimeout === 'function') callbacks.onTimeout(connection);
                    closeIdentityConnection(connection);
                }, callbacks.timeoutMs);
            };
            connection.on('open', () => {
                if (typeof callbacks.onOpen === 'function') callbacks.onOpen(connection);
                if (payload) {
                    connection.send({
                        ...payload,
                        name: cfg.playerName || 'PLAYER',
                        profile: buildPublicProfileSnapshot()
                    });
                }
                if (callbacks.keepOpen) scheduleTimeout();
                else if (callbacks.closeAfterSend !== false) closeIdentityConnection(connection);
            });
            connection.on('data', (data) => {
                if (callbacks.keepOpen) scheduleTimeout();
                if (typeof callbacks.onData === 'function') callbacks.onData(data, connection);
            });
            connection.on('error', (err) => {
                clearTimer();
                if (typeof callbacks.onError === 'function') callbacks.onError(err, connection);
            });
            connection.on('close', () => {
                clearTimer();
                if (typeof callbacks.onClose === 'function') callbacks.onClose(connection);
            });
            return connection;
        }

        function markApprovedFriend(name, profileSnapshot = null, status = 'online') {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName) return;
            upsertFriendRecord('approved', safeName, profileSnapshot || { name: safeName }, {
                lastStatus: FRIEND_STATUS_VALUES.includes(status) ? status : 'online',
                updatedAt: Date.now()
            });
            removeFriendRecord('incoming', safeName);
            removeFriendRecord('outgoing', safeName);
            persistFriendsStore();
        }

        function acceptFriendRequest(name, profileSnapshot = null, connection = null) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName) return;
            markApprovedFriend(safeName, profileSnapshot || (friendsStore.incoming[safeName] || {}).profile, 'online');
            if (connection && connection.open) {
                connection.send({ type: 'friend_accept', name: cfg.playerName || 'PLAYER', profile: buildPublicProfileSnapshot() });
            } else {
                openIdentityChannel(safeName, { type: 'friend_accept' }, { closeAfterSend: true });
            }
            showToast(trf('toast-friend-added', { name: safeName }));
            refreshFriendPresence(true);
        }

        function declineFriendRequest(name, connection = null) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName) return;
            removeFriendRecord('incoming', safeName);
            persistFriendsStore();
            if (connection && connection.open) {
                connection.send({ type: 'friend_decline', name: cfg.playerName || 'PLAYER', profile: buildPublicProfileSnapshot() });
            } else {
                openIdentityChannel(safeName, { type: 'friend_decline' }, { closeAfterSend: true });
            }
        }

        function sendFriendRequestToName(targetName, profileSnapshot = null) {
            const safeName = String(targetName || '').trim().slice(0, 15);
            if (!safeName) {
                showToast(tr('profile-friend-request-placeholder'));
                return;
            }
            if (safeName === cfg.playerName) {
                showToast(tr('toast-friend-self'));
                return;
            }
            if (friendsStore.approved[safeName]) {
                showToast(trf('toast-friend-already', { name: safeName }));
                return;
            }
            if (friendsStore.incoming[safeName]) {
                acceptFriendRequest(safeName, (friendsStore.incoming[safeName] || {}).profile);
                return;
            }
            openIdentityChannel(safeName, { type: 'friend_request' }, {
                keepOpen: true,
                timeoutMs: 120000,
                onOpen: () => {
                    upsertFriendRecord('outgoing', safeName, profileSnapshot || { name: safeName }, { updatedAt: Date.now() });
                    persistFriendsStore();
                    showToast(trf('toast-friend-request-sent', { name: safeName }));
                },
                onData: (data, connection) => {
                    if (!data || !data.type) return;
                    const remoteProfile = sanitizePublicProfileSnapshot(data.profile, safeName);
                    if (data.type === 'friend_accept') {
                        markApprovedFriend(safeName, remoteProfile, 'online');
                        showToast(trf('toast-friend-accepted', { name: safeName }));
                        closeIdentityConnection(connection);
                    } else if (data.type === 'friend_decline') {
                        removeFriendRecord('outgoing', safeName);
                        persistFriendsStore();
                        showToast(trf('toast-friend-declined', { name: safeName }));
                        closeIdentityConnection(connection);
                    }
                },
                onError: () => {
                    removeFriendRecord('outgoing', safeName);
                    persistFriendsStore();
                    showToast(trf('toast-friend-request-failed', { name: safeName }));
                },
                onTimeout: () => {
                    removeFriendRecord('outgoing', safeName);
                    persistFriendsStore();
                    showToast(trf('toast-friend-request-failed', { name: safeName }));
                }
            });
        }

        function sendFriendRequestFromProfileInput() {
            const input = document.getElementById('profile-friend-name-input');
            if (!input) return;
            const targetName = input.value.trim();
            if (!targetName) {
                showToast(tr('profile-friend-request-placeholder'));
                return;
            }
            input.value = '';
            sendFriendRequestToName(targetName);
        }

        function handleIncomingFriendRequest(name, profileSnapshot, connection) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName || safeName === cfg.playerName) return;
            if (friendsStore.approved[safeName]) {
                if (connection && connection.open) {
                    connection.send({ type: 'friend_accept', name: cfg.playerName || 'PLAYER', profile: buildPublicProfileSnapshot() });
                }
                return;
            }
            upsertFriendRecord('incoming', safeName, profileSnapshot, { updatedAt: Date.now() });
            removeFriendRecord('outgoing', safeName);
            persistFriendsStore();
            showConfirmToast(
                trf('toast-friend-request-received', { name: safeName }),
                () => acceptFriendRequest(safeName, profileSnapshot, connection),
                () => declineFriendRequest(safeName, connection),
                { confirmText: tr('common-accept'), cancelText: tr('common-decline') }
            );
        }

        function getRenderableFriendSnapshot(name) {
            const record = getFriendRecord(name);
            return sanitizePublicProfileSnapshot(record && record.profile ? record.profile : { name }, name);
        }

        function openFriendProfileByName(name) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName) return;
            if (safeName === cfg.playerName) {
                showProfileMenu();
                return;
            }
            openRemoteProfileOverlay(getRenderableFriendSnapshot(safeName));
        }

        function requestProfileChallengeByName(name) {
            const safeName = String(name || '').trim().slice(0, 15);
            if (!safeName) return;
            requestProfileChallenge(getRenderableFriendSnapshot(safeName));
        }

        function renderFriendCard(entry, kind = 'approved') {
            if (!entry) return '';
            const snapshot = sanitizePublicProfileSnapshot(entry.profile, entry.name);
            const nameArg = encodeURIComponent(snapshot.name);
            const actions = [
                `<button class="btn" style="--accent:#00f0f0;" onclick="openFriendProfileByName(decodeURIComponent('${nameArg}'))">${escapeHtml(tr('profile-friend-open'))}</button>`
            ];
            if (kind === 'approved') {
                actions.push(`<button class="btn" style="--accent:#ffaa33;" onclick="requestProfileChallengeByName(decodeURIComponent('${nameArg}'))">${escapeHtml(tr('profile-friend-challenge'))}</button>`);
            } else if (kind === 'incoming') {
                actions.push(`<button class="btn" style="--accent:#55ff55;" onclick="acceptFriendRequest(decodeURIComponent('${nameArg}'))">${escapeHtml(tr('profile-friend-accept'))}</button>`);
                actions.push(`<button class="btn" style="border-color:#888; color:#888;" onclick="declineFriendRequest(decodeURIComponent('${nameArg}'))">${escapeHtml(tr('profile-friend-decline'))}</button>`);
            } else if (kind === 'outgoing') {
                actions.push(`<button class="btn" style="border-color:#888; color:#888;" disabled>${escapeHtml(tr('profile-friend-sent'))}</button>`);
            }
            return `
                <div class="friend-card">
                    <div class="friend-card-head">
                        <div>
                            <div class="friend-card-name">${escapeHtml(snapshot.name)}</div>
                            <div class="friend-card-title">${escapeHtml(snapshot.title || tr('profile-no-title'))}</div>
                        </div>
                        ${kind === 'approved' ? buildFriendStatusPill(entry.lastStatus || 'offline') : ''}
                    </div>
                    <div class="friend-card-actions">${actions.join('')}</div>
                </div>
            `;
        }

        function renderFriendListInto(elementId, entries, kind, emptyKey) {
            const el = document.getElementById(elementId);
            if (!el) return;
            if (!entries.length) {
                el.innerHTML = `<div class="friend-empty">${escapeHtml(tr(emptyKey))}</div>`;
                return;
            }
            el.innerHTML = entries.map(entry => renderFriendCard(entry, kind)).join('');
        }

        function renderFriendLists() {
            const approved = Object.values(friendsStore.approved).sort((a, b) => a.name.localeCompare(b.name));
            const incoming = Object.values(friendsStore.incoming).sort((a, b) => a.name.localeCompare(b.name));
            const outgoing = Object.values(friendsStore.outgoing).sort((a, b) => a.name.localeCompare(b.name));
            renderFriendListInto('profile-friend-list', approved, 'approved', 'profile-friend-empty');
            renderFriendListInto('profile-friend-incoming-list', incoming, 'incoming', 'profile-friend-empty-incoming');
            renderFriendListInto('profile-friend-outgoing-list', outgoing, 'outgoing', 'profile-friend-empty-outgoing');
        }

        function startFriendPresenceMonitor() {
            if (friendPresenceInterval) clearInterval(friendPresenceInterval);
            refreshFriendPresence(true);
            friendPresenceInterval = setInterval(() => refreshFriendPresence(true), 25000);
        }

        function stopFriendPresenceMonitor() {
            if (!friendPresenceInterval) return;
            clearInterval(friendPresenceInterval);
            friendPresenceInterval = null;
        }

        function refreshFriendPresence(force = false) {
            if (!force && document.getElementById('profile-menu').style.display !== 'block') return;
            const approvedFriends = Object.values(friendsStore.approved);
            if (!approvedFriends.length) {
                renderFriendLists();
                return;
            }
            approvedFriends.forEach((entry) => {
                openIdentityChannel(entry.name, { type: 'presence_ping' }, {
                    keepOpen: true,
                    timeoutMs: 4000,
                    onData: (data, connection) => {
                        if (!data || data.type !== 'presence_pong') return;
                        const remoteProfile = sanitizePublicProfileSnapshot(data.profile, entry.name);
                        upsertFriendRecord('approved', entry.name, remoteProfile, {
                            lastStatus: FRIEND_STATUS_VALUES.includes(data.state) ? data.state : 'online',
                            updatedAt: Date.now()
                        });
                        persistFriendsStore();
                        closeIdentityConnection(connection);
                    },
                    onError: () => {
                        upsertFriendRecord('approved', entry.name, entry.profile, { lastStatus: 'offline', updatedAt: Date.now() });
                        persistFriendsStore();
                    },
                    onTimeout: () => {
                        upsertFriendRecord('approved', entry.name, entry.profile, { lastStatus: 'offline', updatedAt: Date.now() });
                        persistFriendsStore();
                    }
                });
            });
        }

        function openRemoteProfileOverlay(snapshot) {
            const safeSnapshot = sanitizePublicProfileSnapshot(snapshot, snapshot && snapshot.name);
            if (safeSnapshot.name === cfg.playerName) {
                closeRemoteProfileOverlay();
                showProfileMenu();
                return;
            }
            activeRemoteProfileSnapshot = safeSnapshot;
            renderRemoteProfileOverlay();
            document.getElementById('remote-profile-overlay').style.display = 'flex';
        }

        function closeRemoteProfileOverlay() {
            activeRemoteProfileSnapshot = null;
            const overlay = document.getElementById('remote-profile-overlay');
            if (overlay) overlay.style.display = 'none';
        }

        function renderRemoteProfileOverlay() {
            const body = document.getElementById('remote-profile-body');
            if (!body) return;
            if (!activeRemoteProfileSnapshot) {
                body.innerHTML = '';
                return;
            }
            const snapshot = sanitizePublicProfileSnapshot(activeRemoteProfileSnapshot, activeRemoteProfileSnapshot.name);
            const relationship = getFriendRelationship(snapshot.name);
            const links = getDisplayProfileLinks(snapshot);
            const nameArg = encodeURIComponent(snapshot.name);
            const relationshipButton = relationship === 'approved'
                ? `<button class="btn" style="border-color:#888; color:#888;" disabled>${escapeHtml(tr('profile-friend-approved'))}</button>`
                : relationship === 'incoming'
                    ? `<button class="btn" style="--accent:#55ff55;" onclick="acceptFriendRequest(decodeURIComponent('${nameArg}'))">${escapeHtml(tr('profile-friend-accept'))}</button>`
                    : relationship === 'outgoing'
                        ? `<button class="btn" style="border-color:#888; color:#888;" disabled>${escapeHtml(tr('profile-friend-sent'))}</button>`
                        : `<button class="btn" style="--accent:#55ff55;" onclick="sendFriendRequestToName(decodeURIComponent('${nameArg}'), activeRemoteProfileSnapshot)">${escapeHtml(tr('profile-friend-add'))}</button>`;
            const approvedStatus = friendsStore.approved[snapshot.name] ? buildFriendStatusPill((friendsStore.approved[snapshot.name] || {}).lastStatus || 'offline') : '';
            body.innerHTML = `
                <div class="profile-viewer-card">
                    <div class="profile-preview-head">
                        <div>
                            <div class="profile-preview-title">${escapeHtml(snapshot.name)}</div>
                            <div class="profile-preview-role">${escapeHtml(snapshot.title || tr('profile-no-title'))}</div>
                        </div>
                        <div class="profile-preview-rating">
                            <span class="hint">${escapeHtml(tr('profile-rate-label'))}</span>
                            ${snapshot.rating}
                        </div>
                    </div>
                    <div class="lobby-profile-meta" style="margin-top:14px;">
                        <span class="profile-chip">${escapeHtml(getProfileModeLabel(snapshot.favoriteMode))}</span>
                        ${approvedStatus}
                    </div>
                    <div class="profile-viewer-copy">${escapeHtml(snapshot.bio || '')}</div>
                    ${links.length ? `
                        <div class="profile-link-stack">
                            ${links.map(link => `
                                <a class="profile-link-pill" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
                                    <span class="meta">
                                        <span class="title">${escapeHtml(link.label)}</span>
                                        <span class="url">${escapeHtml(link.url)}</span>
                                    </span>
                                    <span>↗</span>
                                </a>
                            `).join('')}
                        </div>
                    ` : `<div class="profile-link-empty">${escapeHtml(tr('profile-view-no-links'))}</div>`}
                </div>
                <div class="profile-viewer-actions">
                    ${relationshipButton}
                    <button class="btn" style="--accent:#ffaa33;" onclick="requestProfileChallenge(activeRemoteProfileSnapshot)">${escapeHtml(tr('profile-friend-challenge'))}</button>
                    <button class="btn" style="border-color:#888; color:#888;" onclick="closeRemoteProfileOverlay()">${escapeHtml(tr('common-close'))}</button>
                </div>
            `;
        }

        function openLobbyProfileByIndex(index) {
            if ((document.getElementById('game-view').style.display === 'flex') && (isOnline || window.partyModeInstance)) return;
            const snapshot = lobbyProfileSnapshots[index];
            if (!snapshot) return;
            openRemoteProfileOverlay(snapshot);
        }

        function openLobbyProfileBySlot(slotKey) {
            if ((document.getElementById('game-view').style.display === 'flex') && (isOnline || window.partyModeInstance)) return;
            const snapshot = lobbyProfileLookup[slotKey];
            if (!snapshot) return;
            openRemoteProfileOverlay(snapshot);
        }

        function requestProfileChallenge(snapshot) {
            const safeSnapshot = sanitizePublicProfileSnapshot(snapshot, snapshot && snapshot.name);
            if (!safeSnapshot.name || safeSnapshot.name === cfg.playerName) return;
            if (isBusyForChallenge()) {
                showToast(tr('toast-challenge-busy-self'));
                return;
            }
            hostChallengeRoom(safeSnapshot.name, safeSnapshot);
        }

        function setupIdentityConnection(connection) {
            connection.on('data', (data) => {
                if (!data || !data.type) return;
                const remoteName = String(data.name || '').trim().slice(0, 15);
                const remoteProfile = sanitizePublicProfileSnapshot(data.profile, remoteName || 'PLAYER');
                if (remoteName && friendsStore.approved[remoteName]) {
                    upsertFriendRecord('approved', remoteName, remoteProfile, { updatedAt: Date.now() });
                }
                if (data.type === 'presence_ping') {
                    connection.send({
                        type: 'presence_pong',
                        name: cfg.playerName || 'PLAYER',
                        state: getCurrentPresenceState(),
                        profile: buildPublicProfileSnapshot()
                    });
                } else if (data.type === 'friend_request') {
                    handleIncomingFriendRequest(remoteName, remoteProfile, connection);
                } else if (data.type === 'challenge_request') {
                    if (isBusyForChallenge()) {
                        if (connection.open) {
                            connection.send({ type: 'challenge_response', accepted: false, reason: 'busy', name: cfg.playerName || 'PLAYER', profile: buildPublicProfileSnapshot() });
                        }
                        return;
                    }
                    showConfirmToast(
                        trf('toast-challenge-received', { name: remoteName }),
                        () => {
                            if (connection && connection.open) {
                                connection.send({ type: 'challenge_response', accepted: true, roomCode: data.roomCode, name: cfg.playerName || 'PLAYER', profile: buildPublicProfileSnapshot() });
                            }
                            showToast(trf('toast-challenge-joining', { name: remoteName }));
                            joinRoomByCode(data.roomCode);
                        },
                        () => {
                            if (connection && connection.open) {
                                connection.send({ type: 'challenge_response', accepted: false, reason: 'declined', name: cfg.playerName || 'PLAYER', profile: buildPublicProfileSnapshot() });
                            }
                        },
                        { confirmText: tr('common-accept'), cancelText: tr('common-decline') }
                    );
                }
            });
        }

        function getProfileModeLabel(modeId) {
            const safeMode = PROFILE_FAVORITE_MODES.includes(modeId) ? modeId : 'solo';
            return tr(`profile-mode-${safeMode}`);
        }

        function getDisplayProfileLinks(profileSnapshot) {
            const safe = sanitizePublicProfileSnapshot(profileSnapshot, profileSnapshot && profileSnapshot.name);
            const links = [];
            if (safe.youtubeUrl) {
                links.push({ label: tr('profile-link-youtube'), url: safe.youtubeUrl });
            }
            safe.customLinks.forEach((link, index) => {
                if (!link.url) return;
                links.push({
                    label: link.label || `${tr('profile-link-custom')} ${index + 1}`,
                    url: link.url
                });
            });
            return links;
        }

        function truncateProfileText(text, limit = 92) {
            const normalized = String(text || '').trim();
            if (!normalized) return '';
            return normalized.length > limit ? `${normalized.slice(0, Math.max(0, limit - 1))}…` : normalized;
        }

        function syncProfileEditorFromState() {
            const safeProfile = sanitizePlayerProfile(playerProfile);
            const titleInput = document.getElementById('profile-title-input');
            const favoriteInput = document.getElementById('profile-favorite-mode');
            const bioInput = document.getElementById('profile-bio-input');
            const youtubeInput = document.getElementById('profile-youtube-input');
            if (titleInput) titleInput.value = safeProfile.title;
            if (favoriteInput) favoriteInput.value = safeProfile.favoriteMode;
            if (bioInput) bioInput.value = safeProfile.bio;
            if (youtubeInput) youtubeInput.value = safeProfile.youtubeUrl;
            for (let i = 0; i < PROFILE_LINK_COUNT; i++) {
                const labelInput = document.getElementById(`profile-link-label-${i}`);
                const urlInput = document.getElementById(`profile-link-url-${i}`);
                const link = safeProfile.customLinks[i] || { label: '', url: '' };
                if (labelInput) labelInput.value = link.label || '';
                if (urlInput) urlInput.value = link.url || '';
            }
        }

        function renderOwnProfilePreview(snapshot) {
            const safeSnapshot = sanitizePublicProfileSnapshot(snapshot, snapshot && snapshot.name);
            const preview = document.getElementById('profile-public-preview');
            if (preview) {
                preview.innerHTML = `
                    <div class="profile-preview-head">
                        <div>
                            <div class="profile-preview-title">${escapeHtml(safeSnapshot.name)}</div>
                            <div class="profile-preview-role">${escapeHtml(safeSnapshot.title || tr('profile-no-title'))}</div>
                        </div>
                        <div class="profile-preview-rating">
                            <span class="hint">${escapeHtml(tr('profile-rate-label'))}</span>
                            ${safeSnapshot.rating}
                        </div>
                    </div>
                    <div class="lobby-profile-meta" style="margin-top:14px;">
                        <span class="profile-chip">${escapeHtml(getProfileModeLabel(safeSnapshot.favoriteMode))}</span>
                    </div>
                    <div class="profile-preview-bio">${escapeHtml(safeSnapshot.bio || '')}</div>
                `;
            }

            const linksWrap = document.getElementById('profile-public-links');
            const links = getDisplayProfileLinks(safeSnapshot);
            if (linksWrap) {
                linksWrap.innerHTML = links.length
                    ? `<div class="profile-link-stack">${links.map(link => `
                        <a class="profile-link-pill" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
                            <span class="meta">
                                <span class="title">${escapeHtml(link.label)}</span>
                                <span class="url">${escapeHtml(link.url)}</span>
                            </span>
                            <span>↗</span>
                        </a>
                    `).join('')}</div>`
                    : `<div class="profile-link-empty">${escapeHtml(tr('profile-link-empty'))}</div>`;
            }
        }

        function renderOwnProfileScreen(syncEditor = false) {
            syncPlayerProfileSeason();
            if (syncEditor) syncProfileEditorFromState();
            const safeProfile = sanitizePlayerProfile(playerProfile);
            const snapshot = buildPublicProfileSnapshot();
            const nameDisplay = document.getElementById('profile-name-display');
            if (nameDisplay) nameDisplay.innerText = cfg.playerName || 'PLAYER';
            renderOwnProfilePreview(snapshot);

            const ratingEl = document.getElementById('profile-stat-rating');
            if (ratingEl) {
                ratingEl.innerHTML = `<span class="hint">${escapeHtml(tr('profile-rate-label'))}</span><span class="value">${safeProfile.rating}</span><span class="sub">${escapeHtml(tr('profile-rate-sub'))}</span>`;
            }
            const peakEl = document.getElementById('profile-stat-peak');
            if (peakEl) {
                peakEl.innerHTML = `<span class="hint">${escapeHtml(tr('profile-peak-label'))}</span><span class="value">${safeProfile.peakRating}</span><span class="sub">${escapeHtml(tr('profile-peak-sub'))}</span>`;
            }
            const seasonEl = document.getElementById('profile-stat-season');
            if (seasonEl) {
                seasonEl.innerHTML = `<span class="hint">${escapeHtml(`${tr('profile-season-label')} ${safeProfile.seasonId || '--'}`)}</span><span class="value">${safeProfile.seasonBest}</span><span class="sub">${safeProfile.seasonWins}W - ${safeProfile.seasonLosses}L<br>${escapeHtml(tr('profile-season-sub'))}</span>`;
            }
            const totalEl = document.getElementById('profile-stat-total');
            if (totalEl) {
                totalEl.innerHTML = `<span class="hint">${escapeHtml(tr('profile-total-label'))}</span><span class="value">${safeProfile.totalWins}W-${safeProfile.totalLosses}L</span><span class="sub">${escapeHtml(tr('profile-total-sub'))}</span>`;
            }
            renderFriendLists();
        }

        function previewProfileDraft() {
            const previewProfile = sanitizePlayerProfile({
                ...playerProfile,
                ...collectProfileDraftFromEditor()
            });
            renderOwnProfilePreview(sanitizePublicProfileSnapshot({
                name: cfg.playerName || 'PLAYER',
                title: previewProfile.title,
                bio: previewProfile.bio,
                favoriteMode: previewProfile.favoriteMode,
                rating: playerProfile.rating,
                youtubeUrl: previewProfile.youtubeUrl,
                customLinks: previewProfile.customLinks
            }, cfg.playerName || 'PLAYER'));
        }

        function collectProfileDraftFromEditor() {
            return {
                title: (document.getElementById('profile-title-input') || {}).value || '',
                favoriteMode: (document.getElementById('profile-favorite-mode') || {}).value || 'solo',
                bio: (document.getElementById('profile-bio-input') || {}).value || '',
                youtubeUrl: (document.getElementById('profile-youtube-input') || {}).value || '',
                customLinks: Array.from({ length: PROFILE_LINK_COUNT }, (_, index) => ({
                    label: (document.getElementById(`profile-link-label-${index}`) || {}).value || '',
                    url: (document.getElementById(`profile-link-url-${index}`) || {}).value || ''
                }))
            };
        }

        function saveProfileEditor() {
            playerProfile = sanitizePlayerProfile({
                ...playerProfile,
                ...collectProfileDraftFromEditor()
            });
            savePlayerProfile();
            renderOwnProfileScreen(true);
            updateProfileUI();
            showToast(cfg.lang === 'ja' ? 'プロフィールを保存しました' : 'Profile saved.');
        }

        function showProfileMenu() {
            if (blockAdminRestrictedAction()) return;
            closeRemoteProfileOverlay();
            document.getElementById('main-menu-btns').style.display = 'none';
            document.getElementById('solo-menu').style.display = 'none';
            document.getElementById('tutorial-menu').style.display = 'none';
            document.getElementById('online-menu').style.display = 'none';
            document.getElementById('room-settings-menu').style.display = 'none';
            document.getElementById('online-lobby').style.display = 'none';
            document.getElementById('quick-match-lobby').style.display = 'none';
            document.getElementById('template-menu').style.display = 'none';
            document.getElementById('mode-select-menu').style.display = 'none';
            document.getElementById('replay-menu').style.display = 'none';
            document.getElementById('profile-menu').style.display = 'block';
            renderOwnProfileScreen(true);
            startFriendPresenceMonitor();
        }

        function hideProfileMenu() {
            const profileMenu = document.getElementById('profile-menu');
            if (profileMenu) profileMenu.style.display = 'none';
            stopFriendPresenceMonitor();
            updateTutorialEntryUI();
        }

        function renderProfilePlaceholderCard() {
            return `
                <div class="lobby-profile-card placeholder">
                    <div class="lobby-profile-name">---</div>
                    <div class="lobby-profile-bio">${escapeHtml(tr('profile-waiting'))}</div>
                </div>
            `;
        }

        function renderLobbyProfileCard(profileSnapshot, slotKey, isSelf = false) {
            if (!profileSnapshot) return renderProfilePlaceholderCard();
            const safe = sanitizePublicProfileSnapshot(profileSnapshot, profileSnapshot.name);
            lobbyProfileLookup[slotKey] = safe;
            const links = getDisplayProfileLinks(safe);
            const expanded = !!lobbyProfileExpansionState[slotKey];
            const previewBio = expanded ? (safe.bio || '') : truncateProfileText(safe.bio || '', 90);
            const shouldShowToggle = links.length > 0 || (safe.bio || '').length > 90;
            const chips = [
                `<span class="profile-chip">${escapeHtml(getProfileModeLabel(safe.favoriteMode))}</span>`
            ];
            if (isSelf) chips.unshift(`<span class="profile-chip">${escapeHtml(tr('profile-self-chip'))}</span>`);
            return `
                <div class="lobby-profile-card">
                    <div class="lobby-profile-head">
                        <div>
                            <button class="profile-name-hit lobby-profile-name" onclick="openLobbyProfileBySlot('${slotKey}')">${escapeHtml(safe.name)}</button>
                            <div class="lobby-profile-tagline">${escapeHtml(safe.title || tr('profile-no-title'))}</div>
                        </div>
                        <div class="lobby-profile-rating">
                            <span class="hint">${escapeHtml(tr('profile-rate-label'))}</span>
                            ${safe.rating}
                        </div>
                    </div>
                    <div class="lobby-profile-meta">${chips.join('')}</div>
                    <div class="lobby-profile-bio">${escapeHtml(previewBio || '')}</div>
                    ${shouldShowToggle ? `<button class="lobby-profile-toggle" onclick="toggleLobbyProfileDetails('${slotKey}')">${escapeHtml(expanded ? tr('profile-hide-details') : tr('profile-show-details'))}</button>` : ''}
                    ${expanded && links.length ? `<div class="lobby-profile-links">${links.map(link => `
                        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
                            <div class="lobby-profile-label">${escapeHtml(link.label)}</div>
                            <div>${escapeHtml(link.url)}</div>
                        </a>
                    `).join('')}</div>` : ''}
                </div>
            `;
        }

        function toggleLobbyProfileDetails(slotKey) {
            lobbyProfileExpansionState[slotKey] = !lobbyProfileExpansionState[slotKey];
            renderLobbyProfilePanels();
            renderQuickMatchProfilePanels();
        }

        function renderLobbyProfilePanels() {
            const container = document.getElementById('lobby-profile-grid');
            if (!container) return;
            lobbyProfileLookup = {};
            const totalSlots = Math.max(targetPartyCount || 2, 2);
            const cards = [];
            for (let i = 0; i < totalSlots; i++) {
                const snapshot = lobbyProfileSnapshots[i] || null;
                const isSelf = !!snapshot && ((isHost && i === 0) || snapshot.name === cfg.playerName);
                cards.push(renderLobbyProfileCard(snapshot, `room-${i}`, isSelf));
            }
            container.innerHTML = cards.join('');
        }

        function renderQuickMatchProfilePanels() {
            const container = document.getElementById('qm-profile-grid');
            if (!container) return;
            if (!isQuickMatch) {
                container.innerHTML = '';
                return;
            }
            lobbyProfileLookup = {};
            const cards = [];
            const availableSnapshots = lobbyProfileSnapshots.filter(Boolean);
            if (!availableSnapshots.length) {
                cards.push(renderLobbyProfileCard(buildPublicProfileSnapshot(), 'qm-self', true));
            } else {
                availableSnapshots.forEach((snapshot, index) => {
                    const isSelf = (isHost && index === 0) || snapshot.name === cfg.playerName;
                    cards.push(renderLobbyProfileCard(snapshot, `qm-${index}`, isSelf));
                });
            }
            container.innerHTML = cards.join('');
        }

        function resetLobbyProfileState() {
            lobbyProfileSnapshots = [];
            lobbyProfileExpansionState = {};
            lobbyProfileLookup = {};
            const roomGrid = document.getElementById('lobby-profile-grid');
            const qmGrid = document.getElementById('qm-profile-grid');
            if (roomGrid) roomGrid.innerHTML = '';
            if (qmGrid) qmGrid.innerHTML = '';
        }

        function applyLobbyNameList(names = []) {
            document.getElementById('lobby-p1-name').innerText = names[0] || '---';
            document.getElementById('lobby-p2-name').innerText = names[1] || '---';
            document.getElementById('lobby-p3-name').innerText = names[2] || '---';
            document.getElementById('lobby-p4-name').innerText = names[3] || '---';
        }

        function sanitizePartyRole(role) {
            return role === 'spectator' ? 'spectator' : 'player';
        }

        function sanitizePartyTeam(team) {
            return team === 'B' ? 'B' : 'A';
        }

        function syncPartyLobbyRoleControls() {
            for (let i = 0; i < 4; i++) {
                const roleInput = document.getElementById(`lobby-role-${i}`);
                const teamInput = document.getElementById(`lobby-team-${i}`);
                if (roleInput) {
                    roleInput.value = sanitizePartyRole(partySlotRoles[i]);
                    roleInput.disabled = !isHost || isQuickMatch || !onlineRoomRules.allowSpectators;
                }
                if (teamInput) {
                    teamInput.value = sanitizePartyTeam(partySlotTeams[i]);
                    teamInput.disabled = !isHost || isQuickMatch;
                }
            }
        }

        function broadcastLobbyState() {
            if (!isHost || isQuickMatch) return;
            const lobbyNames = buildLobbyNameList();
            lobbyProfileSnapshots = buildLobbyProfileList();
            partyClients.forEach(c => {
                if (c && c.open) c.send({ type: 'lobby_update', names: lobbyNames, profiles: lobbyProfileSnapshots, roles: partySlotRoles, teams: partySlotTeams, roomRules: onlineRoomRules });
            });
            applyLobbyNameList(lobbyNames);
            renderLobbyProfilePanels();
            syncPartyLobbyRoleControls();
        }

        function updatePartyLobbyRole(index) {
            if (!isHost || index < 0 || index >= 4) return;
            const roleInput = document.getElementById(`lobby-role-${index}`);
            const teamInput = document.getElementById(`lobby-team-${index}`);
            partySlotRoles[index] = sanitizePartyRole(roleInput ? roleInput.value : partySlotRoles[index]);
            partySlotTeams[index] = sanitizePartyTeam(teamInput ? teamInput.value : partySlotTeams[index]);
            if (!onlineRoomRules.allowSpectators) partySlotRoles[index] = 'player';
            broadcastLobbyState();
        }

        function buildLobbyNameList() {
            const names = [cfg.playerName || 'PLAYER'];
            partyClients.forEach(client => names.push(client.peerName || '---'));
            while (names.length < Math.max(targetPartyCount || 2, 2)) names.push('---');
            return names;
        }

        function buildLobbyProfileList() {
            const profiles = [buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')];
            partyClients.forEach(client => profiles.push(client.peerProfile || sanitizePublicProfileSnapshot(null, client.peerName || '---')));
            while (profiles.length < Math.max(targetPartyCount || 2, 2)) profiles.push(null);
            return profiles;
        }

        function refreshLocalLobbySnapshot() {
            if (!lobbyProfileSnapshots.length) return;
            const localSnapshot = buildPublicProfileSnapshot(cfg.playerName || 'PLAYER');
            if (isQuickMatch) {
                if (isHost) {
                    lobbyProfileSnapshots[0] = localSnapshot;
                } else {
                    const selfIndex = lobbyProfileSnapshots.findIndex(snapshot => snapshot && snapshot.name === cfg.playerName);
                    lobbyProfileSnapshots[selfIndex >= 0 ? selfIndex : 1] = localSnapshot;
                }
                return;
            }
            if (isHost) {
                lobbyProfileSnapshots[0] = localSnapshot;
                return;
            }
            const selfIndex = lobbyProfileSnapshots.findIndex(snapshot => snapshot && snapshot.name === cfg.playerName);
            lobbyProfileSnapshots[selfIndex >= 0 ? selfIndex : 1] = localSnapshot;
        }

        function clearQuickMatchRetryTimeout() {
            if (quickMatchRetryTimeout) {
                clearTimeout(quickMatchRetryTimeout);
                quickMatchRetryTimeout = null;
            }
        }

        function generateClientPeerId(prefix = 'TETRIS-CLIENT') {
            const stamp = Date.now().toString(36);
            const rand = Math.random().toString(36).slice(2, 12);
            return `${prefix}-${stamp}-${rand}`.replace(/[^a-zA-Z0-9_-]/g, '0');
        }

        function createPeerInstance(id = undefined, overrides = {}) {
            const options = {
                ...PEER_BASE_OPTIONS,
                ...overrides,
                config: {
                    ...PEER_BASE_OPTIONS.config,
                    ...(overrides.config || {})
                }
            };
            return id !== undefined ? new Peer(id, options) : new Peer(options);
        }

        function suspendIdentityReservation(force = false) {
            if (!identityPeer || !force) return;
            const reservedPeer = identityPeer;
            identityPeer = null;
            try {
                reservedPeer.destroy();
            } catch (err) {
                console.warn('Failed to release identity peer:', err);
            }
        }

        function resumeIdentityReservation() {
            if (!cfg.hasCompletedTutorial || !cfg.playerName || identityPeer) return;
            try {
                const reservedPeer = createPeerInstance(getIdentityPeerId(cfg.playerName), { debug: 0 });
                identityPeer = reservedPeer;
                bindIdentityPeerHandlers(reservedPeer);
            } catch (err) {
                console.warn('Failed to reserve identity peer:', err);
                identityPeer = null;
            }
        }

        function tr(key, lang = cfg.lang) {
            const base = TRANSLATIONS.en || {};
            const pack = TRANSLATIONS[lang] || base;
            return pack[key] || base[key] || key;
        }

        function trf(key, vars = {}, lang = cfg.lang) {
            let text = tr(key, lang);
            Object.keys(vars || {}).forEach((token) => {
                text = text.replace(new RegExp(`\\{${token}\\}`, 'g'), String(vars[token]));
            });
            return text;
        }

        function setLang(l) {
            cfg.lang = TRANSLATIONS[l] ? l : 'en';
            document.documentElement.lang = cfg.lang === 'zh' ? 'zh-CN' : cfg.lang;
            document.querySelectorAll('[data-tr]').forEach(el => {
                const key = el.getAttribute('data-tr');
                el.innerText = tr(key, cfg.lang);
            });
            document.querySelectorAll('[data-tr-placeholder]').forEach(el => {
                const key = el.getAttribute('data-tr-placeholder');
                el.setAttribute('placeholder', tr(key, cfg.lang));
            });
            document.querySelectorAll('[data-tr-title]').forEach(el => {
                const key = el.getAttribute('data-tr-title');
                const translated = tr(key, cfg.lang);
                el.setAttribute('title', translated);
                el.setAttribute('aria-label', translated);
            });
            updateUIFromCfg();
            renderOwnProfileScreen();
            renderFriendLists();
            renderLobbyProfilePanels();
            renderQuickMatchProfilePanels();
            renderRemoteProfileOverlay();
            updateQuickMatchReadyUI();
            if (replayArchiveListCache.length || document.getElementById('replay-menu').style.display === 'block') {
                renderReplayArchiveList();
            }
            if (pendingMatchSummary && document.getElementById('match-summary-overlay').style.display === 'flex') {
                renderMatchSummary(pendingMatchSummary);
            }
            updateReplayStatusLabel();
            updateOnlineLobbyExitButton();
            saveCfg();
        }

        function openTab(evt, tabName) {
            let contents = document.getElementsByClassName("tab-content");
            for (let c of contents) c.style.display = "none";
            let tabs = document.getElementsByClassName("tab-btn");
            for (let t of tabs) t.className = t.className.replace(" active", "");
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }

        function getCurrentSeasonId() {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            return `${now.getFullYear()}-${month}`;
        }

        function syncPlayerProfileSeason() {
            playerProfile = sanitizePlayerProfile(playerProfile);
            const seasonId = getCurrentSeasonId();
            if (playerProfile.seasonId === seasonId) return;
            playerProfile.seasonId = seasonId;
            playerProfile.seasonBest = playerProfile.rating;
            playerProfile.seasonWins = 0;
            playerProfile.seasonLosses = 0;
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(playerProfile));
        }

        function savePlayerProfile() {
            playerProfile = sanitizePlayerProfile(playerProfile);
            syncPlayerProfileSeason();
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(playerProfile));
        }

        function updateProfileUI() {
            syncPlayerProfileSeason();
            refreshLocalLobbySnapshot();
            renderOwnProfileScreen();
            renderLobbyProfilePanels();
            renderQuickMatchProfilePanels();
            renderRemoteProfileOverlay();
            updateSoloMenuMeta();
        }

        function ensureSoloLeaderboards() {
            Object.keys(SOLO_MODE_DEFS).forEach(modeId => {
                if (!Array.isArray(soloLeaderboards[modeId])) soloLeaderboards[modeId] = [];
            });
        }

        function saveSoloLeaderboards() {
            ensureSoloLeaderboards();
            localStorage.setItem(SOLO_LEADERBOARD_STORAGE_KEY, JSON.stringify(soloLeaderboards));
        }

        function getSoloModeDef(modeId = currentSoloModeId) {
            return SOLO_MODE_DEFS[modeId] || null;
        }

        function getSoloModeLabel(modeId = currentSoloModeId) {
            const mode = getSoloModeDef(modeId);
            if (!mode) return cfg.lang === 'ja' ? 'ソロプレイ' : 'SOLO PLAY';
            return mode.label[cfg.lang] || mode.label.en;
        }

        function formatSoloRecordValue(modeId, entry) {
            if (!entry) return '--';
            const mode = getSoloModeDef(modeId);
            if (!mode) return '--';
            if (mode.storageMetric === 'time') return formatReplayTime(entry.timeMs || 0);
            return `${entry.score || 0} PTS`;
        }

        function compareSoloLeaderboardEntries(modeId, a, b) {
            const mode = getSoloModeDef(modeId);
            if (!mode) return 0;
            if (mode.storageMetric === 'time') {
                return (a.timeMs || Number.MAX_SAFE_INTEGER) - (b.timeMs || Number.MAX_SAFE_INTEGER)
                    || (b.score || 0) - (a.score || 0)
                    || (a.createdAt || 0) - (b.createdAt || 0);
            }
            return (b.score || 0) - (a.score || 0)
                || (b.lines || 0) - (a.lines || 0)
                || (a.createdAt || 0) - (b.createdAt || 0);
        }

        function updateSoloMenuMeta() {
            ensureSoloLeaderboards();
            Object.keys(SOLO_MODE_DEFS).forEach(modeId => {
                const el = document.getElementById(`solo-meta-${modeId}`);
                if (!el) return;
                const best = (soloLeaderboards[modeId] || []).slice().sort((a, b) => compareSoloLeaderboardEntries(modeId, a, b))[0];
                const prefix = cfg.lang === 'ja' ? 'BEST' : 'BEST';
                el.innerText = `${prefix} ${formatSoloRecordValue(modeId, best)}`;
            });
        }

        function getSoloModeLiveSnapshot(board = p1) {
            if (!board) return null;
            return {
                name: cfg.playerName || 'PLAYER 1',
                score: board.player.score || 0,
                lines: board.player.lines || 0,
                timeMs: board.player.time || 0,
                createdAt: Date.now(),
                isCurrent: true
            };
        }

        function commitSoloLeaderboardResult(modeId, entry) {
            const mode = getSoloModeDef(modeId);
            if (!mode || !entry) return;
            ensureSoloLeaderboards();
            const nextEntries = [...soloLeaderboards[modeId], entry]
                .sort((a, b) => compareSoloLeaderboardEntries(modeId, a, b))
                .slice(0, mode.maxEntries || 20);
            soloLeaderboards[modeId] = nextEntries;
            saveSoloLeaderboards();
            updateSoloMenuMeta();
        }

        function renderSoloRankingRows(modeId, currentEntry = null) {
            const list = document.getElementById('solo-ranking-list');
            if (!list) return;
            ensureSoloLeaderboards();
            const baseEntries = (soloLeaderboards[modeId] || []).map(entry => ({ ...entry, isCurrent: false }));
            const combined = currentEntry ? [...baseEntries, currentEntry] : baseEntries;
            const sorted = combined.sort((a, b) => compareSoloLeaderboardEntries(modeId, a, b));
            const currentIndex = sorted.findIndex(entry => entry.isCurrent);
            let rows = sorted.slice(0, 8);
            if (currentIndex >= 8 && currentIndex >= 0) {
                rows = [...rows, { ellipsis: true }, sorted[currentIndex]];
            }
            if (!rows.length) {
                list.innerHTML = `<div class="solo-ranking-row"><span class="rank">--</span><span class="name">${cfg.lang === 'ja' ? 'まだ記録がありません' : 'No records yet'}</span><span class="score">--</span></div>`;
                return;
            }
            list.innerHTML = rows.map((entry, index) => {
                if (entry.ellipsis) return `<div style="text-align:center; color:#8ea6b6; font-size:12px;">...</div>`;
                const rank = sorted.indexOf(entry) + 1;
                const pointer = entry.isCurrent ? `<span class="solo-ranking-pointer">${cfg.lang === 'ja' ? '⇦ あなた' : '⇦ YOU'}</span>` : '';
                return `
                    <div class="solo-ranking-row${entry.isCurrent ? ' self' : ''}">
                        <span class="rank">#${rank}</span>
                        <span class="name">${escapeHtml(entry.name || 'PLAYER')}</span>
                        <span class="score">${modeId === 'ranking' ? `${entry.score || 0}` : formatSoloRecordValue(modeId, entry)} ${pointer}</span>
                    </div>
                `;
            }).join('');
        }

        function syncSoloStatusPanel(forceHide = false) {
            const panel = document.getElementById('solo-status-panel');
            const titleEl = document.getElementById('solo-status-title');
            const primaryEl = document.getElementById('solo-status-primary');
            const secondaryEl = document.getElementById('solo-status-secondary');
            if (!panel || !titleEl || !primaryEl || !secondaryEl) return;
            const mode = getSoloModeDef();
            const inSoloRun = !forceHide && !!(mode && p1 && !cpu && !isOnline && !window.partyModeInstance && !isReplayPlayback);
            if (!inSoloRun) {
                panel.style.display = 'none';
                document.getElementById('solo-ranking-list').innerHTML = '';
                return;
            }
            panel.style.display = 'block';
            titleEl.innerText = getSoloModeLabel(mode.id).toUpperCase();
            if (mode.isEndless) {
                primaryEl.innerText = `${p1.player.lines || 0} LINES`;
                secondaryEl.innerText = `SCORE ${p1.player.score || 0} / TIME ${formatReplayTime(p1.player.time || 0)}`;
                renderSoloRankingRows(mode.id, getSoloModeLiveSnapshot(p1));
            } else if (mode.id === 'ranking') {
                primaryEl.innerText = `${p1.player.score || 0} PTS`;
                secondaryEl.innerText = cfg.lang === 'ja'
                    ? `${p1.player.lines || 0} LINES / ${formatReplayTime(p1.player.time || 0)}`
                    : `${p1.player.lines || 0} LINES / ${formatReplayTime(p1.player.time || 0)}`;
                renderSoloRankingRows(mode.id, getSoloModeLiveSnapshot(p1));
            } else {
                primaryEl.innerText = `${p1.player.lines || 0} / ${mode.lineTarget}`;
                secondaryEl.innerText = cfg.lang === 'ja'
                    ? `TIME ${formatReplayTime(p1.player.time || 0)} / GOAL ${mode.lineTarget} LINES`
                    : `TIME ${formatReplayTime(p1.player.time || 0)} / GOAL ${mode.lineTarget} LINES`;
                renderSoloRankingRows(mode.id, null);
            }
        }

        function finalizeSoloModeResult(board, completed = false) {
            const mode = getSoloModeDef();
            if (!mode || !board || board !== p1) return;
            if (mode.id === 'ranking' || mode.isEndless) {
                commitSoloLeaderboardResult(mode.id, getSoloModeLiveSnapshot(board));
                return;
            }
            if (completed && mode.lineTarget && (board.player.lines || 0) >= mode.lineTarget) {
                commitSoloLeaderboardResult(mode.id, {
                    name: cfg.playerName || 'PLAYER 1',
                    score: board.player.score || 0,
                    lines: board.player.lines || 0,
                    timeMs: board.player.time || 0,
                    createdAt: Date.now()
                });
            }
        }

        function completeSoloMode(board) {
            const mode = getSoloModeDef();
            if (!mode || !board || board.isGameOver) return;
            board.isGameOver = true;
            finalizeSoloModeResult(board, true);
            board.updateUI();
            syncSoloStatusPanel();
            captureReplayFrame(performance.now(), true);
            queueMatchSummary('victory', 'solo');
            const doneMessage = cfg.lang === 'ja'
                ? `${getSoloModeLabel(mode.id)} クリア！`
                : `${getSoloModeLabel(mode.id)} cleared!`;
            showToast(doneMessage);
            setTimeout(() => returnToMenu(), 3000);
        }

        window.addEventListener('message', event => {
            const data = event.data || {};
            if (!data || data.source !== ADMIN_PANEL_SOURCE || data.type !== 'admin-command') return;
            if (!adminControlEnabled || event.source !== window.parent || data.token !== adminSessionToken) return;
            executeAdminCommand(data.command, data.payload || {});
        });

        function getMatchModeLabel(mode, subMode = null) {
            const labels = {
                solo: tr('profile-mode-solo'),
                cpu: tr('profile-mode-cpu'),
                online: tr('profile-mode-online'),
                party: tr('replay-mode-party')
            };
            if (mode === 'solo' && subMode) return getSoloModeLabel(subMode);
            return labels[mode] || mode;
        }

        function cloneReplayValue(value) {
            return value == null ? value : JSON.parse(JSON.stringify(value));
        }

        function getReplayNameList(count, myIndex = 0) {
            return Array.from({ length: count }, (_, i) => i === myIndex ? (cfg.playerName || `PLAYER ${i + 1}`) : `PLAYER ${i + 1}`);
        }

        function spawnActionText(actionLayer, txt, left = '', top = '', lifetimeMs = 1000) {
            if (!actionLayer || !txt) return;
            const el = document.createElement('div');
            el.className = 'action-text';
            el.innerText = txt;
            if (left) el.style.left = left;
            if (top) el.style.top = top;
            actionLayer.appendChild(el);
            setTimeout(() => el.remove(), Math.max(60, lifetimeMs || 1000));
            return el;
        }

        function getReplayActionTargetForBoard(board) {
            if (!board) return null;
            if (board === window.partyModeInstance) return 'party';
            if (board === p1) return 'p1';
            if (board === cpu) return 'cpu';
            if (typeof board.networkId === 'number') return `opp:${board.networkId}`;
            return null;
        }

        function resolveReplayActionLayer(target) {
            if (!target) return null;
            if (target === 'party') return window.partyModeInstance ? window.partyModeInstance.actionLayer : null;
            if (target === 'p1') return p1 ? p1.actionLayer : null;
            if (target === 'cpu') return cpu ? cpu.actionLayer : null;
            if (typeof target === 'string' && target.startsWith('opp:')) {
                const networkId = parseInt(target.slice(4), 10);
                const opp = opponents.find(board => board.networkId === networkId);
                return opp ? opp.actionLayer : null;
            }
            return null;
        }

        function pushReplayActionEvent(target, txt, timestamp = performance.now(), options = {}) {
            if (!activeMatchSession || !target || !txt) return;
            if (!activeMatchSession.replayActions) activeMatchSession.replayActions = [];
            const replay = activeMatchSession.replay;
            const startedAt = replay && typeof replay.startedAt === 'number' ? replay.startedAt : timestamp;
            activeMatchSession.replayActions.push({
                at: Math.max(0, Math.round(timestamp - startedAt)),
                target,
                text: String(txt),
                left: options.left || '',
                top: options.top || ''
            });
        }

        function recordBoardReplayAction(board, txt, timestamp = performance.now(), options = {}) {
            const target = getReplayActionTargetForBoard(board);
            if (!target) return;
            pushReplayActionEvent(target, txt, timestamp, options);
        }

        function pushReplayInputEvent(kind, key, matchedKey, timestamp = performance.now()) {
            if (!activeMatchSession || isReplayPlayback) return;
            if (!activeMatchSession.replayInputs) activeMatchSession.replayInputs = [];
            const replay = activeMatchSession.replay;
            const startedAt = replay && typeof replay.startedAt === 'number' ? replay.startedAt : timestamp;
            activeMatchSession.replayInputs.push({
                at: Math.max(0, Math.round(timestamp - startedAt)),
                kind,
                key: String(key || ''),
                matchedKey: String(matchedKey || key || '')
            });
        }

        function maybeBroadcastOnlineActionText(board, txt) {
            if (!txt || !isOnline || !isStandardOnlineMatch() || isReplayPlayback) return false;
            const senderId = board && typeof board.networkId === 'number' ? board.networkId : onlineMyIndex;
            const payload = { type: 'action_text', fromId: senderId, text: String(txt) };
            if (isHost && !isQuickMatch) {
                let sent = false;
                partyClients.forEach(client => {
                    if (!client || !client.open) return;
                    try {
                        client.send(payload);
                        sent = true;
                    } catch (err) {
                        console.warn('Failed to broadcast action text:', err);
                    }
                });
                return sent;
            }
            if (conn && conn.open) {
                try {
                    conn.send(payload);
                    return true;
                } catch (err) {
                    console.warn('Failed to send action text:', err);
                }
            }
            return false;
        }

        function handleRemoteOnlineActionText(playerId, txt) {
            const normalizedId = normalizeNetworkId(playerId);
            if (normalizedId === null || normalizedId === onlineMyIndex || !txt) return;
            const targetBoard = opponents.find(board => board.networkId === normalizedId)
                || (cpu && cpu.isNetworkPlayer && cpu.networkId === normalizedId ? cpu : null);
            if (!targetBoard) return;
            spawnActionText(targetBoard.actionLayer, txt);
            recordBoardReplayAction(targetBoard, txt);
        }

        function playReplayActionsUntil(elapsedMs) {
            if (!replayPlayback || !replayPlayback.data) return;
            const events = replayPlayback.data.events || [];
            if (typeof replayPlayback.eventIndex !== 'number') replayPlayback.eventIndex = -1;
            while (replayPlayback.eventIndex + 1 < events.length && (events[replayPlayback.eventIndex + 1].at || 0) <= elapsedMs) {
                replayPlayback.eventIndex++;
                const event = events[replayPlayback.eventIndex];
                spawnActionText(resolveReplayActionLayer(event.target), event.text, event.left || '', event.top || '');
            }
        }

        function normalizeReplayCode(value) {
            return String(value || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
        }

        function buildReplaySharePeerId(code) {
            const normalized = normalizeReplayCode(code).toUpperCase();
            return normalized ? `${REPLAY_SHARE_PEER_PREFIX}${normalized}` : '';
        }

        function indexedDbRequestToPromise(request) {
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
            });
        }

        function indexedDbTransactionToPromise(transaction) {
            return new Promise((resolve, reject) => {
                transaction.oncomplete = () => resolve();
                transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed'));
                transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted'));
            });
        }

        function openReplayArchiveDb() {
            if (replayArchiveDbPromise) return replayArchiveDbPromise;
            replayArchiveDbPromise = new Promise((resolve, reject) => {
                if (typeof indexedDB === 'undefined') {
                    reject(new Error('IndexedDB is not available'));
                    return;
                }
                const request = indexedDB.open(REPLAY_ARCHIVE_DB_NAME, 1);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(REPLAY_ARCHIVE_STORE)) {
                        const store = db.createObjectStore(REPLAY_ARCHIVE_STORE, { keyPath: 'codeKey' });
                        store.createIndex('createdAt', 'createdAt', { unique: false });
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error || new Error('Failed to open replay archive'));
            });
            return replayArchiveDbPromise;
        }

        function createReplayCodeCandidate() {
            const first = REPLAY_CODE_WORDS_A[Math.floor(Math.random() * REPLAY_CODE_WORDS_A.length)];
            const second = REPLAY_CODE_WORDS_B[Math.floor(Math.random() * REPLAY_CODE_WORDS_B.length)];
            const useThird = Math.random() < 0.38;
            const third = useThird ? REPLAY_CODE_WORDS_C[Math.floor(Math.random() * REPLAY_CODE_WORDS_C.length)] : '';
            const digitsLength = 4 + Math.floor(Math.random() * 3);
            const max = 10 ** digitsLength;
            const digits = Math.floor(Math.random() * max).toString().padStart(digitsLength, '0');
            return `${first}${second}${third}${digits}`;
        }

        async function deleteReplayArchiveKeys(keys) {
            if (!keys.length) return;
            const db = await openReplayArchiveDb();
            const tx = db.transaction(REPLAY_ARCHIVE_STORE, 'readwrite');
            const store = tx.objectStore(REPLAY_ARCHIVE_STORE);
            keys.forEach(key => {
                if (key) store.delete(key);
            });
            await indexedDbTransactionToPromise(tx);
            keys.forEach(key => closeReplaySharePeer(key));
        }

        async function listAllReplayArchiveEntriesRaw() {
            const db = await openReplayArchiveDb();
            const tx = db.transaction(REPLAY_ARCHIVE_STORE, 'readonly');
            const store = tx.objectStore(REPLAY_ARCHIVE_STORE);
            const entries = await indexedDbRequestToPromise(store.getAll());
            await indexedDbTransactionToPromise(tx);
            return Array.isArray(entries) ? entries : [];
        }

        async function getReplayArchiveEntries() {
            const allEntries = await listAllReplayArchiveEntriesRaw();
            const cutoff = Date.now() - REPLAY_ARCHIVE_RETENTION_MS;
            const expiredKeys = [];
            const activeEntries = [];
            allEntries.forEach(entry => {
                const createdAt = typeof entry.createdAt === 'number' ? entry.createdAt : 0;
                if (createdAt >= cutoff) activeEntries.push(entry);
                else if (entry.codeKey) expiredKeys.push(entry.codeKey);
            });
            if (expiredKeys.length) await deleteReplayArchiveKeys(expiredKeys);
            activeEntries.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            return activeEntries;
        }

        async function listReplayArchiveEntries() {
            const entries = await getReplayArchiveEntries();
            syncReplaySharePeers(entries);
            return entries;
        }

        async function replayArchiveCodeExists(codeKey) {
            if (!codeKey) return false;
            const db = await openReplayArchiveDb();
            const tx = db.transaction(REPLAY_ARCHIVE_STORE, 'readonly');
            const store = tx.objectStore(REPLAY_ARCHIVE_STORE);
            const entry = await indexedDbRequestToPromise(store.get(codeKey));
            await indexedDbTransactionToPromise(tx);
            return !!entry;
        }

        async function generateUniqueReplayCode(maxAttempts = 40) {
            for (let i = 0; i < maxAttempts; i++) {
                const code = createReplayCodeCandidate();
                const codeKey = normalizeReplayCode(code);
                if (!codeKey) continue;
                if (!(await replayArchiveCodeExists(codeKey))) return code;
            }
            const fallbackNumber = Date.now().toString().slice(-6);
            return `ReplayWindow${fallbackNumber}`;
        }

        async function getReplayArchiveEntryByCode(code) {
            const codeKey = normalizeReplayCode(code);
            if (!codeKey) return null;
            const db = await openReplayArchiveDb();
            const tx = db.transaction(REPLAY_ARCHIVE_STORE, 'readonly');
            const store = tx.objectStore(REPLAY_ARCHIVE_STORE);
            const entry = await indexedDbRequestToPromise(store.get(codeKey));
            await indexedDbTransactionToPromise(tx);
            if (!entry) return null;
            const cutoff = Date.now() - REPLAY_ARCHIVE_RETENTION_MS;
            if ((entry.createdAt || 0) < cutoff) {
                await deleteReplayArchiveKeys([codeKey]);
                return null;
            }
            return entry;
        }

        async function saveReplayArchiveEntry(entry) {
            if (!entry || !entry.replayData || !entry.replayData.frames || entry.replayData.frames.length < 2) return null;
            const normalizedEntry = cloneReplayValue(entry);
            normalizedEntry.codeKey = normalizeReplayCode(normalizedEntry.code);
            if (!normalizedEntry.codeKey) return null;
            normalizedEntry.createdAt = typeof normalizedEntry.createdAt === 'number' ? normalizedEntry.createdAt : Date.now();
            normalizedEntry.savedAt = Date.now();
            const db = await openReplayArchiveDb();
            const tx = db.transaction(REPLAY_ARCHIVE_STORE, 'readwrite');
            tx.objectStore(REPLAY_ARCHIVE_STORE).put(normalizedEntry);
            await indexedDbTransactionToPromise(tx);
            ensureReplaySharePeerForEntry(normalizedEntry);
            return normalizedEntry;
        }

        async function importReplayArchiveEntry(entry, isRemote = false) {
            if (!entry || !entry.replayData || !entry.replayData.frames || entry.replayData.frames.length < 2) return null;
            const imported = cloneReplayValue(entry);
            imported.codeKey = normalizeReplayCode(imported.code);
            if (!imported.codeKey) return null;
            imported.source = isRemote ? 'remote' : (imported.source || 'local');
            imported.receivedAt = isRemote ? Date.now() : (imported.receivedAt || null);
            if (!imported.summary) imported.summary = {};
            imported.summary.replayCode = imported.code;
            return saveReplayArchiveEntry(imported);
        }

        function closeReplaySharePeer(codeKey) {
            const peerInstance = replaySharePeers.get(codeKey);
            if (!peerInstance) return;
            replaySharePeers.delete(codeKey);
            try {
                peerInstance.destroy();
            } catch (err) {
                console.warn('Failed to close replay share peer:', err);
            }
        }

        function ensureReplaySharePeerForEntry(entry) {
            if (typeof Peer !== 'function' || !entry || !entry.code) return;
            const codeKey = normalizeReplayCode(entry.code);
            if (!codeKey || replaySharePeers.has(codeKey)) return;
            const peerId = buildReplaySharePeerId(entry.code);
            if (!peerId) return;
            try {
                const replayPeer = createPeerInstance(peerId, { debug: 0 });
                replaySharePeers.set(codeKey, replayPeer);
                replayPeer.on('connection', (shareConn) => {
                    shareConn.on('data', async (data) => {
                        if (!data || data.type !== 'replay_request') return;
                        try {
                            const latestEntry = await getReplayArchiveEntryByCode(entry.code);
                            if (shareConn.open) {
                                shareConn.send({
                                    type: 'replay_archive_payload',
                                    entry: latestEntry ? cloneReplayValue(latestEntry) : null
                                });
                            }
                        } catch (err) {
                            console.warn('Failed to serve replay archive entry:', err);
                            if (shareConn.open) shareConn.send({ type: 'replay_archive_payload', entry: null });
                        }
                    });
                });
                replayPeer.on('error', (err) => {
                    if (err && err.type !== 'unavailable-id') {
                        console.warn('Replay share peer error:', err);
                    }
                    if (replaySharePeers.get(codeKey) === replayPeer) replaySharePeers.delete(codeKey);
                });
                replayPeer.on('close', () => {
                    if (replaySharePeers.get(codeKey) === replayPeer) replaySharePeers.delete(codeKey);
                });
            } catch (err) {
                console.warn('Failed to create replay share peer:', err);
            }
        }

        function syncReplaySharePeers(entries = []) {
            if (typeof Peer !== 'function') return;
            const desiredKeys = new Set(entries.map(entry => normalizeReplayCode(entry.code)).filter(Boolean));
            Array.from(replaySharePeers.keys()).forEach(codeKey => {
                if (!desiredKeys.has(codeKey)) closeReplaySharePeer(codeKey);
            });
            entries.forEach(entry => ensureReplaySharePeerForEntry(entry));
        }

        function requestReplayArchiveFromNetwork(code) {
            return new Promise((resolve, reject) => {
                if (typeof Peer !== 'function') {
                    reject(new Error('PeerJS is unavailable'));
                    return;
                }
                const peerId = buildReplaySharePeerId(code);
                if (!peerId) {
                    reject(new Error('Invalid replay code'));
                    return;
                }
                let lookupPeer = null;
                let lookupConn = null;
                let settled = false;
                const finish = (callback, value) => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeoutId);
                    try {
                        if (lookupConn) lookupConn.close();
                    } catch (err) {
                        console.warn('Failed to close replay lookup connection:', err);
                    }
                    try {
                        if (lookupPeer) lookupPeer.destroy();
                    } catch (err) {
                        console.warn('Failed to close replay lookup peer:', err);
                    }
                    callback(value);
                };
                const timeoutId = setTimeout(() => finish(reject, new Error('Replay lookup timed out')), 9000);
                try {
                    lookupPeer = createPeerInstance(generateClientPeerId('TETRIS-RLOOKUP'), { debug: 0 });
                    lookupPeer.on('open', () => {
                        lookupConn = lookupPeer.connect(peerId, { reliable: true });
                        lookupConn.on('open', () => {
                            lookupConn.send({ type: 'replay_request', code: normalizeReplayCode(code) });
                        });
                        lookupConn.on('data', (data) => {
                            if (!data || data.type !== 'replay_archive_payload') return;
                            if (!data.entry) finish(reject, new Error('Replay not found'));
                            else finish(resolve, data.entry);
                        });
                        lookupConn.on('error', (err) => finish(reject, err || new Error('Replay lookup failed')));
                        lookupConn.on('close', () => {
                            if (!settled) finish(reject, new Error('Replay connection closed'));
                        });
                    });
                    lookupPeer.on('error', (err) => finish(reject, err || new Error('Replay lookup peer failed')));
                } catch (err) {
                    finish(reject, err);
                }
            });
        }

        function getReplayArchiveOwnerName(replayData) {
            if (!replayData || !replayData.meta) return cfg.playerName || 'PLAYER 1';
            if (replayData.meta.mode === 'party') {
                const names = replayData.meta.playerNames || [];
                const myIndex = typeof replayData.meta.myIndex === 'number' ? replayData.meta.myIndex : 0;
                return names[myIndex] || cfg.playerName || 'PLAYER 1';
            }
            return replayData.meta.playerName || cfg.playerName || 'PLAYER 1';
        }

        function getReplayArchiveOpponentNames(replayData) {
            if (!replayData || !replayData.meta) return [];
            if (replayData.meta.mode === 'party') {
                const names = replayData.meta.playerNames || [];
                const myIndex = typeof replayData.meta.myIndex === 'number' ? replayData.meta.myIndex : 0;
                return names.filter((_, index) => index !== myIndex);
            }
            return (replayData.meta.opponents || []).map(opp => opp.name).filter(Boolean);
        }

        function broadcastReplayArchiveEntry(entry, skipConnection = null) {
            if (!entry) return;
            const payload = { type: 'replay_archive', entry: cloneReplayValue(entry) };
            if (conn && conn.open && conn !== skipConnection) {
                try { conn.send(payload); } catch (err) { console.warn('Failed to send replay archive:', err); }
            }
            partyClients.forEach(client => {
                if (!client || !client.open || client === skipConnection) return;
                try {
                    client.send(payload);
                } catch (err) {
                    console.warn('Failed to send replay archive:', err);
                }
            });
        }

        async function persistLastReplayArchive(summary) {
            if (!lastReplayData || !lastReplayData.frames || lastReplayData.frames.length < 2) return null;
            const code = await generateUniqueReplayCode();
            const entry = {
                code,
                createdAt: Date.now(),
                source: 'local',
                ownerName: getReplayArchiveOwnerName(lastReplayData),
                opponentNames: getReplayArchiveOpponentNames(lastReplayData),
                summary: {
                    ...cloneReplayValue(summary),
                    replayCode: code
                },
                replayData: cloneReplayValue(lastReplayData)
            };
            const savedEntry = await saveReplayArchiveEntry(entry);
            if (savedEntry) {
                broadcastReplayArchiveEntry(savedEntry);
                const replayMenu = document.getElementById('replay-menu');
                if (replayMenu && replayMenu.style.display === 'block') {
                    renderReplayArchiveList(await listReplayArchiveEntries());
                }
            }
            return savedEntry;
        }

        function captureReplayFrame(timestamp = performance.now(), force = false) {
            if (!activeMatchSession) return;
            const isPartyReplay = activeMatchSession.mode === 'party';
            if (isPartyReplay && !window.partyModeInstance) return;
            if (!isPartyReplay && !p1) return;

            if (!activeMatchSession.replay) {
                activeMatchSession.replay = {
                    startedAt: timestamp,
                    lastCapturedAt: -Infinity,
                    frames: [],
                    sequence: 0
                };
            }

            const replay = activeMatchSession.replay;
            if (!force && (timestamp - replay.lastCapturedAt) < REPLAY_FRAME_INTERVAL) return;
            if (typeof replay.startedAt !== 'number') replay.startedAt = timestamp;

            const frame = isPartyReplay ? {
                kind: 'party',
                party: window.partyModeInstance.getReplayState()
            } : {
                kind: 'standard',
                p1: p1 ? p1.getState() : null,
                cpu: cpu ? cpu.getState() : null,
                opponents: opponents.map((opp, index) => ({
                    networkId: typeof opp.networkId === 'number' ? opp.networkId : index + 1,
                    state: opp.getState()
                }))
            };

            replay.frames.push({
                at: Math.max(0, Math.round(timestamp - replay.startedAt)),
                seq: replay.sequence++,
                ...frame
            });
            replay.lastCapturedAt = timestamp;
        }

        function buildReplayDataFromSession() {
            if (!activeMatchSession || !activeMatchSession.replay || !activeMatchSession.replay.frames.length) return null;

            const meta = {
                mode: activeMatchSession.mode,
                ruleSet: cloneReplayValue(activeMatchSession.ruleSet || DEFAULT_ROOM_RULES),
                soloModeId: activeMatchSession.soloModeId || null
            };

            if (activeMatchSession.mode === 'party' && window.partyModeInstance) {
                meta.playerCount = window.partyModeInstance.playerCount;
                meta.myIndex = window.partyModeInstance.myIndex;
                meta.playerNames = cloneReplayValue(window.partyModeInstance.playerNames || getReplayNameList(meta.playerCount, meta.myIndex));
            } else if (activeMatchSession.mode === 'online') {
                meta.playerName = (p1 && p1.displayName) || cfg.playerName || 'PLAYER 1';
                meta.opponents = opponents.map((opp, index) => ({
                    networkId: typeof opp.networkId === 'number' ? opp.networkId : index + 1,
                    name: opp.displayName || `PLAYER ${(typeof opp.networkId === 'number' ? opp.networkId : index + 1) + 1}`
                }));
            } else if (activeMatchSession.mode === 'cpu') {
                meta.playerName = (p1 && p1.displayName) || cfg.playerName || 'PLAYER 1';
                meta.cpuLabel = `CPU LV.${cfg.lv}`;
            } else {
                meta.playerName = (p1 && p1.displayName) || cfg.playerName || 'PLAYER 1';
            }

            return {
                meta,
                frames: cloneReplayValue(activeMatchSession.replay.frames),
                events: cloneReplayValue(activeMatchSession.replayActions || []),
                inputs: cloneReplayValue(activeMatchSession.replayInputs || [])
            };
        }

        function setReplayControlsVisible(visible) {
            const controls = document.getElementById('replay-controls');
            if (controls) controls.style.display = visible ? 'block' : 'none';
            syncReplaySpeedButtons();
        }

        function formatReplayTime(ms) {
            const totalSec = Math.max(0, Math.floor(ms / 1000));
            const mins = Math.floor(totalSec / 60);
            const secs = String(totalSec % 60).padStart(2, '0');
            return `${mins}:${secs}`;
        }

        function updateReplayStatusLabel() {
            const label = document.getElementById('replay-status-label');
            const pauseBtn = document.getElementById('replay-pause-btn');
            const currentLabel = document.getElementById('replay-time-current');
            const totalLabel = document.getElementById('replay-time-total');
            const progress = document.getElementById('replay-progress');
            const speedSelect = document.getElementById('replay-speed-select');
            if (!label || !pauseBtn) return;
            if (!replayPlayback || !replayPlayback.data || !replayPlayback.data.frames.length) {
                label.innerText = tr('profile-mode-replay');
                pauseBtn.innerText = tr('replay-pause');
                if (currentLabel) currentLabel.innerText = '0:00';
                if (totalLabel) totalLabel.innerText = '0:00';
                if (progress) {
                    progress.max = 1000;
                    progress.value = 0;
                }
                if (speedSelect) speedSelect.value = '1';
                return;
            }
            const currentMs = Math.min(replayPlayback.elapsedMs || 0, replayPlayback.durationMs || 0);
            const totalMs = replayPlayback.durationMs || 0;
            const rateText = `${Number(replayPlayback.rate || 1).toFixed(1)}x`;
            label.innerText = `REPLAY ${rateText}`;
            if (currentLabel) currentLabel.innerText = formatReplayTime(currentMs);
            if (totalLabel) totalLabel.innerText = formatReplayTime(totalMs);
            if (progress) {
                progress.max = Math.max(1, Math.floor(totalMs));
                progress.value = Math.floor(currentMs);
            }
            if (speedSelect) speedSelect.value = String(Number(replayPlayback.rate || 1));
            pauseBtn.innerText = replayPlayback.paused ? tr('replay-play') : tr('replay-pause');
        }

        function handleReplayScrub(rawValue) {
            if (!isReplayPlayback || !replayPlayback) return;
            seekReplayPlayback(Number(rawValue) || 0);
        }

        function beginMatchSession(mode, ruleSet = DEFAULT_ROOM_RULES, extras = {}) {
            activeMatchSession = {
                mode,
                startedAt: Date.now(),
                ruleSet: { ...ruleSet },
                soloModeId: extras.soloModeId || null,
                timeline: [],
                lastSampleSecond: -1,
                summaryQueued: false,
                replay: null,
                replayActions: [],
                replayInputs: []
            };
        }

        function getCurrentMatchStats() {
            if (activeMatchSession && activeMatchSession.mode === 'party' && window.partyModeInstance) {
                const me = window.partyModeInstance.me || {};
                return {
                    time: me.time || 0,
                    pieces: me.pieces || 0,
                    lines: me.lines || 0,
                    attacks: me.attacks || 0,
                    tSpins: 0,
                    maxRen: me.maxRen || 0,
                    garbageReceived: me.garbageReceived || 0,
                    isGameOver: !!window.partyModeInstance.isGameOver
                };
            }
            if (!p1) return null;
            return {
                time: p1.player.time || 0,
                pieces: p1.player.pieces || 0,
                lines: p1.player.lines || 0,
                attacks: p1.player.attacks || 0,
                tSpins: p1.player.tSpins || 0,
                maxRen: p1.player.maxRen || 0,
                garbageReceived: p1.player.garbageReceived || 0,
                isGameOver: !!p1.isGameOver
            };
        }

        function sampleMatchTimeline() {
            const stats = getCurrentMatchStats();
            if (!activeMatchSession || !stats || stats.isGameOver) return;
            const elapsedSeconds = Math.floor((stats.time || 0) / 1000);
            if (elapsedSeconds <= activeMatchSession.lastSampleSecond) return;
            activeMatchSession.lastSampleSecond = elapsedSeconds;
            const minutes = Math.max((stats.time || 0) / 60000, 1 / 60);
            activeMatchSession.timeline.push({
                second: elapsedSeconds,
                pps: Number((((stats.pieces || 0) / Math.max((stats.time || 0) / 1000, 1)).toFixed(2))),
                apm: Number((((stats.attacks || 0) / minutes).toFixed(2))),
                lpm: Number((((stats.lines || 0) / minutes).toFixed(2)))
            });
        }

        function updateRatingFromSummary(result) {
            if (!activeMatchSession || activeMatchSession.mode !== 'online' || onlinePlayerCount !== 2) return 0;
            if (result !== 'victory' && result !== 'defeat') return 0;
            const actual = result === 'victory' ? 1 : 0;
            const expected = 0.5;
            const delta = Math.round(24 * (actual - expected));
            playerProfile.rating = Math.max(100, playerProfile.rating + delta);
            playerProfile.peakRating = Math.max(playerProfile.peakRating, playerProfile.rating);
            playerProfile.seasonBest = Math.max(playerProfile.seasonBest, playerProfile.rating);
            if (actual === 1) {
                playerProfile.totalWins++;
                playerProfile.seasonWins++;
            } else {
                playerProfile.totalLosses++;
                playerProfile.seasonLosses++;
            }
            savePlayerProfile();
            updateProfileUI();
            return delta;
        }

        function canUseMatchRematch() {
            if (!activeMatchSession || !isOnline || isReplayPlayback) return false;
            if (activeMatchSession.mode !== 'online' && activeMatchSession.mode !== 'party') return false;
            if (isHost) {
                if (isQuickMatch) return !!(conn && conn.open);
                return partyClients.some(client => client && client.open);
            }
            return !!(conn && conn.open);
        }

        function clearMatchSummaryState() {
            document.getElementById('match-summary-overlay').style.display = 'none';
            pendingMatchSummary = null;
            activeMatchSession = null;
        }

        function startHostedRematch() {
            if (!isHost || !canUseMatchRematch()) return false;
            clearMatchSummaryState();
            p1Wins = 0;
            p2Wins = 0;
            startOnlineGame();
            return true;
        }

        function requestMatchRematch() {
            if (!canUseMatchRematch()) {
                showToast(cfg.lang === 'ja' ? "再戦できる接続がありません" : "No active match connection for a rematch.");
                return;
            }
            if (isHost) {
                startHostedRematch();
                return;
            }
            try {
                conn.send({ type: 'rematch_request' });
                showToast(cfg.lang === 'ja' ? "再戦をリクエストしました" : "Rematch requested.");
            } catch (err) {
                console.warn('Failed to request rematch:', err);
                showToast(cfg.lang === 'ja' ? "再戦リクエストを送れませんでした" : "Could not send rematch request.");
            }
        }

        function renderMatchSummary(summary) {
            document.getElementById('match-summary-result').innerText = summary.resultText;
            document.getElementById('match-summary-subtitle').innerText = `${summary.modeLabel} / ${summary.reasonText}`;
            document.getElementById('summary-pps').innerText = summary.pps;
            document.getElementById('summary-apm').innerText = summary.apm;
            document.getElementById('summary-lpm').innerText = summary.lpm;
            document.getElementById('match-summary-title').innerText = tr('match-summary-title');
            const replayBtn = document.getElementById('match-summary-replay-btn');
            if (replayBtn) replayBtn.disabled = !(lastReplayData && lastReplayData.frames && lastReplayData.frames.length > 1);
            const rematchBtn = document.getElementById('match-summary-rematch-btn');
            if (rematchBtn) {
                const canRematch = canUseMatchRematch();
                rematchBtn.style.display = canRematch ? 'inline-block' : 'none';
                rematchBtn.innerText = (!isHost && isOnline)
                    ? tr('match-summary-request-rematch')
                    : tr('match-summary-rematch');
            }

            const rows = [
                [tr('summary-time'), summary.timeText],
                [tr('summary-lines'), String(summary.lines)],
                [tr('summary-attack'), String(summary.attacks)],
                [tr('summary-tspin'), String(summary.tSpins)],
                [tr('summary-max-ren'), String(summary.maxRen)],
                [tr('summary-recv'), String(summary.garbageReceived)],
                [tr('summary-rule'), summary.ruleText],
                [tr('summary-replay-code'), summary.replayCode || '---'],
                [tr('summary-rating'), summary.ratingText]
            ];
            document.getElementById('match-summary-rows').innerHTML = rows.map(([label, value]) =>
                `<div class="summary-row"><span>${label}</span><strong>${value}</strong></div>`
            ).join('');

            const chart = document.getElementById('match-summary-chart');
            const ctx = chart.getContext('2d');
            ctx.clearRect(0, 0, chart.width, chart.height);
            ctx.fillStyle = 'rgba(5,12,18,0.95)';
            ctx.fillRect(0, 0, chart.width, chart.height);
            const timeline = summary.timeline.length ? summary.timeline : [{ second: 0, pps: 0, apm: 0, lpm: 0 }];
            const maxSecond = Math.max(timeline[timeline.length - 1].second, 1);
            const maxValue = Math.max(1, ...timeline.flatMap(point => [point.pps, point.apm / 20, point.lpm / 4]));
            const drawLine = (key, color, scaleDivisor = 1) => {
                ctx.beginPath();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                timeline.forEach((point, index) => {
                    const x = 20 + ((chart.width - 40) * point.second / maxSecond);
                    const normalized = (point[key] / scaleDivisor) / maxValue;
                    const y = chart.height - 20 - ((chart.height - 40) * normalized);
                    if (index === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });
                ctx.stroke();
            };
            drawLine('pps', '#00f0f0', 1);
            drawLine('apm', '#ffaa33', 20);
            drawLine('lpm', '#66ff99', 4);
            ctx.fillStyle = '#7fa4b8';
            ctx.font = '12px monospace';
            ctx.fillText('PPS', 20, 18);
            ctx.fillText('APM/20', 72, 18);
            ctx.fillText('LPM/4', 160, 18);

            document.getElementById('match-summary-overlay').style.display = 'flex';
        }

        function queueMatchSummary(result, reason) {
            const stats = getCurrentMatchStats();
            if (!activeMatchSession || activeMatchSession.summaryQueued || !stats) return;
            activeMatchSession.summaryQueued = true;
            isPaused = true;
            keysDown = {};
            keysDownTime = {};
            captureReplayFrame(performance.now(), true);
            lastReplayData = buildReplayDataFromSession();
            const minutes = Math.max((stats.time || 0) / 60000, 1 / 60);
            const resultTextMap = {
                victory: TRANSLATIONS[cfg.lang].victory,
                defeat: TRANSLATIONS[cfg.lang].defeat,
                gameover: TRANSLATIONS[cfg.lang].gameover
            };
            const reasonTextMap = {
                solo: cfg.lang === 'ja' ? 'ソロ結果' : 'Solo result',
                cpu: cfg.lang === 'ja' ? 'CPU戦結果' : 'CPU match',
                online: cfg.lang === 'ja' ? '対人戦結果' : 'Online result',
                party: cfg.lang === 'ja' ? 'パーティ結果' : 'Party result',
                disconnect: cfg.lang === 'ja' ? '通信切断' : 'Disconnected'
            };
            const ratingDelta = updateRatingFromSummary(result);
            const summary = {
                resultText: resultTextMap[result] || result,
                reasonText: reasonTextMap[reason] || reason,
                modeLabel: getMatchModeLabel(activeMatchSession.mode, activeMatchSession.soloModeId),
                pps: (((stats.pieces || 0) / Math.max((stats.time || 0) / 1000, 1)).toFixed(2)),
                apm: (((stats.attacks || 0) / minutes).toFixed(2)),
                lpm: (((stats.lines || 0) / minutes).toFixed(2)),
                timeText: `${Math.floor((stats.time || 0) / 60000)}:${String(Math.floor(((stats.time || 0) / 1000) % 60)).padStart(2, '0')}`,
                lines: stats.lines || 0,
                attacks: stats.attacks || 0,
                tSpins: stats.tSpins || 0,
                maxRen: stats.maxRen || 0,
                garbageReceived: stats.garbageReceived || 0,
                timeline: [...activeMatchSession.timeline],
                ruleText: activeMatchSession.mode === 'solo' && activeMatchSession.soloModeId
                    ? getSoloModeLabel(activeMatchSession.soloModeId)
                    : `LV${activeMatchSession.ruleSet.startLevel} / x${activeMatchSession.ruleSet.garbageMultiplier.toFixed(1)} / HOLD ${activeMatchSession.ruleSet.allowHold ? 'ON' : 'OFF'}`,
                ratingText: ratingDelta === 0 ? `${playerProfile.rating}` : `${playerProfile.rating} (${ratingDelta > 0 ? '+' : ''}${ratingDelta})`,
                replayCode: cfg.lang === 'ja' ? '発行中...' : 'Generating...'
            };
            pendingMatchSummary = summary;
            persistLastReplayArchive(summary).then((savedEntry) => {
                if (!savedEntry) {
                    summary.replayCode = cfg.lang === 'ja' ? '未保存' : 'Unavailable';
                } else {
                    summary.replayCode = savedEntry.code;
                }
                if (pendingMatchSummary === summary && document.getElementById('match-summary-overlay').style.display === 'flex') {
                    renderMatchSummary(summary);
                }
            }).catch((err) => {
                console.warn('Failed to persist replay archive:', err);
                summary.replayCode = cfg.lang === 'ja' ? '保存失敗' : 'Save failed';
                if (pendingMatchSummary === summary && document.getElementById('match-summary-overlay').style.display === 'flex') {
                    renderMatchSummary(summary);
                }
            });
        }

        function closeMatchSummary() {
            clearMatchSummaryState();
            returnToMenu();
        }

        function clearReplaySceneArtifacts() {
            const opponentsContainer = document.getElementById('opponents-container');
            if (opponentsContainer) opponentsContainer.remove();
            const partyView = document.getElementById('party-view');
            if (partyView) partyView.remove();
            p1 = null;
            cpu = null;
            opponents = [];
            window.partyModeInstance = null;
            restoreGameViewLayout();
            refreshSkillPanel(null);
        }

        function buildReplayOpponentBoard(container, oppId, name, playerCount) {
            const scaleStr = playerCount > 2 ? 'transform: scale(0.85); transform-origin: top;' : '';
            container.insertAdjacentHTML('beforeend', `
                <div style="display:flex; gap:10px; ${scaleStr}">
                    <div class="field-wrap" id="${oppId}-field">
                        <div style="font-size:12px; color:#ff5555; font-weight:bold; letter-spacing:2px; text-align:center;">
                            <span style="color:#00f0f0;">${escapeHtml(name)}</span>
                        </div>
                        <div class="board-area">
                            <div id="${oppId}-meter-container" class="meter-container" style="display:block;">
                                <div id="${oppId}-meter" class="meter-fill" style="height:0%;"></div>
                            </div>
                            <div class="side-column">
                                <div class="hold-next-box">
                                    <div class="stat-label">HOLD</div>
                                    <canvas id="${oppId}-hold" class="mini-canvas" width="60" height="60"></canvas>
                                </div>
                                <div class="stat-box"><div class="stat-label">SCORE</div><div id="${oppId}-score" class="stat-val">0</div></div>
                            </div>
                            <div style="position:relative;">
                                <div id="${oppId}-action-layer" class="action-layer"></div>
                                <canvas id="${oppId}-canvas" class="main-canvas" width="240" height="480"></canvas>
                            </div>
                            <div class="side-column">
                                <div class="hold-next-box" style="padding-bottom:5px;">
                                    <div class="stat-label">NEXT</div>
                                    <canvas id="${oppId}-next-0" class="mini-canvas" width="60" height="60"></canvas>
                                    <canvas id="${oppId}-next-1" class="mini-canvas" width="60" height="60"></canvas>
                                    <canvas id="${oppId}-next-2" class="mini-canvas" width="60" height="60"></canvas>
                                    <canvas id="${oppId}-next-3" class="mini-canvas" width="60" height="60"></canvas>
                                    <canvas id="${oppId}-next-4" class="mini-canvas" width="60" height="60"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }

        function prepareStandardReplayScene(replayData) {
            clearReplaySceneArtifacts();
            document.getElementById('menu').style.display = 'none';
            document.getElementById('game-view').style.display = 'flex';
            document.getElementById('btn-save-menu').style.display = 'none';
            document.getElementById('online-self-indicator').style.display = 'none';
            document.getElementById('p1-name-display').innerText = replayData.meta.playerName || cfg.playerName || 'PLAYER 1';

            const meters = document.querySelectorAll('.meter-container');
            if (replayData.meta.mode === 'solo') {
                meters.forEach(m => m.style.display = 'none');
                document.getElementById('cpu-field').style.display = 'none';
                p1 = new Tetris('p-canvas', 'p-hold', 'p-next', 'p-score', false, 'p-action-layer', 'p-meter', null, true);
                p1.displayName = replayData.meta.playerName || cfg.playerName || 'PLAYER 1';
            } else if (replayData.meta.mode === 'cpu') {
                meters.forEach(m => m.style.display = 'block');
                document.getElementById('cpu-field').style.display = 'flex';
                document.getElementById('current-lv').innerText = cfg.lv;
                p1 = new Tetris('p-canvas', 'p-hold', 'p-next', 'p-score', false, 'p-action-layer', 'p-meter', null, true);
                cpu = new Tetris('c-canvas', 'c-hold', 'c-next', 'c-score', true, 'c-action-layer', 'c-meter', null, true);
                p1.displayName = replayData.meta.playerName || cfg.playerName || 'PLAYER 1';
            } else {
                meters.forEach(m => m.style.display = 'block');
                document.getElementById('cpu-field').style.display = 'none';
                const gameView = document.getElementById('game-view');
                const opponentsContainer = document.createElement('div');
                opponentsContainer.id = 'opponents-container';
                opponentsContainer.style.display = 'flex';
                opponentsContainer.style.gap = '20px';
                gameView.appendChild(opponentsContainer);

                p1 = new Tetris('p-canvas', 'p-hold', 'p-next', 'p-score', false, 'p-action-layer', 'p-meter', null, true);
                p1.displayName = replayData.meta.playerName || cfg.playerName || 'PLAYER 1';
                cpu = null;
                opponents = [];
                (replayData.meta.opponents || []).forEach((oppMeta, index) => {
                    const oppId = 'opp-' + index;
                    buildReplayOpponentBoard(opponentsContainer, oppId, oppMeta.name || `PLAYER ${index + 2}`, (replayData.meta.opponents || []).length + 1);
                    const newOpp = new Tetris(oppId + '-canvas', oppId + '-hold', oppId + '-next', oppId + '-score', true, oppId + '-action-layer', oppId + '-meter', null, true);
                    newOpp.isNetworkPlayer = true;
                    newOpp.isAI = true;
                    newOpp.networkId = oppMeta.networkId;
                    newOpp.displayName = oppMeta.name || `PLAYER ${index + 2}`;
                    opponents.push(newOpp);
                });
                p1.opponents = opponents;
            }

            applyRuleSetToActiveBoards(replayData.meta.ruleSet || DEFAULT_ROOM_RULES);
        }

        function preparePartyReplayScene(replayData) {
            clearReplaySceneArtifacts();
            document.getElementById('menu').style.display = 'none';
            document.getElementById('game-view').style.display = 'flex';
            document.getElementById('btn-save-menu').style.display = 'none';
            document.getElementById('online-self-indicator').style.display = 'none';

            Array.from(document.getElementById('game-view').children).forEach(el => {
                if (el.id !== 'party-view') el.style.display = 'none';
            });

            let partyView = document.getElementById('party-view');
            if (!partyView) {
                partyView = document.createElement('div');
                partyView.id = 'party-view';
                document.getElementById('game-view').appendChild(partyView);
            }
            partyView.style.display = 'flex';
            partyView.style.gap = '20px';
            partyView.style.alignItems = 'flex-start';
            partyView.style.width = '100%';
            partyView.style.justifyContent = 'center';
            partyView.innerHTML = '';

            const playerCount = replayData.meta.playerCount || 2;
            const myIndex = replayData.meta.myIndex || 0;
            const playerNames = replayData.meta.playerNames || getReplayNameList(playerCount, myIndex);

            let leftUI = document.createElement('div'); leftUI.className = 'field-wrap'; leftUI.style.gap = '20px';
            let centerUI = document.createElement('div');
            let rightUI = document.createElement('div'); rightUI.className = 'field-wrap'; rightUI.style.gap = '20px';

            let canvasWrap = document.createElement('div');
            canvasWrap.style.position = 'relative';

            let actionLayer = document.createElement('div');
            actionLayer.id = 'party-action-layer';
            actionLayer.className = 'action-layer';
            canvasWrap.appendChild(actionLayer);

            let partyCanvas = document.createElement('canvas');
            partyCanvas.id = 'party-canvas';
            partyCanvas.className = 'main-canvas';
            partyCanvas.width = 30 * 24;
            partyCanvas.height = 30 * 24;
            canvasWrap.appendChild(partyCanvas);
            centerUI.appendChild(canvasWrap);

            for (let i = 0; i < playerCount; i++) {
                let pUI = document.createElement('div');
                pUI.className = 'board-area';
                pUI.innerHTML = `
                    <div class="side-column">
                        <div style="font-size:12px; color:${COLORS[(i % 7) + 1]}; font-weight:bold; letter-spacing:2px; text-align:center;">${escapeHtml(playerNames[i] || `PLAYER ${i + 1}`)}</div>
                        <div class="hold-next-box" ${i !== myIndex ? 'style="visibility:hidden;"' : ''}>
                            <div class="stat-label">HOLD</div>
                            <canvas id="party-hold-${i}" class="mini-canvas" width="60" height="60"></canvas>
                        </div>
                        <div class="stat-box"><div class="stat-label">SCORE</div><div id="party-score-${i}" class="stat-val">0</div></div>
                    </div>
                `;
                let nextCol = document.createElement('div');
                nextCol.className = 'side-column';
                nextCol.innerHTML = `
                    <div class="hold-next-box" style="padding-bottom:5px; ${i !== myIndex ? 'visibility:hidden;' : ''}">
                        <div class="stat-label">NEXT</div>
                        <canvas id="party-next-${i}-0" class="mini-canvas" width="60" height="60"></canvas>
                        <canvas id="party-next-${i}-1" class="mini-canvas" width="60" height="60"></canvas>
                        <canvas id="party-next-${i}-2" class="mini-canvas" width="60" height="60"></canvas>
                    </div>
                `;
                pUI.appendChild(nextCol);
                if (i % 2 === 0) leftUI.appendChild(pUI);
                else rightUI.appendChild(pUI);
            }

            partyView.appendChild(leftUI);
            partyView.appendChild(centerUI);
            partyView.appendChild(rightUI);

            window.partyModeInstance = new PartyTetris('party-canvas', playerCount, myIndex);
            window.partyModeInstance.playerNames = cloneReplayValue(playerNames);
            p1 = null;
            cpu = null;
            opponents = [];
        }

        function applyReplayFrame(frame) {
            if (!frame) return;
            if (frame.kind === 'party') {
                if (window.partyModeInstance) window.partyModeInstance.applyReplayState(frame.party);
                return;
            }

            if (p1 && frame.p1) p1.setState(cloneReplayValue(frame.p1));
            if (cpu) {
                if (frame.cpu) cpu.setState(cloneReplayValue(frame.cpu));
                cpu.draw();
            }

            const frameOpps = frame.opponents || [];
            frameOpps.forEach(frameOpp => {
                const target = opponents.find(opp => opp.networkId === frameOpp.networkId);
                if (target) target.setState(cloneReplayValue(frameOpp.state));
            });
            opponents.forEach(opp => opp.draw());
            if (p1) p1.draw();
        }

        function clearReplayActionLayers() {
            const layers = [];
            if (p1 && p1.actionLayer) layers.push(p1.actionLayer);
            if (cpu && cpu.actionLayer) layers.push(cpu.actionLayer);
            opponents.forEach(opp => { if (opp && opp.actionLayer) layers.push(opp.actionLayer); });
            if (window.partyModeInstance && window.partyModeInstance.actionLayer) layers.push(window.partyModeInstance.actionLayer);
            layers.forEach(layer => {
                Array.from(layer.querySelectorAll('.action-text')).forEach(el => el.remove());
            });
        }

        function getReplayFrameIndexForTime(targetMs) {
            if (!replayPlayback || !replayPlayback.data || !replayPlayback.data.frames.length) return 0;
            let frameIndex = 0;
            for (let i = 1; i < replayPlayback.data.frames.length; i++) {
                if ((replayPlayback.data.frames[i].at || 0) > targetMs) break;
                frameIndex = i;
            }
            return frameIndex;
        }

        function restoreReplayActionWindow(targetMs) {
            if (!replayPlayback || !replayPlayback.data) return;
            clearReplayActionLayers();
            const events = replayPlayback.data.events || [];
            replayPlayback.eventIndex = -1;
            events.forEach((event, index) => {
                const at = event.at || 0;
                if (at <= targetMs) replayPlayback.eventIndex = index;
                const age = targetMs - at;
                if (age >= 0 && age < 1000) {
                    spawnActionText(
                        resolveReplayActionLayer(event.target),
                        event.text,
                        event.left || '',
                        event.top || '',
                        1000 - age
                    );
                }
            });
        }

        function seekReplayPlayback(targetMs) {
            if (!isReplayPlayback || !replayPlayback || !replayPlayback.data) return;
            const clamped = Math.max(0, Math.min(targetMs, replayPlayback.durationMs || 0));
            replayPlayback.elapsedMs = clamped;
            replayPlayback.frameIndex = getReplayFrameIndexForTime(clamped);
            applyReplayFrame(replayPlayback.data.frames[replayPlayback.frameIndex]);
            restoreReplayActionWindow(clamped);
            replayPlayback.lastTick = performance.now();
            updateReplayStatusLabel();
        }

        function syncReplaySpeedButtons() {
            const rate = replayPlayback ? Number(replayPlayback.rate || 1) : 1;
            const speedSelect = document.getElementById('replay-speed-select');
            if (speedSelect) speedSelect.value = String(rate);
        }

        function setReplaySpeed(rate) {
            if (!isReplayPlayback || !replayPlayback) return;
            replayPlayback.rate = Math.max(0.25, Math.min(4, Number(rate) || 1));
            replayPlayback.lastTick = performance.now();
            syncReplaySpeedButtons();
            updateReplayStatusLabel();
        }

        function skipReplayPlayback(deltaMs) {
            if (!isReplayPlayback || !replayPlayback) return;
            seekReplayPlayback((replayPlayback.elapsedMs || 0) + deltaMs);
        }

        function stepReplayFrame(direction = 1) {
            if (!isReplayPlayback || !replayPlayback || !replayPlayback.data) return;
            replayPlayback.paused = true;
            const frames = replayPlayback.data.frames || [];
            const currentIndex = getReplayFrameIndexForTime(replayPlayback.elapsedMs || 0);
            const nextIndex = Math.max(0, Math.min(frames.length - 1, currentIndex + (direction < 0 ? -1 : 1)));
            seekReplayPlayback((frames[nextIndex] && frames[nextIndex].at) || 0);
        }

        function stepReplayPlayback(timestamp) {
            if (!isReplayPlayback || !replayPlayback) return;
            if (replayPlayback.paused) {
                replayPlayback.lastTick = timestamp;
                updateReplayStatusLabel();
                requestAnimationFrame(stepReplayPlayback);
                return;
            }

            if (!replayPlayback.lastTick) replayPlayback.lastTick = timestamp;
            const delta = Math.max(0, timestamp - replayPlayback.lastTick);
            replayPlayback.lastTick = timestamp;
            replayPlayback.elapsedMs = Math.min(
                replayPlayback.durationMs || 0,
                (replayPlayback.elapsedMs || 0) + (delta * (replayPlayback.rate || 1))
            );

            while (replayPlayback.frameIndex + 1 < replayPlayback.data.frames.length &&
                replayPlayback.data.frames[replayPlayback.frameIndex + 1].at <= replayPlayback.elapsedMs) {
                replayPlayback.frameIndex++;
                applyReplayFrame(replayPlayback.data.frames[replayPlayback.frameIndex]);
            }

            playReplayActionsUntil(replayPlayback.elapsedMs);
            updateReplayStatusLabel();

            if (replayPlayback.elapsedMs >= replayPlayback.durationMs) {
                stopReplayPlayback();
                return;
            }

            requestAnimationFrame(stepReplayPlayback);
        }

        function startReplayPlayback(replayData = lastReplayData, options = {}) {
            if (!replayData || !replayData.frames || replayData.frames.length < 2) {
                showToast(cfg.lang === 'ja' ? "リプレイできるデータがありません" : "No replay data available.");
                return;
            }

            lastReplayData = cloneReplayValue(replayData);
            isReplayPlayback = true;
            isPaused = true;
            replayPlayback = {
                data: lastReplayData,
                frameIndex: 0,
                eventIndex: -1,
                elapsedMs: 0,
                durationMs: lastReplayData.frames[lastReplayData.frames.length - 1].at || 0,
                paused: false,
                lastTick: 0,
                rate: 1,
                returnToSummary: options.returnToSummary !== false
            };

            document.getElementById('match-summary-overlay').style.display = 'none';
            if (lastReplayData.meta.mode === 'party') preparePartyReplayScene(lastReplayData);
            else prepareStandardReplayScene(lastReplayData);
            applyReplayFrame(lastReplayData.frames[0]);
            playReplayActionsUntil(0);
            setReplayControlsVisible(true);
            updateTouchControlsVisibility();
            updateReplayStatusLabel();
            requestAnimationFrame(stepReplayPlayback);
        }

        function stopReplayPlayback() {
            if (!isReplayPlayback) return;
            if (!replayPlayback || replayPlayback.returnToSummary === false) pendingMatchSummary = null;
            isReplayPlayback = false;
            replayPlayback = null;
            setReplayControlsVisible(false);
            returnToMenu();
        }

        function toggleReplayPause() {
            if (!isReplayPlayback || !replayPlayback) return;
            if (replayPlayback.paused) {
                replayPlayback.paused = false;
                replayPlayback.lastTick = performance.now();
            } else {
                replayPlayback.paused = true;
            }
            updateReplayStatusLabel();
        }

        function loadCfg() {
            const saved = localStorage.getItem('tetrisProUltCfg_v14');
            if (saved) {
                const parsed = JSON.parse(saved);
                cfg = {
                    ...cfg,
                    ...parsed,
                    keys: { ...cfg.keys, ...parsed.keys },
                    padKeys: { ...cfg.padKeys, ...parsed.padKeys },
                    touchPos: { ...cfg.touchPos, ...parsed.touchPos }
                };
            }
            if (isAdminRestrictionActive() && adminRestriction.lockedName && cfg.playerName !== adminRestriction.lockedName) {
                cfg.playerName = adminRestriction.lockedName;
                saveCfg();
            }
            updateUIFromCfg(); setLang(cfg.lang);
        }
        function saveCfg() { localStorage.setItem('tetrisProUltCfg_v14', JSON.stringify(cfg)); }

        function applyTouchControlSettings() {
            const controls = document.getElementById('touch-controls');
            if (!controls) return;
            const layout = ['balanced', 'wide', 'compact'].includes(cfg.touchLayout) ? cfg.touchLayout : 'balanced';
            const scale = Math.max(0.8, Math.min(1.35, parseFloat(cfg.touchButtonScale) || 1));
            const opacity = Math.max(0.35, Math.min(1, parseFloat(cfg.touchOpacity) || 0.88));

            cfg.touchLayout = layout;
            cfg.touchButtonScale = scale;
            cfg.touchOpacity = opacity;

            controls.dataset.layout = layout;
            controls.classList.toggle('show-extra', !!cfg.touchExtraButtons);
            controls.style.setProperty('--touch-cell', `${Math.round(60 * scale)}px`);
            controls.style.setProperty('--touch-action', `${Math.round(64 * scale)}px`);
            controls.style.setProperty('--touch-hold-width', `${Math.round(82 * scale)}px`);
            controls.style.setProperty('--touch-gap', `${Math.max(6, Math.round(8 * scale))}px`);
            controls.style.setProperty('--touch-alpha', opacity);
        }

        function updateTutorialEntryUI() {
            const locked = !cfg.hasCompletedTutorial;
            const adminLocked = isAdminRestrictionActive();
            const tutorialMenu = document.getElementById('tutorial-menu');
            const mainMenu = document.getElementById('main-menu-btns');
            const settingsTrigger = document.getElementById('settings-trigger');
            if (tutorialMenu) tutorialMenu.style.display = locked && !adminLocked ? 'block' : 'none';
            if (mainMenu) mainMenu.style.display = locked && !adminLocked ? 'none' : 'block';
            if (settingsTrigger) settingsTrigger.style.display = locked && !adminLocked ? 'none' : 'block';
            applyAdminRestrictionUI();
        }

        function openTutorialEntry() {
            firstTimeNameTemp = cfg.playerName || firstTimeNameTemp || "Player1";
            document.getElementById('first-time-name').value = firstTimeNameTemp;
            document.getElementById('name-prompt-overlay').style.display = 'flex';
        }

        function checkNameUniqueAndSave(newName, isTutorial = false) {
            if (isAdminRestrictionActive()) {
                enforceAdminLockedName();
                showToast(cfg.lang === 'ja' ? 'BAN中は名前を変更できません' : 'You cannot change your name while banned.');
                if (isTutorial) document.getElementById('name-prompt-overlay').style.display = 'none';
                return;
            }
            if (!newName || newName.trim() === '') {
                showToast(cfg.lang === 'ja' ? "名前を入力してください" : "Please enter a name");
                return;
            }
            if (newName === cfg.playerName) {
                if (isTutorial) {
                    document.getElementById('name-prompt-overlay').style.display = 'none';
                    startTutorial();
                }
                return;
            }

            // Check uniqueness using PeerJS
            showToast(cfg.lang === 'ja' ? "名前をチェック中..." : "Checking name availability...");
            let testPeer = createPeerInstance('TETRIS-ID-' + newName, { debug: 0 });

            testPeer.on('open', (id) => {
                // Name is available! We can claim it.
                if (identityPeer) identityPeer.destroy(); // Release old name
                identityPeer = testPeer; // Keep the connection open to reserve the name!
                bindIdentityPeerHandlers(testPeer);

                cfg.playerName = newName;
                saveCfg();
                updateUIFromCfg();

                if (isTutorial) {
                    document.getElementById('name-prompt-overlay').style.display = 'none';
                    startTutorial();
                } else {
                    showToast(cfg.lang === 'ja' ? "名前を変更しました" : "Name updated successfully");
                }
            });

            testPeer.on('error', (err) => {
                if (err.type === 'unavailable-id') {
                    showToast(cfg.lang === 'ja' ? "その名前は既に使用されています" : "That name is already in use");
                    if (!isTutorial) {
                        document.getElementById('player-name-input').value = cfg.playerName; // Reset to old name
                    }
                } else {
                    // Other error, just allow for offline play
                    cfg.playerName = newName;
                    saveCfg();
                    updateUIFromCfg();
                    if (isTutorial) {
                        document.getElementById('name-prompt-overlay').style.display = 'none';
                        startTutorial();
                    }
                }
            });
        }

        function setPlayerTempName(val) {
            firstTimeNameTemp = val;
        }

        function exportConfig() {
            let exportData = { ...cfg };
            delete exportData.playerName;
            delete exportData.hasCompletedTutorial;

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "tetris_ultimate_config.json");
            dlAnchorElem.click();
        }

        function importConfig(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const parsed = JSON.parse(e.target.result);
                    delete parsed.playerName;
                    delete parsed.hasCompletedTutorial;

                    cfg = {
                        ...cfg,
                        ...parsed,
                        keys: { ...cfg.keys, ...parsed.keys },
                        padKeys: { ...cfg.padKeys, ...parsed.padKeys },
                        touchPos: { ...cfg.touchPos, ...parsed.touchPos }
                    };
                    saveCfg();
                    updateUIFromCfg();

                    showToast(cfg.lang === 'ja' ? "設定を読み込みました" : "Config imported successfully.");
                } catch (err) {
                    showToast(cfg.lang === 'ja' ? "ファイルの読み込みに失敗しました" : "Failed to parse JSON file.");
                }
            };
            reader.readAsText(file);
        }

        function updateUIFromCfg() {
            if (!cfg.theme || cfg.theme.startsWith('#')) cfg.theme = 'default';
            const t = THEMES[cfg.theme] || THEMES['default'];

            document.documentElement.style.setProperty('--accent', t.accent);
            document.documentElement.style.setProperty('--bg', t.bg);
            document.documentElement.style.setProperty('--panel', t.panel);
            document.documentElement.style.setProperty('--text', t.text);
            document.documentElement.style.setProperty('--border', t.border);
            document.documentElement.style.setProperty('--canvas-bg', t.canvasBg);

            const normalizedLang = TRANSLATIONS[cfg.lang] ? cfg.lang : 'en';
            cfg.lang = normalizedLang;
            document.getElementById('theme-select').value = cfg.theme;
            if (document.getElementById('lang-select')) document.getElementById('lang-select').value = normalizedLang;
            if (document.getElementById('tutorial-lang-select')) document.getElementById('tutorial-lang-select').value = normalizedLang;

            const playerNameInput = document.getElementById('player-name-input');
            playerNameInput.value = cfg.playerName;
            if (isAdminRestrictionActive()) {
                playerNameInput.disabled = true;
                playerNameInput.title = getAdminRestrictionText();
            } else {
                playerNameInput.disabled = false;
                playerNameInput.removeAttribute('title');
            }

            // ▼ 追加: 自分の盤面の上に設定したプレイヤー名を表示する
            const p1NameDisp = document.getElementById('p1-name-display');
            if (p1NameDisp) p1NameDisp.innerText = cfg.playerName;

            // Restoring the lost UI elements here!
            document.getElementById('lv-range').value = cfg.lv; if(document.getElementById('lv-val')) document.getElementById('lv-val').value = cfg.lv;
            document.getElementById('ghost-range').value = cfg.ghost * 100; if(document.getElementById('ghost-val')) document.getElementById('ghost-val').value = cfg.ghost;
            document.getElementById('das-range').value = cfg.das; if(document.getElementById('das-val')) document.getElementById('das-val').value = cfg.das;
            document.getElementById('arr-range').value = cfg.arr; if(document.getElementById('arr-val')) document.getElementById('arr-val').value = cfg.arr;

            document.getElementById('sdf-range').value = cfg.sdf; if(document.getElementById('sdf-val')) document.getElementById('sdf-val').value = cfg.sdf;
            if (document.getElementById('pad-deadzone-range')) document.getElementById('pad-deadzone-range').value = Math.round((cfg.gamepadDeadzone || 0.5) * 100);
            if (document.getElementById('pad-deadzone-val')) document.getElementById('pad-deadzone-val').value = (cfg.gamepadDeadzone || 0.5).toFixed(2);
            if (document.getElementById('touch-layout-select')) document.getElementById('touch-layout-select').value = cfg.touchLayout || 'balanced';
            if (document.getElementById('touch-size-range')) document.getElementById('touch-size-range').value = Math.round((cfg.touchButtonScale || 1) * 100);
            if (document.getElementById('touch-size-val')) document.getElementById('touch-size-val').value = (cfg.touchButtonScale || 1).toFixed(2);
            if (document.getElementById('touch-opacity-range')) document.getElementById('touch-opacity-range').value = Math.round((cfg.touchOpacity || 0.88) * 100);
            if (document.getElementById('touch-opacity-val')) document.getElementById('touch-opacity-val').value = (cfg.touchOpacity || 0.88).toFixed(2);
            if (document.getElementById('touch-extra-toggle')) document.getElementById('touch-extra-toggle').checked = !!cfg.touchExtraButtons;
            document.getElementById('ospin-toggle').checked = cfg.ospin;
            if (document.getElementById('ospin-transform-select')) document.getElementById('ospin-transform-select').value = cfg.ospinTransform || 'fixed';
            if (document.getElementById('allspin-toggle')) document.getElementById('allspin-toggle').checked = cfg.allSpinDisplay !== false;
            document.getElementById('level-toggle').checked = cfg.enableLevelUp !== false;
            if (document.getElementById('particles-range')) { document.getElementById('particles-range').value = cfg.particles || 80; document.getElementById('particles-val').value = cfg.particles || 80; }
            for (let k in cfg.keys) {
                const el = document.getElementById('key-' + k);
                if (el) el.innerText = isGamepadConnected ? getPrettyKey(cfg.padKeys[k]) : getPrettyKey(cfg.keys[k]);
            }
            updateProfileUI();
            updateFullscreenButtonState();
            applyTouchControlSettings();
        }

        function applyKeyPreset(name) {
            if (!KEY_PRESETS[name]) return;
            cfg.keys = { ...cfg.keys, ...KEY_PRESETS[name] };
            updateUIFromCfg();
            saveCfg();
            showToast(cfg.lang === 'ja' ? `キープリセット: ${name}` : `Key preset: ${name}`);
        }

        function applyPadPreset(name) {
            if (!PAD_PRESETS[name]) return;
            cfg.padKeys = { ...cfg.padKeys, ...PAD_PRESETS[name] };
            updateUIFromCfg();
            saveCfg();
            showToast(cfg.lang === 'ja' ? `パッドプリセット: ${name}` : `Pad preset: ${name}`);
        }

        document.querySelectorAll('input[type="range"]').forEach(input => {
            if (input.id === 'scale-slider' || input.id === 'replay-progress' || input.id.startsWith('touch-')) return; // Dedicated handlers
            input.oninput = (e) => {
                const id = e.target.id.split('-')[0];
                if (id === 'ghost') cfg.ghost = e.target.value / 100;
                else cfg[id] = parseFloat(e.target.value);
                updateUIFromCfg(); saveCfg();
            };
        });

        let capturingKey = null;
        function captureKey(target) { capturingKey = target; document.getElementById('key-' + target).innerText = cfg.lang === 'ja' ? '入力待機中...' : '...'; }

        // --- Pause & UI scale ---
        function handlePauseToggle() {
            if (isReplayPlayback) return;
            if ((window.isPartyMode && window.partyModeInstance) || !p1 || p1.isGameOver || inTutorial) return;
            isPaused = !isPaused;
            document.getElementById('pause-overlay').style.display = isPaused ? 'flex' : 'none';
        }
        function handleRetry() {
            if (isReplayPlayback) return;
            if ((window.isPartyMode && window.partyModeInstance) || !p1 || inTutorial) return;
            isPaused = false;
            document.getElementById('pause-overlay').style.display = 'none';
            beginMatchSession(isOnline ? 'online' : (cpu ? 'cpu' : 'solo'), p1.ruleSet || DEFAULT_ROOM_RULES);
            resetRound();
        }

        function openScreenScaleConfig() {
            document.getElementById('settings-overlay').style.display = 'none';
            document.getElementById('screen-scale-overlay').style.display = 'flex';
            document.getElementById('scale-slider').value = cfg.screenScale;
            // Initialize arrow position properly when opened
            previewScreenScale(cfg.screenScale);
            isPaused = true;
        }
        function previewScreenScale(val) {
            const tempScale = parseFloat(val);
            const scaleX = window.innerWidth / 750;
            const scaleY = window.innerHeight / 650;
            const baseScale = Math.min(scaleX, scaleY, 1);
            const box = document.getElementById('scale-arrows-box');
            const targetWidth = 750 * baseScale / tempScale;
            const targetHeight = 650 * baseScale / tempScale;

            box.style.bottom = 'auto'; // Fix CSS inset overriding width/height
            box.style.right = 'auto';
            box.style.width = targetWidth + 'px';
            box.style.height = targetHeight + 'px';
            box.style.left = `calc(50% - ${targetWidth / 2}px)`;
            box.style.top = `calc(50% - ${targetHeight / 2}px)`;

            // Save to JSON in real-time as requested
            cfg.screenScale = tempScale;
            saveCfg();
            resize(); // Live resize in background
        }
        function applyScreenScale() {
            // No need to save again since it's real-time, just close menu
            document.getElementById('screen-scale-overlay').style.display = 'none';
            document.getElementById('settings-overlay').style.display = 'flex';
            isPaused = false;
        }

        window.addEventListener("gamepadconnected", (e) => {
            isGamepadConnected = true;
            const tabKeysLabel = document.querySelector('[data-tr="tab-keys"]');
            if (tabKeysLabel) tabKeysLabel.innerText = cfg.lang === 'ja' ? "ボタン配置" : "BUTTONS";
            updateUIFromCfg();
        });
        window.addEventListener("gamepaddisconnected", (e) => {
            isGamepadConnected = false;
            const tabKeysLabel = document.querySelector('[data-tr="tab-keys"]');
            if (tabKeysLabel) tabKeysLabel.innerText = TRANSLATIONS[cfg.lang]["tab-keys"];
            updateUIFromCfg();
        });

        // --- Save & Load System ---
        let saves = JSON.parse(localStorage.getItem('tetrisProUltSaves_v1')) || { 1: null, 2: null, 3: null, 4: null, 5: null };
        let selectedLoadSlot = null;
        let selectedSaveSlot = null;
        let slotToDelete = null;

        function updateMenuLoadButton() {
            document.getElementById('btn-load').style.display = 'inline-block';
        }

        function openSaveModal() {
            isPaused = true;
            document.getElementById('save-overlay').style.display = 'flex';

            const now = new Date();
            const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
            document.getElementById('save-name').value = `Save ${dateStr}`;

            selectedSaveSlot = null;
            document.getElementById('do-save-btn').disabled = true;

            const container = document.getElementById('save-slot-container');
            container.innerHTML = '';

            for (let i = 1; i <= 5; i++) {
                const data = saves[i];
                const el = document.createElement('div');
                el.className = 'slot-item';
                if (data) {
                    el.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
                            <div>
                                <div class="slot-title">Slot ${i}: ${data.name}</div>
                                <div class="slot-date">${data.date}</div>
                                <div style="font-size: 11px; color: #888;">Mode: ${data.isCPU ? "VS CPU" : "SOLO"}</div>
                            </div>
                        </div>
                    `;
                } else {
                    el.innerHTML = `
                        <div style="display:flex; align-items:center; width: 100%; height: 50px;">
                            <div class="slot-title" style="color:#666;">Slot ${i}: Empty</div>
                        </div>
                    `;
                }
                el.onclick = () => {
                    document.querySelectorAll('#save-slot-container .slot-item').forEach(e => e.classList.remove('selected'));
                    el.classList.add('selected');
                    selectedSaveSlot = i;
                    document.getElementById('do-save-btn').disabled = false;
                };
                container.appendChild(el);
            }
        }

        function closeSaveModal() {
            document.getElementById('save-overlay').style.display = 'none';
            isPaused = false;
        }

        function executeSave() {
            if (!selectedSaveSlot) return;
            const slot = selectedSaveSlot;
            const name = document.getElementById('save-name').value || `Slot ${slot}`;

            const doSave = () => {
                const saveData = {
                    name: name,
                    date: new Date().toLocaleString(),
                    isCPU: !!cpu,
                    p1: p1 ? p1.getState() : null,
                    cpu: cpu ? cpu.getState() : null
                };

                saves[slot] = saveData;
                localStorage.setItem('tetrisProUltSaves_v1', JSON.stringify(saves));

                closeSaveModal();
                returnToMenu();
                showToast(cfg.lang === 'ja' ? `スロット${slot}にセーブしました` : `Saved to Slot ${slot}`);
            };

            if (saves[slot]) {
                showConfirmToast(cfg.lang === 'ja' ? `スロット${slot}にセーブを上書きしますか？` : `Overwrite save in Slot ${slot}?`, doSave);
            } else {
                doSave();
            }
        }

        function showConfirmToast(msg, onConfirm, onCancel = null, options = {}) {
            const container = document.getElementById('toast-container');
            const el = document.createElement('div');
            el.className = 'toast';
            el.style.backgroundColor = 'rgba(20, 20, 20, 0.95)';
            el.style.border = '1px solid #ffaa00';
            el.style.color = '#fff';
            el.style.display = 'flex';
            el.style.flexDirection = 'column';
            el.style.gap = '10px';
            el.style.pointerEvents = 'auto';
            el.style.zIndex = '99999';

            const txt = document.createElement('div');
            txt.innerText = msg;

            const btnBox = document.createElement('div');
            btnBox.style.display = 'flex';
            btnBox.style.gap = '10px';
            btnBox.style.justifyContent = 'center';

            const yesBtn = document.createElement('button');
            yesBtn.className = 'btn';
            yesBtn.style.minWidth = '60px';
            yesBtn.style.margin = '0';
            yesBtn.style.padding = '5px 15px';
            yesBtn.innerText = options.confirmText || tr('common-yes');
            yesBtn.onclick = () => { el.remove(); onConfirm(); };

            const noBtn = document.createElement('button');
            noBtn.className = 'btn';
            noBtn.style.minWidth = '60px';
            noBtn.style.margin = '0';
            noBtn.style.padding = '5px 15px';
            noBtn.style.borderColor = '#888';
            noBtn.style.color = '#888';
            noBtn.innerText = options.cancelText || tr('common-no');
            noBtn.onclick = () => { el.remove(); if (typeof onCancel === 'function') onCancel(); };

            btnBox.appendChild(yesBtn);
            btnBox.appendChild(noBtn);

            el.appendChild(txt);
            el.appendChild(btnBox);
            container.appendChild(el);
        }

        function deleteSave(slot, event) {
            event.stopPropagation(); // スロットのクリック判定を防ぐ
            slotToDelete = slot;
            const panel = document.getElementById('delete-confirm-panel');
            const input = document.getElementById('delete-confirm-input');

            document.getElementById('delete-confirm-msg').innerText = cfg.lang === 'ja' ? `スロット${slot}を削除するには「delete」と入力してください` : `Type "delete" to remove Slot ${slot}`;
            input.value = '';
            panel.classList.add('show');

            setTimeout(() => input.focus(), 300);
        }

        function confirmDelete() {
            const input = document.getElementById('delete-confirm-input');
            if (input.value === 'delete' && slotToDelete !== null) {
                saves[slotToDelete] = null;
                localStorage.setItem('tetrisProUltSaves_v1', JSON.stringify(saves));
                cancelDelete();

                const hasSaves = Object.values(saves).some(s => s !== null);
                if (!hasSaves) {
                    closeLoadModal();
                    showToast(cfg.lang === 'ja' ? "すべてのデータが削除されました" : "All save data deleted");
                } else {
                    openLoadModal(); // リストを再描画
                }
            } else {
                showToast(cfg.lang === 'ja' ? "「delete」と正確に入力してください" : "Please type 'delete' exactly");
                input.focus();
            }
        }

        function cancelDelete() {
            slotToDelete = null;
            document.getElementById('delete-confirm-panel').classList.remove('show');
        }

        function openLoadModal() {
            if (blockAdminRestrictedAction()) return;
            const hasSaves = Object.values(saves).some(s => s !== null);
            if (!hasSaves) {
                showToast(cfg.lang === 'ja' ? "データがありません" : "No save data");
                return;
            }

            const container = document.getElementById('load-slot-container');
            container.innerHTML = '';

            selectedLoadSlot = null;
            document.getElementById('do-load-btn').disabled = true;
            cancelDelete(); // パネルが開いていたら閉じておく

            for (let i = 1; i <= 5; i++) {
                const data = saves[i];
                if (data) {
                    const el = document.createElement('div');
                    el.className = 'slot-item';
                    el.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div class="slot-title">Slot ${i}: ${data.name}</div>
                        <div class="slot-date">${data.date}</div>
                        <div style="font-size: 11px; color: #888;">Mode: ${data.isCPU ? "VS CPU" : "SOLO"}</div>
                    </div>
                    <button class="delete-btn" onclick="deleteSave(${i}, event)">${cfg.lang === 'ja' ? '削除' : 'DELETE'}</button>
                </div>
            `;
                    el.onclick = () => {
                        document.querySelectorAll('.slot-item').forEach(e => e.classList.remove('selected'));
                        el.classList.add('selected');
                        selectedLoadSlot = i;
                        document.getElementById('do-load-btn').disabled = false;
                    };
                    container.appendChild(el);
                }
            }

            document.getElementById('load-overlay').style.display = 'flex';
        }

        function closeLoadModal() {
            document.getElementById('load-overlay').style.display = 'none';
            cancelDelete();
        }

        function executeLoad() {
            if (!selectedLoadSlot || !saves[selectedLoadSlot]) return;
            const data = saves[selectedLoadSlot];
            closeLoadModal();

            startGame(data.isCPU, null, true);

            p1.setState(data.p1);
            if (data.isCPU && cpu && data.cpu) {
                cpu.setState(data.cpu);
            }
        }

        function returnToMenu() {
            isReplayPlayback = false;
            replayPlayback = null;
            setReplayControlsVisible(false);
            clearMatchCountdown();
            stopFriendPresenceMonitor();
            closeRemoteProfileOverlay();
            if (isOnline) disconnectOnline(false); // Ensures Quick Match disconnection and resets networking variables
            resetSoloCpuHintState();
            restoreGameViewLayout();

            document.getElementById('game-view').style.display = 'none';
            document.getElementById('menu').style.display = 'block';
            updateTouchControlsVisibility();

            const resetDisp = (id, disp) => { const el = document.getElementById(id); if (el) el.style.display = disp; };
            resetDisp('main-menu-btns', 'block');
            resetDisp('solo-menu', 'none');
            resetDisp('profile-menu', 'none');
            resetDisp('online-menu', 'none');
            resetDisp('room-settings-menu', 'none');
            resetDisp('online-lobby', 'none');
            resetDisp('quick-match-lobby', 'none'); // Fix menu bug
            resetDisp('replay-menu', 'none');
            resetDisp('template-menu', 'none');
            resetDisp('mode-select-menu', 'none');
            closeTemplateBuilder();
            applyAdminRestrictionUI();

            p1 = null;
            cpu = null;
            opponents = [];
            isPartyMode = false;
            onlinePlayerCount = 0;
            onlineMyIndex = 0;
            onlineRoomRules = { ...DEFAULT_ROOM_RULES };
            window.partyModeInstance = null;
            keysDown = {};
            keysDownTime = {};
            const partyView = document.getElementById('party-view');
            if (partyView) partyView.remove();
            let opponentsContainer = document.getElementById('opponents-container');
            if (opponentsContainer) opponentsContainer.remove();
            restoreGameViewLayout();

            if (window.partyModeRAF) {
                cancelAnimationFrame(window.partyModeRAF);
            }
            if (tutorialTimeout) {
                clearTimeout(tutorialTimeout);
                tutorialTimeout = null;
            }
            isPaused = false;
            inTutorial = false;
            currentSoloModeId = null;
            updateTutorialEntryUI();
            updateMenuLoadButton();
            document.getElementById('btn-save-menu').style.display = 'block';
            document.getElementById('online-self-indicator').style.display = 'none';
            suppressConnectionCloseHandler = false;
            resetConnectionQuality();
            refreshSkillPanel(null);
            syncSoloStatusPanel(true);
            if (pendingMatchSummary) renderMatchSummary(pendingMatchSummary);
            else activeMatchSession = null;
        }

        // --- Online Multiplayer (PeerJS) ---
        let peer = null;
        let conn = null;
        let isHost = false;
        let isOnline = false;
        let opponentName = "PLAYER 2";
        let qmIndex = 0;
        let isQuickMatch = false;
        let p1Wins = 0;
        let p2Wins = 0;
        let targetWins = 1;
        let isPartyMode = false;
        let targetPartyCount = 4;
        let partyClients = [];
        let opponents = []; // Array to store multiple Opponent Tetris instances
        let onlinePlayerCount = 0;
        let onlineMyIndex = 0;
        let onlineStateCache = {};
        let onlineDeadPlayers = {};
        function isStandardOnlineMatch() {
            return isOnline && !isPartyMode;
        }

        function isHostedOnlineMatch() {
            return isStandardOnlineMatch() && isHost && !isQuickMatch;
        }

        function resetOnlineRoundState() {
            onlineStateCache = {};
            onlineDeadPlayers = {};
            for (let i = 0; i < onlinePlayerCount; i++) {
                onlineDeadPlayers[i] = false;
            }
        }

        function normalizeNetworkId(id) {
            const parsed = Number(id);
            return Number.isInteger(parsed) ? parsed : null;
        }

        function restoreGameViewLayout() {
            const gameView = document.getElementById('game-view');
            if (!gameView) return;
            Array.from(gameView.children).forEach(el => {
                if (el.id === 'party-view' || el.id === 'opponents-container') return;
                if (el.id === 'cpu-field') el.style.display = 'none';
                else el.style.display = '';
            });
        }

        function syncCurrentStandardOnlineState() {
            if (!isStandardOnlineMatch() || !p1) return;
            const snapshot = p1.getState();
            onlineStateCache[onlineMyIndex] = snapshot;
            if (conn && conn.open) {
                conn.send({ type: 'state', id: onlineMyIndex, seq: onlineStateSequence++, stamp: Date.now(), state: snapshot });
            } else if (isHostedOnlineMatch()) {
                broadcastMultiState();
            }
        }

        function clearLobbyChat() {
            lobbyChatMessages = [];
            document.querySelectorAll('.lobby-chat-log').forEach(log => {
                log.innerHTML = '';
            });
            ['lobby-chat-input', 'qm-chat-input'].forEach((id) => {
                const input = document.getElementById(id);
                if (input) input.value = '';
            });
        }

        function renderLobbyChat() {
            document.querySelectorAll('.lobby-chat-log').forEach(log => {
                log.innerHTML = lobbyChatMessages.map(message =>
                    `<div class="chat-line"><span class="name">${escapeHtml(message.name)}</span><span>${escapeHtml(message.text)}</span></div>`
                ).join('');
                log.scrollTop = log.scrollHeight;
            });
        }

        function pushLobbyChat(name, text) {
            lobbyChatMessages.push({ name, text });
            lobbyChatMessages = lobbyChatMessages.slice(-40);
            renderLobbyChat();
        }

        function broadcastLobbyChat(message, sourceConnection = null) {
            if (isQuickMatch) {
                if (conn && conn.open) conn.send({ type: 'lobby_chat', ...message });
                return;
            }
            if (isHost && !isQuickMatch) {
                partyClients.forEach(c => {
                    if (c !== sourceConnection && c.open) c.send({ type: 'lobby_chat', ...message });
                });
            } else if (!isHost && conn && conn.open) {
                conn.send({ type: 'lobby_chat', ...message });
            }
        }

        function sendLobbyChatFromInput() {
            const input = isQuickMatch ? document.getElementById('qm-chat-input') : document.getElementById('lobby-chat-input');
            if (!input) return;
            const text = input.value.trim();
            if (!text) return;
            input.value = '';
            const message = { name: cfg.playerName || 'PLAYER', text };
            pushLobbyChat(message.name, message.text);
            broadcastLobbyChat(message);
        }

        function sendLobbyStamp(text) {
            const message = { name: cfg.playerName || 'PLAYER', text };
            pushLobbyChat(message.name, message.text);
            broadcastLobbyChat(message);
        }

        function clearQuickMatchReadyState() {
            quickMatchReadySelf = false;
            quickMatchReadyRemote = false;
            quickMatchConnectionOpen = false;
            quickMatchStartLock = false;
            updateQuickMatchReadyUI();
        }

        function updateQuickMatchReadyUI() {
            const readyBtn = document.getElementById('qm-ready-btn');
            const readyStatus = document.getElementById('qm-ready-status');
            const mainStatus = document.getElementById('qm-status');
            const chatPanel = document.getElementById('qm-chat-panel');
            if (!readyBtn || !readyStatus || !mainStatus || !chatPanel) return;
            if (!isQuickMatch) {
                readyBtn.disabled = true;
                chatPanel.style.display = 'none';
                readyStatus.innerText = tr('online-searching');
                return;
            }
            const isConnected = !!(conn && conn.open && quickMatchConnectionOpen);
            chatPanel.style.display = isConnected ? 'block' : 'none';
            if (!isConnected) {
                mainStatus.innerText = tr('online-searching');
                readyStatus.innerText = tr('online-searching');
                readyBtn.innerText = tr('qm-ready-btn');
                readyBtn.disabled = true;
                return;
            }
            mainStatus.innerText = tr('qm-ready-found');
            readyBtn.innerText = quickMatchReadySelf ? tr('qm-ready-waiting-btn') : tr('qm-ready-btn');
            readyBtn.disabled = quickMatchReadySelf;
            if (quickMatchReadySelf && quickMatchReadyRemote) {
                readyStatus.innerText = tr('qm-ready-both');
            } else if (quickMatchReadySelf) {
                readyStatus.innerText = tr('qm-ready-waiting');
            } else if (quickMatchReadyRemote) {
                readyStatus.innerText = tr('qm-ready-opponent');
            } else {
                readyStatus.innerText = tr('qm-ready-found');
            }
        }

        function confirmQuickMatchReady() {
            if (!isQuickMatch || quickMatchReadySelf || !conn || !conn.open) return;
            quickMatchReadySelf = true;
            if (conn && conn.open) conn.send({ type: 'qm_ready', ready: true });
            updateQuickMatchReadyUI();
            if (isHost && quickMatchReadyRemote && !quickMatchStartLock) startOnlineGame();
        }

        function clearMatchCountdown() {
            if (matchCountdownTimer) {
                clearInterval(matchCountdownTimer);
                matchCountdownTimer = null;
            }
            const overlay = document.getElementById('match-countdown-overlay');
            if (overlay) overlay.style.display = 'none';
        }

        function runMatchCountdown(countdownAt, onDone) {
            clearMatchCountdown();
            const overlay = document.getElementById('match-countdown-overlay');
            const numberEl = document.getElementById('match-countdown-number');
            const captionEl = document.getElementById('match-countdown-caption');
            if (!overlay || !numberEl || !captionEl) {
                isPaused = false;
                lastTime = performance.now();
                if (typeof onDone === 'function') onDone();
                return;
            }
            const startAt = typeof countdownAt === 'number' ? countdownAt : Date.now() + 1200;
            isPaused = true;
            overlay.style.display = 'flex';
            const tick = () => {
                const remaining = startAt - Date.now();
                if (remaining > 2000) {
                    numberEl.innerText = '3';
                    captionEl.innerText = tr('countdown-ready');
                } else if (remaining > 1000) {
                    numberEl.innerText = '2';
                    captionEl.innerText = tr('countdown-ready');
                } else if (remaining > 0) {
                    numberEl.innerText = '1';
                    captionEl.innerText = tr('countdown-ready');
                } else if (remaining > -650) {
                    numberEl.innerText = tr('countdown-go');
                    captionEl.innerText = '';
                } else {
                    clearMatchCountdown();
                    isPaused = false;
                    lastTime = performance.now();
                    if (typeof onDone === 'function') onDone();
                }
            };
            tick();
            matchCountdownTimer = setInterval(tick, 50);
        }

        function resetConnectionQuality() {
            connectionQuality = { ping: null, syncDelay: null, packetLoss: 0, missedStates: 0, receivedStates: 0, lastRemoteStateAt: 0 };
            const panel = document.getElementById('connection-quality-panel');
            if (panel) panel.style.display = 'none';
            if (connectionMonitorInterval) {
                clearInterval(connectionMonitorInterval);
                connectionMonitorInterval = null;
            }
        }

        function renderConnectionQuality() {
            const panel = document.getElementById('connection-quality-panel');
            if (!panel) return;
            panel.style.display = isOnline ? 'block' : 'none';
            document.getElementById('quality-ping').innerText = connectionQuality.ping === null ? '--' : `${connectionQuality.ping}ms`;
            document.getElementById('quality-sync').innerText = connectionQuality.syncDelay === null ? '--' : `${connectionQuality.syncDelay}ms`;
            document.getElementById('quality-loss').innerText = `${connectionQuality.packetLoss.toFixed(0)}%`;
        }

        function startConnectionMonitor() {
            resetConnectionQuality();
            if (!isOnline) return;
            renderConnectionQuality();
            connectionMonitorInterval = setInterval(() => {
                if (conn && conn.open) {
                    pingSerial++;
                    conn.send({ type: 'ping', token: pingSerial, stamp: Date.now() });
                }
                if (connectionQuality.lastRemoteStateAt) {
                    connectionQuality.syncDelay = Math.max(0, Date.now() - connectionQuality.lastRemoteStateAt);
                }
                renderConnectionQuality();
            }, 2000);
        }

        function getSelectedPartyVariant() {
            const selected = document.querySelector('input[name="room-party-variant"]:checked');
            return selected ? selected.value : 'shared';
        }

        function syncPartyRuleSelectionUI() {
            const partyToggle = document.getElementById('room-party-mode');
            const section = document.getElementById('party-special-settings');
            const enabled = !!(partyToggle && partyToggle.checked);
            if (section) section.style.display = enabled ? 'block' : 'none';

            document.querySelectorAll('.party-special-card').forEach(card => {
                const input = card.querySelector('input[name="room-party-variant"]');
                if (input) input.disabled = !enabled;
                card.classList.toggle('is-selected', !!(enabled && input && input.checked));
            });
        }

        function selectPartyVariant(value) {
            const input = document.querySelector(`input[name="room-party-variant"][value="${value}"]`);
            if (!input || input.disabled) return false;
            if (!input.checked) input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }

        function bindPartyRuleCardInteractions() {
            document.querySelectorAll('.party-special-card').forEach(card => {
                if (card.dataset.partyTapBound === '1') return;
                const input = card.querySelector('input[name="room-party-variant"]');
                if (!input) return;

                const activateCard = (event) => {
                    if (input.disabled) return;

                    if (event.type === 'click' && event.target === input) {
                        syncPartyRuleSelectionUI();
                        return;
                    }

                    event.preventDefault();
                    selectPartyVariant(input.value);
                };

                card.addEventListener('click', activateCard);
                card.addEventListener('touchend', activateCard, { passive: false });
                card.dataset.partyTapBound = '1';
            });
        }

        function updateTouchControlsVisibility() {
            const touchControls = document.getElementById('touch-controls');
            const pieceButton = document.getElementById('mobile-piece-btn');
            const gameView = document.getElementById('game-view');
            if (!touchControls || !gameView) return;
            const gameVisible = getComputedStyle(gameView).display !== 'none' && !isReplayPlayback;
            touchControls.classList.toggle('is-hidden', !gameVisible);
            if (pieceButton) pieceButton.classList.toggle('is-hidden', !gameVisible);
            applyTouchControlSettings();
        }

        function handleMobilePieceButton() {
            if (isReplayPlayback) return;
            const isPartyReplayTarget = window.partyModeInstance && isPartyMode && !isPaused && !window.partyModeInstance.isGameOver;
            const target = isPartyReplayTarget ? window.partyModeInstance : (p1 && !p1.isGameOver && !isPaused ? p1 : null);
            if (target && typeof target.playerHold === 'function') target.playerHold();
        }

        function updateFullscreenButtonState() {
            const button = document.getElementById('fullscreen-trigger');
            if (!button) return;
            const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
            button.classList.toggle('is-fullscreen', active);
            button.title = active
                ? (cfg.lang === 'ja' ? 'フルスクリーンを終了' : 'Exit Fullscreen')
                : (cfg.lang === 'ja' ? 'フルスクリーン' : 'Fullscreen');
            button.setAttribute('aria-label', button.title);
        }

        async function toggleFullscreen() {
            const root = document.documentElement;
            const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
            try {
                if (fullscreenElement) {
                    if (document.exitFullscreen) await document.exitFullscreen();
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                } else {
                    if (root.requestFullscreen) await root.requestFullscreen();
                    else if (root.webkitRequestFullscreen) root.webkitRequestFullscreen();
                }
            } catch (err) {
                console.warn('Fullscreen toggle failed:', err);
                showToast(cfg.lang === 'ja' ? "フルスクリーンに切り替えられませんでした" : "Could not toggle fullscreen.");
            } finally {
                updateFullscreenButtonState();
            }
        }

        function applyRoomRulesFromSettings() {
            const partyEnabled = !!document.getElementById('room-party-mode').checked;
            const partyVariant = partyEnabled ? getSelectedPartyVariant() : 'shared';
            const sharedDeathInput = document.getElementById('room-shared-death-mode');
            onlineRoomRules = {
                garbageMultiplier: Math.max(0.5, Math.min(3, parseFloat(document.getElementById('room-garbage-multiplier').value) || 1)),
                startLevel: Math.max(1, Math.min(20, parseInt(document.getElementById('room-start-level').value) || 1)),
                allowHold: document.getElementById('room-allow-hold').checked,
                partyVariant: partyVariant,
                sharedBoard: partyEnabled && partyVariant === 'shared',
                giantBlocks: partyEnabled && partyVariant === 'giant',
                tallBoard: partyEnabled && partyVariant === 'tall',
                bombMino: partyEnabled && partyVariant === 'bomb',
                skillMode: partyEnabled && partyVariant === 'skills',
                chaosMode: partyEnabled && partyVariant === 'chaos',
                survivalRush: partyEnabled && partyVariant === 'survival',
                sharedDeathMode: sharedDeathInput && sharedDeathInput.value === 'collective' ? 'collective' : 'solo',
                allowSpectators: !!(document.getElementById('room-allow-spectators') || {}).checked,
                autoStartFull: !!(document.getElementById('room-auto-start-full') || {}).checked,
                countdownSeconds: 3.2
            };
        }

        function hasPartySpecialRules(ruleSet = onlineRoomRules) {
            if (!ruleSet) return false;
            return !!(ruleSet.giantBlocks || ruleSet.tallBoard || ruleSet.bombMino || ruleSet.skillMode || ruleSet.chaosMode || ruleSet.survivalRush);
        }

        function getSkillCoinAmount(board) {
            return board && board.player ? (board.player.skillCoins || 0) : 0;
        }

        function refreshSkillPanel(board = p1) {
            const panel = document.getElementById('party-skill-panel');
            if (!panel) return;
            if (board && !board.isPlayerBoard) return;
            const enabled = !!(board && board.isPlayerBoard && board.ruleSet && board.ruleSet.skillMode && isOnline && !isPartyMode);
            panel.style.display = enabled ? 'block' : 'none';
            if (!enabled) return;
            const coins = getSkillCoinAmount(board);
            document.getElementById('party-skill-coins').innerText = coins;
            Object.keys(PARTY_SKILLS).forEach(key => {
                const btn = document.getElementById(`skill-btn-${key}`);
                if (!btn) return;
                btn.disabled = coins < PARTY_SKILLS[key].cost || !!board.isGameOver;
            });
        }

        function usePartySkill(skillKey) {
            if (!p1 || typeof p1.useSkill !== 'function') return;
            p1.useSkill(skillKey);
        }

        function getConnectionByNetworkId(id) {
            return partyClients.find(c => c.networkId === id && c.open);
        }

        function applyOpponentNetworkState(playerId, state) {
            const normalizedId = normalizeNetworkId(playerId);
            if (normalizedId === null || normalizedId === onlineMyIndex || !state) return;
            onlineStateCache[normalizedId] = state;
            if (opponents.length === 0) return;
            const opp = opponents.find(o => o.networkId === normalizedId);
            if (opp) {
                opp.setState(state);
                captureReplayFrame(performance.now());
            }
        }

        function broadcastMultiState() {
            if (!isHostedOnlineMatch() || !p1) return;
            onlineStateCache[p1.networkId] = p1.getState();
            const states = {};
            Object.keys(onlineStateCache).forEach(key => {
                if (onlineStateCache[key]) states[key] = onlineStateCache[key];
            });
            partyClients.forEach(c => {
                if (c && c.open) c.send({ type: 'multi_state', states: states });
            });
        }

        function getStandardOnlineTargets(excludeId) {
            const targets = [];
            for (let i = 0; i < onlinePlayerCount; i++) {
                if (i === excludeId || onlineDeadPlayers[i]) continue;
                targets.push(i);
            }
            return targets;
        }

        function pickStandardOnlineTarget(excludeId) {
            const targets = getStandardOnlineTargets(excludeId);
            if (targets.length === 0) return null;
            return targets[Math.floor(Math.random() * targets.length)];
        }

        function handleOnlineRoundWin() {
            p1Wins++;
            if (p1Wins >= targetWins) {
                queueMatchSummary('victory', 'online');
                showToast(TRANSLATIONS[cfg.lang].victory + " (Match Winner!)");
            } else {
                showToast(TRANSLATIONS[cfg.lang].victory + ` (Round Won! Score: ${p1Wins} - ${p2Wins})`);
                setTimeout(() => resetRound(), 3000);
            }
        }

        function handleOnlineRoundLoss() {
            p2Wins++;
            if (p2Wins >= targetWins) {
                queueMatchSummary('defeat', 'online');
                showToast(TRANSLATIONS[cfg.lang].defeat + " (Match Lost!)");
            } else {
                showToast(TRANSLATIONS[cfg.lang].defeat + ` (Round Lost! Score: ${p1Wins} - ${p2Wins})`);
                setTimeout(() => resetRound(), 3000);
            }
        }

        function markStandardOnlinePlayerDead(playerId) {
            if (typeof playerId !== 'number') return;
            onlineDeadPlayers[playerId] = true;
            if (playerId === onlineMyIndex) return;
            const opp = opponents.find(o => o.networkId === playerId);
            if (opp) {
                opp.isGameOver = true;
                opp.updateUI();
                opp.updateMeter();
                opp.draw();
            }
        }

        function checkStandardOnlineMatchEnd() {
            if (!isStandardOnlineMatch() || onlinePlayerCount <= 2) return;
            const alivePlayers = [];
            for (let i = 0; i < onlinePlayerCount; i++) {
                if (!onlineDeadPlayers[i]) alivePlayers.push(i);
            }
            if (alivePlayers.length !== 1) return;
            const winnerId = alivePlayers[0];
            queueMatchSummary(winnerId === onlineMyIndex ? 'victory' : 'defeat', 'online');
            showToast(winnerId === onlineMyIndex ? TRANSLATIONS[cfg.lang].victory : TRANSLATIONS[cfg.lang].defeat);
        }

        function handleRemoteStandardGameOver(playerId) {
            if (typeof playerId !== 'number' || onlineDeadPlayers[playerId]) return;
            markStandardOnlinePlayerDead(playerId);
            if (onlinePlayerCount <= 2) {
                if (playerId !== onlineMyIndex) handleOnlineRoundWin();
            } else {
                checkStandardOnlineMatchEnd();
            }
        }

        function sendStandardOnlineAttack(amount, fromId) {
            amount = normalizeGarbageAmount(amount);
            if (!isStandardOnlineMatch() || amount <= 0) return false;
            const senderId = typeof fromId === 'number' ? fromId : onlineMyIndex;

            if (isQuickMatch) {
                if (conn && conn.open) {
                    conn.send({ type: 'attack', amount: amount, fromId: senderId, targetId: senderId === 0 ? 1 : 0 });
                    return true;
                }
                return false;
            }

            if (isHost) {
                const targetId = pickStandardOnlineTarget(senderId);
                if (targetId === null) return false;
                if (targetId === onlineMyIndex) {
                    if (p1 && !p1.isGameOver) p1.receiveGarbage(amount);
                } else {
                    const targetConn = getConnectionByNetworkId(targetId);
                    if (targetConn && targetConn.open) {
                        targetConn.send({ type: 'attack', amount: amount, fromId: senderId, targetId: targetId });
                    }
                }
                return true;
            }

            if (conn && conn.open) {
                conn.send({ type: 'attack', amount: amount, fromId: senderId });
                return true;
            }

            return false;
        }

        function sendStandardOnlineGameOver(playerId) {
            if (!isStandardOnlineMatch() || typeof playerId !== 'number') return;
            if (isHostedOnlineMatch()) {
                partyClients.forEach(c => {
                    if (c && c.open) c.send({ type: 'gameover', fromId: playerId });
                });
                return;
            }
            if (conn && conn.open) {
                conn.send({ type: 'gameover', fromId: playerId });
            }
        }

        function routeStandardOnlineSkill(skillKey, fromId) {
            if (!isStandardOnlineMatch() || !PARTY_SKILLS[skillKey]) return false;
            const senderId = normalizeNetworkId(fromId);
            if (senderId === null) return false;

            if (skillKey === 'slow' || skillKey === 'clean') {
                if (senderId === onlineMyIndex) {
                    if (p1 && typeof p1.applySkillEffect === 'function') {
                        p1.applySkillEffect(skillKey, senderId);
                        syncCurrentStandardOnlineState();
                    }
                } else {
                    const senderConn = isQuickMatch ? conn : getConnectionByNetworkId(senderId);
                    if (senderConn && senderConn.open) senderConn.send({ type: 'skill_effect', skill: skillKey, fromId: senderId });
                }
                return true;
            }

            const targetId = pickStandardOnlineTarget(senderId);
            if (targetId === null) return false;
            if (targetId === onlineMyIndex) {
                if (p1 && typeof p1.applySkillEffect === 'function') {
                    p1.applySkillEffect(skillKey, senderId);
                    syncCurrentStandardOnlineState();
                }
                return true;
            }

            const targetConn = isQuickMatch ? conn : getConnectionByNetworkId(targetId);
            if (targetConn && targetConn.open) {
                targetConn.send({ type: 'skill_effect', skill: skillKey, fromId: senderId });
                return true;
            }
            return false;
        }

        function sendStandardOnlineSkillRequest(skillKey, fromId = onlineMyIndex) {
            if (!isStandardOnlineMatch() || !PARTY_SKILLS[skillKey]) return false;
            const senderId = normalizeNetworkId(fromId);
            if (senderId === null) return false;

            if (isQuickMatch) {
                if (isHost) return routeStandardOnlineSkill(skillKey, senderId);
                if (conn && conn.open) {
                    conn.send({ type: 'skill_use', skill: skillKey, fromId: senderId });
                    return true;
                }
                return false;
            }

            if (isHost) return routeStandardOnlineSkill(skillKey, senderId);

            if (conn && conn.open) {
                conn.send({ type: 'skill_use', skill: skillKey, fromId: senderId });
                return true;
            }
            return false;
        }

        function showOnlineMenu() {
            if (blockAdminRestrictedAction()) return;
            document.getElementById('main-menu-btns').style.display = 'none';
            document.getElementById('solo-menu').style.display = 'none';
            document.getElementById('profile-menu').style.display = 'none';
            document.getElementById('online-menu').style.display = 'block';
            updateOnlineLobbyExitButton();
        }

        function hideOnlineMenu() {
            document.getElementById('online-menu').style.display = 'none';
            document.getElementById('main-menu-btns').style.display = 'block';
        }

        function updateOnlineLobbyExitButton() {
            const button = document.getElementById('btn-online-exit');
            if (!button) return;
            button.innerText = (isHost && !isQuickMatch)
                ? tr('online-disband')
                : tr('online-leave-room');
        }

        function handleOnlineLobbyExit() {
            if (isHost && !isQuickMatch) {
                if (conn && conn.open) {
                    try { conn.send({ type: 'room_closed' }); } catch (err) { console.warn('Failed to notify room closure:', err); }
                }
                partyClients.forEach(client => {
                    if (!client || !client.open) return;
                    try {
                        client.send({ type: 'room_closed' });
                    } catch (err) {
                        console.warn('Failed to notify room closure:', err);
                    }
                });
                showToast(cfg.lang === 'ja' ? "部屋を解散しました" : "Room disbanded.");
            }
            disconnectOnline();
        }

        function showRoomSettings() {
            document.getElementById('online-menu').style.display = 'none';
            document.getElementById('room-settings-menu').style.display = 'block';
        }

        function hideRoomSettings() {
            document.getElementById('room-settings-menu').style.display = 'none';
            document.getElementById('online-menu').style.display = 'block';
        }

        function generateRoomCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
            return result;
        }

        function initPeer(id, onSuccess) {
            suppressConnectionCloseHandler = false;
            clearQuickMatchRetryTimeout();
            suspendIdentityReservation();
            const oldPeer = peer;
            peer = null;
            peerGeneration++;
            if (oldPeer) oldPeer.destroy();
            const currentGeneration = peerGeneration;

            if (id) {
                peer = createPeerInstance(id);
            } else {
                peer = createPeerInstance(generateClientPeerId());
            }
            const localPeer = peer;

            localPeer.on('open', (assignedId) => {
                if (peer !== localPeer || currentGeneration !== peerGeneration) return;
                onSuccess(assignedId);
            });

            localPeer.on('error', (err) => {
                if (peer !== localPeer || currentGeneration !== peerGeneration) return;
                console.error("PeerJS Error:", err);
                let errorMsg = "通信エラーが発生しました";
                if (err.type === 'peer-unavailable') {
                    errorMsg = TRANSLATIONS[cfg.lang]["online-err-notfound"] || (cfg.lang === 'ja' ? "コードが間違っているか、無効です。" : "Invalid or missing room code.");
                } else if (err.type === 'unavailable-id') {
                    errorMsg = TRANSLATIONS[cfg.lang]["online-err-idinuse"] || (cfg.lang === 'ja' ? "その部屋番号はすでに使われています。" : "Room code is already in use.");
                } else if (err.type === 'network' || err.type === 'server-error' || err.type === 'socket-error' || err.type === 'socket-closed') {
                    errorMsg = cfg.lang === 'ja' ? "通信サーバーに接続できませんでした" : "Could not reach the signalling server.";
                } else if (err.type === 'webrtc') {
                    errorMsg = cfg.lang === 'ja' ? "WebRTC接続に失敗しました。別の回線やブラウザでもお試しください。" : "WebRTC connection failed. Please try another network or browser.";
                }
                showToast(errorMsg);
                resetOnlineLobby();
                disconnectOnline();
            });
        }
        function setupConnectionEvents(connection) {
            if (isHost && !isQuickMatch) {
                partyClients.push(connection);
            } else {
                conn = connection;
            }

            const onOpen = () => {
                clearQuickMatchRetryTimeout();
                let currentConn = isHost && !isQuickMatch ? connection : conn;
                if (isQuickMatch) {
                    let statusEl = document.getElementById('qm-status');
                    statusEl.innerText = tr('qm-ready-found');
                    statusEl.style.color = '#00ff00';
                    statusEl.style.animation = 'none';
                    p1Wins = 0;
                    p2Wins = 0;
                    targetWins = 2; // Best of 3
                    clearQuickMatchReadyState();
                    quickMatchConnectionOpen = true;
                    lobbyProfileSnapshots = isHost
                        ? [buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')]
                        : [null, buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')];
                    renderQuickMatchProfilePanels();
                    updateQuickMatchReadyUI();
                    pushLobbyChat('SYSTEM', tr('qm-ready-found'));
                    currentConn.send({ type: 'hello', name: cfg.playerName, roomRules: DEFAULT_ROOM_RULES, profile: buildPublicProfileSnapshot(cfg.playerName || 'PLAYER') });
                } else {
                    document.getElementById('lobby-status').innerText = TRANSLATIONS[cfg.lang]["online-connected"];
                    document.getElementById('lobby-status').style.color = '#00ff00';
                    currentConn.send({
                        type: 'hello',
                        name: cfg.playerName,
                        profile: buildPublicProfileSnapshot(cfg.playerName || 'PLAYER'),
                        targetWins: targetWins,
                        isPartyMode: isPartyMode && !hasPartySpecialRules(onlineRoomRules),
                        partyCount: targetPartyCount,
                        roomRules: onlineRoomRules,
                        partyRoles: partySlotRoles,
                        partyTeams: partySlotTeams
                    });
                }
            };

            if (connection.open) {
                onOpen();
            } else {
                connection.on('open', onOpen);
            }

            connection.on('data', (data) => {
                if (data && ADMIN_PACKET_TYPES.has(data.type)) {
                    handleIncomingAdminPacket(data, connection);
                    return;
                }
                if (data.type === 'reject') {
                    connection.close();
                    if (isQuickMatch) {
                        qmIndex++;
                        searchQuickMatch();
                    } else {
                        showToast(TRANSLATIONS[cfg.lang]["online-err-full"] || "Room is full");
                        disconnectOnline();
                    }
                }
                else if (data.type === 'hello') {
                    if (isHost && !isQuickMatch) {
                        let clientIndex = partyClients.indexOf(connection);
                        let slotNum = clientIndex + 2;
                        connection.networkId = clientIndex + 1;
                        let displayOpponentName = data.name;

                        if (displayOpponentName === cfg.playerName) {
                            displayOpponentName = displayOpponentName + " (" + slotNum + ")";
                            connection.send({ type: 'name_override', newName: displayOpponentName });
                        }
                        document.getElementById('lobby-p' + slotNum + '-name').innerText = displayOpponentName;
                        connection.peerName = displayOpponentName;
                        connection.peerProfile = sanitizePublicProfileSnapshot(data.profile, displayOpponentName);
                        connection.peerProfile.name = displayOpponentName;

                        document.getElementById('btn-start-online').style.display = 'inline-block';

                        broadcastLobbyState();
                        if (onlineRoomRules.autoStartFull && partyClients.length >= targetPartyCount - 1) {
                            setTimeout(() => {
                                if (isHost && !isOnline && partyClients.length >= targetPartyCount - 1) startOnlineGame();
                            }, 600);
                        }
                    } else {
                        opponentName = data.name;
                        let displayOpponentName = opponentName;
                        if (data.roomRules) {
                            onlineRoomRules = { ...DEFAULT_ROOM_RULES, ...data.roomRules };
                        }

                        if (isHost && opponentName === cfg.playerName) {
                            displayOpponentName = opponentName + " (2)";
                            opponentName = displayOpponentName;
                            connection.send({ type: 'name_override', newName: opponentName });
                        }

                        if (isQuickMatch) {
                            connection.networkId = isHost ? 1 : 0;
                        }
                        connection.peerName = displayOpponentName;
                        connection.peerProfile = sanitizePublicProfileSnapshot(data.profile, displayOpponentName);
                        connection.peerProfile.name = displayOpponentName;
                        if (isQuickMatch) {
                            if (isHost) {
                                document.getElementById('lobby-p1-name').innerText = cfg.playerName;
                                document.getElementById('lobby-p2-name').innerText = displayOpponentName;
                                lobbyProfileSnapshots = [
                                    buildPublicProfileSnapshot(cfg.playerName || 'PLAYER'),
                                    connection.peerProfile
                                ];
                            } else {
                                document.getElementById('lobby-p1-name').innerText = displayOpponentName;
                                document.getElementById('lobby-p2-name').innerText = cfg.playerName;
                                lobbyProfileSnapshots = [
                                    connection.peerProfile,
                                    buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')
                                ];
                            }
                            renderQuickMatchProfilePanels();
                            updateQuickMatchReadyUI();
                        }

                        if (isHost) {
                        } else {
                            if (data.targetWins !== undefined) targetWins = data.targetWins;
                            if (data.isPartyMode !== undefined) isPartyMode = data.isPartyMode;
                            if (data.partyCount !== undefined) targetPartyCount = data.partyCount;
                            if (Array.isArray(data.partyRoles)) partySlotRoles = data.partyRoles.map(sanitizePartyRole).slice(0, 4);
                            if (Array.isArray(data.partyTeams)) partySlotTeams = data.partyTeams.map(sanitizePartyTeam).slice(0, 4);
                            while (partySlotRoles.length < 4) partySlotRoles.push('player');
                            while (partySlotTeams.length < 4) partySlotTeams.push(partySlotTeams.length % 2 === 0 ? 'A' : 'B');

                            if (targetPartyCount >= 3) document.getElementById('lobby-slot-3').style.display = 'block';
                            else document.getElementById('lobby-slot-3').style.display = 'none';
                            if (targetPartyCount >= 4) document.getElementById('lobby-slot-4').style.display = 'block';
                            else document.getElementById('lobby-slot-4').style.display = 'none';

                            if (!isQuickMatch) {
                                document.getElementById('lobby-p1-name').innerText = displayOpponentName;
                                lobbyProfileSnapshots[0] = connection.peerProfile;
                                lobbyProfileSnapshots[1] = buildPublicProfileSnapshot(cfg.playerName || 'PLAYER');
                                renderLobbyProfilePanels();
                            }
                        }
                    }
                }
                else if (data.type === 'lobby_chat') {
                    if (!isHost || isQuickMatch) {
                        pushLobbyChat(data.name, data.text);
                    } else {
                        pushLobbyChat(data.name, data.text);
                        broadcastLobbyChat({ name: data.name, text: data.text }, connection);
                    }
                }
                else if (data.type === 'qm_ready') {
                    if (isQuickMatch) {
                        quickMatchReadyRemote = !!data.ready;
                        updateQuickMatchReadyUI();
                        if (isHost && quickMatchReadySelf && quickMatchReadyRemote && !quickMatchStartLock) {
                            startOnlineGame();
                        }
                    }
                }
                else if (data.type === 'ping') {
                    if (connection && connection.open) {
                        connection.send({ type: 'pong', token: data.token, stamp: data.stamp });
                    }
                }
                else if (data.type === 'pong') {
                    if (typeof data.stamp === 'number') {
                        connectionQuality.ping = Math.max(0, Date.now() - data.stamp);
                        renderConnectionQuality();
                    }
                }
                else if (data.type === 'name_override') {
                    if (isAdminRestrictionActive()) {
                        enforceAdminLockedName();
                        showToast(cfg.lang === 'ja' ? 'BAN中は名前を変更できません' : 'You cannot change your name while banned.');
                        return;
                    }
                    cfg.playerName = data.newName;
                    document.getElementById('player-name-input').value = data.newName;
                    const p1NameDisp = document.getElementById('p1-name-display');
                    if (p1NameDisp) p1NameDisp.innerText = data.newName;
                    saveCfg();
                    updateProfileUI();
                    showToast(cfg.lang === 'ja' ? `名前が被ったため、${data.newName}に変更されました` : `Name changed to ${data.newName} to avoid collision.`);
                }
                else if (data.type === 'lobby_update') {
                    applyLobbyNameList(data.names || []);
                    if (data.roomRules) onlineRoomRules = { ...DEFAULT_ROOM_RULES, ...data.roomRules };
                    if (Array.isArray(data.roles)) partySlotRoles = data.roles.map(sanitizePartyRole).slice(0, 4);
                    if (Array.isArray(data.teams)) partySlotTeams = data.teams.map(sanitizePartyTeam).slice(0, 4);
                    while (partySlotRoles.length < 4) partySlotRoles.push('player');
                    while (partySlotTeams.length < 4) partySlotTeams.push(partySlotTeams.length % 2 === 0 ? 'A' : 'B');
                    syncPartyLobbyRoleControls();
                    lobbyProfileSnapshots = Array.isArray(data.profiles)
                        ? data.profiles.map((profile, index) => profile ? sanitizePublicProfileSnapshot(profile, (data.names || [])[index] || '---') : null)
                        : lobbyProfileSnapshots;
                    if (!isHost && !isQuickMatch) {
                        const myIndex = Math.max((data.names || []).findIndex(name => name === cfg.playerName), 1);
                        lobbyProfileSnapshots[myIndex] = buildPublicProfileSnapshot(cfg.playerName || 'PLAYER');
                    }
                    renderLobbyProfilePanels();
                }
                else if (data.type === 'room_closed') {
                    showToast(cfg.lang === 'ja' ? "部屋が解散されました" : "The room was disbanded.");
                    disconnectOnline();
                }
                else if (data.type === 'rematch_request') {
                    if (isHost) {
                        showToast(cfg.lang === 'ja' ? "再戦を開始します" : "Starting rematch...");
                        startHostedRematch();
                    }
                }
                else if (data.type === 'start') {
                    startOnlineGameExecution(2, 1, data.countdownAt);
                }
                else if (data.type === 'start_multi') {
                    startOnlineGameExecution(data.playerCount, data.myIndex, data.countdownAt);
                }
                else if (data.type === 'start_party') {
                    startPartyModeExecution(data.playerCount, data.myIndex, data.countdownAt, data.partyRoles, data.partyTeams, data.roomRules);
                }
                else if (data.type === 'state') {
                    const senderId = normalizeNetworkId(data.id !== undefined ? data.id : connection.networkId);
                    if (typeof data.seq === 'number') {
                        if (typeof connection.lastStateSeq === 'number' && data.seq > connection.lastStateSeq + 1) {
                            connectionQuality.missedStates += data.seq - connection.lastStateSeq - 1;
                        }
                        connection.lastStateSeq = data.seq;
                    }
                    connectionQuality.receivedStates++;
                    connectionQuality.lastRemoteStateAt = Date.now();
                    connectionQuality.syncDelay = typeof data.stamp === 'number' ? Math.max(0, Date.now() - data.stamp) : connectionQuality.syncDelay;
                    const totalPackets = connectionQuality.receivedStates + connectionQuality.missedStates;
                    connectionQuality.packetLoss = totalPackets > 0 ? (connectionQuality.missedStates / totalPackets) * 100 : 0;
                    renderConnectionQuality();
                    if (senderId !== null) onlineStateCache[senderId] = data.state;
                    if (cpu && (cpu.isNetworkPlayer || !cpu.isAI)) {
                        cpu.setState(data.state);
                    }
                    applyOpponentNetworkState(senderId, data.state);
                }
                else if (data.type === 'multi_state') {
                    if (opponents.length > 0) {
                        for (let key in data.states) {
                            applyOpponentNetworkState(key, data.states[key]);
                        }
                    }
                }
                else if (data.type === 'action_text') {
                    const actorId = normalizeNetworkId(data.fromId !== undefined ? data.fromId : connection.networkId);
                    if (actorId !== null) {
                        if (isHost && !isQuickMatch) {
                            partyClients.forEach(client => {
                                if (!client || !client.open || client === connection) return;
                                try {
                                    client.send({ type: 'action_text', fromId: actorId, text: data.text });
                                } catch (err) {
                                    console.warn('Failed to relay action text:', err);
                                }
                            });
                        }
                        handleRemoteOnlineActionText(actorId, data.text);
                    }
                }
                else if (data.type === 'party_sync') {
                    if (window.partyModeInstance) {
                        const syncId = normalizeNetworkId(data.id);
                        if (window.partyModeInstance.others[syncId]) {
                            window.partyModeInstance.others[syncId].matrix = data.matrix;
                            window.partyModeInstance.others[syncId].pos = data.pos;
                            window.partyModeInstance.others[syncId].color = data.color;
                        }

                        if (isHost) {
                            partyClients.forEach(c => {
                                if (c !== connection && c && c.open) c.send(data);
                            });
                        }
                    }
                }
                else if (data.type === 'party_lock') {
                    if (window.partyModeInstance && isHost) {
                        window.partyModeInstance.processLock(data);
                    }
                }
                else if (data.type === 'party_arena') {
                    if (window.partyModeInstance && !isHost) {
                        window.partyModeInstance.setState(data);
                        if (data.cleared > 0) window.partyModeInstance.showAction("LINE CLEAR!");
                    }
                }
                else if (data.type === 'party_attack') {
                    if (window.partyModeInstance && !isHost) {
                        window.partyModeInstance.receiveGarbage(data.amount);
                    }
                }
                else if (data.type === 'party_support') {
                    if (window.partyModeInstance && isHost) {
                        window.partyModeInstance.applySupport(data.action, data.id);
                    }
                }
                else if (data.type === 'party_cheer') {
                    if (window.partyModeInstance) {
                        window.partyModeInstance.showAction(data.text || 'CHEER!');
                    }
                }
                else if (data.type === 'party_dead') {
                    if (window.partyModeInstance && isHost) {
                        window.partyModeInstance.handleRemoteDeath(data.id, data.collective);
                    }
                }
                else if (data.type === 'skill_use') {
                    if (isHost && isStandardOnlineMatch()) {
                        routeStandardOnlineSkill(data.skill, data.fromId !== undefined ? data.fromId : connection.networkId);
                    }
                }
                else if (data.type === 'skill_effect') {
                    if (p1 && typeof p1.applySkillEffect === 'function') {
                        p1.applySkillEffect(data.skill, data.fromId !== undefined ? normalizeNetworkId(data.fromId) : null);
                        syncCurrentStandardOnlineState();
                    }
                }
                else if (data.type === 'attack') {
                    if (p1 && !p1.isGameOver) {
                        p1.receiveGarbage(data.amount);
                    }
                }
                else if (data.type === 'gameover') {
                    if (isStandardOnlineMatch()) {
                        const defeatedId = data.fromId !== undefined ? normalizeNetworkId(data.fromId) : normalizeNetworkId(connection.networkId);
                        handleRemoteStandardGameOver(defeatedId);
                    } else if (cpu && !cpu.isGameOver) {
                        cpu.isGameOver = true;
                        if (p1 && !p1.isGameOver) {
                            p1.isGameOver = true;
                            p1Wins++;
                            if (p1Wins >= targetWins) {
                                queueMatchSummary('victory', 'online');
                                showToast(TRANSLATIONS[cfg.lang].victory + " (Match Winner!)");
                            } else {
                                showToast(TRANSLATIONS[cfg.lang].victory + ` (Round Won! Score: ${p1Wins} - ${p2Wins})`);
                                setTimeout(() => resetRound(), 3000);
                            }
                        }
                    }
                }
                else if (data.type === 'party_gameover') {
                    if (window.partyModeInstance && !window.partyModeInstance.isGameOver) {
                        window.partyModeInstance.gameOver(data.winner);
                    }
                }
                else if (data.type === 'replay_archive') {
                    importReplayArchiveEntry(data.entry, true).then((savedEntry) => {
                        if (!savedEntry) return;
                        if (isHost && !isQuickMatch) broadcastReplayArchiveEntry(savedEntry, connection);
                        const replayMenu = document.getElementById('replay-menu');
                        if (replayMenu && replayMenu.style.display === 'block') {
                            listReplayArchiveEntries().then(renderReplayArchiveList).catch(err => console.warn('Failed to refresh replay list:', err));
                        }
                    }).catch((err) => {
                        console.warn('Failed to import remote replay archive:', err);
                    });
                }
            });

            connection.on('error', (err) => {
                const trackedConnection = connection === conn || partyClients.includes(connection);
                if (!trackedConnection) return;
                console.error("Connection Error:", err);
                clearQuickMatchRetryTimeout();
                if (isQuickMatch && !isOnline) {
                    clearQuickMatchReadyState();
                    qmIndex++;
                    searchQuickMatch();
                    return;
                }
                if (!isOnline) {
                    showToast(cfg.lang === 'ja' ? "接続に失敗しました" : "Connection failed.");
                    disconnectOnline();
                }
            });

            connection.on('close', () => {
                if (suppressConnectionCloseHandler) return;
                if (isHost && !isQuickMatch) {
                    const idx = partyClients.indexOf(connection);
                    if (idx > -1) {
                        const playerId = idx + 1;
                        partyClients.splice(idx, 1);
                        showToast(cfg.lang === 'ja' ? "参加者が切断しました" : "A player disconnected.");
                        broadcastLobbyState();

                        if (isOnline && window.partyModeInstance) {
                            window.partyModeInstance.handleRemoteDeath(playerId, window.partyModeInstance.sharedDeathMode === 'collective');
                        }
                    }
                } else {
                    clearQuickMatchReadyState();
                    if (activeMatchSession && activeMatchSession.summaryQueued) return;
                    if (p1 && p1.isGameOver) return;
                    if (window.partyModeInstance && window.partyModeInstance.isGameOver) return;
                    showToast(cfg.lang === 'ja' ? "対戦相手との通信が切断されました" : "Opponent disconnected.");
                    isPaused = true;
                    disconnectOnline(false);
                    setTimeout(() => returnToMenu(), 1000);
                }
            });
        }

        function hostRoom() {
            // Updated hostRoom behavior
            document.getElementById('btn-create-room').innerText = "...";
            targetWins = parseInt(document.getElementById('room-target-wins').value) || 1;
            isPartyMode = !!document.getElementById('room-party-mode').checked && getSelectedPartyVariant() === 'shared';
            targetPartyCount = parseInt(document.getElementById('room-party-count').value) || 4;
            applyRoomRulesFromSettings();
            partySlotRoles = ['player', 'player', 'player', 'player'];
            partySlotTeams = ['A', 'B', 'A', 'B'];
            if (!onlineRoomRules.allowSpectators) partySlotRoles = partySlotRoles.map(() => 'player');
            clearLobbyChat();
            pushLobbyChat("SYSTEM", cfg.lang === 'ja' ? "ルームを作成しました。" : "Room created.");

            const roomCode = "TETRIS-" + generateRoomCode();
            initPeer(roomCode, (id) => {
                isHost = true;
                partyClients = [];
                document.getElementById('room-settings-menu').style.display = 'none';
                document.getElementById('online-menu').style.display = 'none';
                document.getElementById('online-lobby').style.display = 'block';
                document.getElementById('lobby-room-code').innerText = id.replace("TETRIS-", "");
                document.getElementById('lobby-p1-name').innerText = cfg.playerName;
                document.getElementById('lobby-p2-name').innerText = "---";
                if (targetPartyCount >= 3) document.getElementById('lobby-slot-3').style.display = 'block';
                else document.getElementById('lobby-slot-3').style.display = 'none';
                if (targetPartyCount >= 4) document.getElementById('lobby-slot-4').style.display = 'block';
                else document.getElementById('lobby-slot-4').style.display = 'none';

                document.getElementById('lobby-p3-name').innerText = "---";
                document.getElementById('lobby-p4-name').innerText = "---";

                document.getElementById('btn-start-online').style.display = 'none';
                document.getElementById('lobby-status').innerText = TRANSLATIONS[cfg.lang]["online-waiting"];
                document.getElementById('lobby-status').style.color = '#ffaa00';
                lobbyProfileSnapshots = [buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')];
                renderLobbyProfilePanels();
                syncPartyLobbyRoleControls();
                updateOnlineLobbyExitButton();

                peer.on('connection', (connection) => {
                    if (partyClients.length >= targetPartyCount - 1 || isOnline) {
                        connection.on('open', () => {
                            connection.send({ type: 'reject', reason: 'full' });
                            setTimeout(() => connection.close(), 500);
                        });
                        return;
                    }
                    setupConnectionEvents(connection);
                });
            });
        }

        function hostChallengeRoom(targetName, targetSnapshot) {
            const safeName = String(targetName || '').trim().slice(0, 15);
            if (!safeName) return;
            targetWins = 1;
            isPartyMode = false;
            targetPartyCount = 2;
            onlineRoomRules = { ...DEFAULT_ROOM_RULES };
            clearLobbyChat();
            activeChallengeTargetName = safeName;
            const roomCode = "TETRIS-" + generateRoomCode();
            activeChallengeRoomCode = roomCode;
            initPeer(roomCode, (id) => {
                isHost = true;
                partyClients = [];
                stopFriendPresenceMonitor();
                document.getElementById('profile-menu').style.display = 'none';
                closeRemoteProfileOverlay();
                document.getElementById('room-settings-menu').style.display = 'none';
                document.getElementById('online-menu').style.display = 'none';
                document.getElementById('online-lobby').style.display = 'block';
                document.getElementById('lobby-room-code').innerText = id.replace("TETRIS-", "");
                document.getElementById('lobby-p1-name').innerText = cfg.playerName;
                document.getElementById('lobby-p2-name').innerText = "---";
                document.getElementById('lobby-slot-3').style.display = 'none';
                document.getElementById('lobby-slot-4').style.display = 'none';
                document.getElementById('lobby-p3-name').innerText = "---";
                document.getElementById('lobby-p4-name').innerText = "---";
                document.getElementById('btn-start-online').style.display = 'none';
                document.getElementById('lobby-status').innerText = trf('toast-challenge-room-ready', { name: safeName });
                document.getElementById('lobby-status').style.color = '#ffaa00';
                lobbyProfileSnapshots = [buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')];
                renderLobbyProfilePanels();
                updateOnlineLobbyExitButton();
                pushLobbyChat('SYSTEM', trf('toast-challenge-room-ready', { name: safeName }));
                peer.on('connection', (connection) => {
                    if (partyClients.length >= 1 || isOnline) {
                        connection.on('open', () => {
                            connection.send({ type: 'reject', reason: 'full' });
                            setTimeout(() => connection.close(), 500);
                        });
                        return;
                    }
                    setupConnectionEvents(connection);
                });
                openIdentityChannel(safeName, { type: 'challenge_request', roomCode: id.replace("TETRIS-", "") }, {
                    keepOpen: true,
                    timeoutMs: 120000,
                    onOpen: () => {
                        showToast(trf('toast-challenge-sent', { name: safeName }));
                    },
                    onData: (data, connection) => {
                        if (!data || data.type !== 'challenge_response') return;
                        if (data.accepted) {
                            showToast(trf('toast-challenge-accepted', { name: safeName }));
                        } else {
                            showToast(data.reason === 'busy' ? trf('toast-challenge-busy', { name: safeName }) : trf('toast-challenge-declined', { name: safeName }));
                            if (!conn && !partyClients.length) disconnectOnline();
                        }
                        closeIdentityConnection(connection);
                    },
                    onError: () => {
                        showToast(trf('toast-challenge-failed', { name: safeName }));
                        if (!conn && !partyClients.length) disconnectOnline();
                    },
                    onTimeout: () => {
                        showToast(trf('toast-challenge-failed', { name: safeName }));
                        if (!conn && !partyClients.length) disconnectOnline();
                    }
                });
            });
        }

        function joinRoomByCode(rawCode) {
            const code = String(rawCode || '').trim().toUpperCase().replace(/^TETRIS-/, '');
            if (!code) {
                showToast(TRANSLATIONS[cfg.lang]["online-err-empty"] || "Please enter a code.");
                return;
            }
            document.getElementById('btn-join-room').innerText = "...";
            clearLobbyChat();
            targetPartyCount = 2;

            initPeer(null, () => {
                isHost = false;
                stopFriendPresenceMonitor();
                const targetId = "TETRIS-" + code;

                document.getElementById('online-menu').style.display = 'none';
                document.getElementById('profile-menu').style.display = 'none';
                closeRemoteProfileOverlay();
                document.getElementById('online-lobby').style.display = 'block';
                document.getElementById('lobby-room-code').innerText = code;
                document.getElementById('lobby-p1-name').innerText = "---";
                document.getElementById('lobby-p2-name').innerText = cfg.playerName;
                document.getElementById('lobby-status').innerText = TRANSLATIONS[cfg.lang]["online-waiting"] || "Connecting...";
                document.getElementById('btn-start-online').style.display = 'none';
                lobbyProfileSnapshots = [null, buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')];
                renderLobbyProfilePanels();
                updateOnlineLobbyExitButton();

                try {
                    const connection = peer.connect(targetId, { reliable: true });
                    let connectionHandled = false;
                    const failJoin = () => {
                        if (connectionHandled) return;
                        connectionHandled = true;
                        try {
                            connection.close();
                        } catch (err) {
                            console.warn('Failed to close join connection:', err);
                        }
                        showToast(TRANSLATIONS[cfg.lang]["online-err-notfound"] || "Invalid or missing room code.");
                        disconnectOnline();
                    };

                    const connTimeout = setTimeout(() => {
                        if (connection.open) return;
                        failJoin();
                    }, 10000);

                    connection.on('open', () => {
                        connectionHandled = true;
                        clearTimeout(connTimeout);
                    });

                    connection.on('error', () => {
                        clearTimeout(connTimeout);
                        failJoin();
                    });

                    setupConnectionEvents(connection);
                } catch (e) {
                    showToast(TRANSLATIONS[cfg.lang]["online-err-notfound"] || "Invalid or missing room code.");
                    disconnectOnline();
                }
            });
        }

        function joinRoom() {
            joinRoomByCode(document.getElementById('join-code-input').value);
        }

        function startQuickMatch() {
            suppressConnectionCloseHandler = false;
            isQuickMatch = true;
            qmIndex = 1;
            quickMatchSearchToken++;
            targetPartyCount = 2;
            onlineRoomRules = { ...DEFAULT_ROOM_RULES };
            clearLobbyChat();
            clearQuickMatchReadyState();
            resetConnectionQuality();
            clearQuickMatchRetryTimeout();
            suspendIdentityReservation();

            document.getElementById('online-menu').style.display = 'none';
            document.getElementById('quick-match-lobby').style.display = 'block';
            lobbyProfileSnapshots = [buildPublicProfileSnapshot(cfg.playerName || 'PLAYER')];
            renderQuickMatchProfilePanels();
            updateQuickMatchReadyUI();

            let statusEl = document.getElementById('qm-status');
            statusEl.innerText = TRANSLATIONS[cfg.lang]["online-searching"] || "Searching for opponent...";
            statusEl.style.color = '#fff';
            statusEl.style.animation = 'pulseText 1.5s infinite';

            searchQuickMatch();
        }

        function cancelQuickMatch() {
            isQuickMatch = false;
            clearQuickMatchRetryTimeout();
            clearQuickMatchReadyState();
            peerGeneration++;
            if (peer) { peer.destroy(); peer = null; }
            if (conn) { conn.close(); conn = null; }
            document.getElementById('quick-match-lobby').style.display = 'none';
            document.getElementById('online-menu').style.display = 'block';
            resetLobbyProfileState();
            resumeIdentityReservation();
        }

        function searchQuickMatch() {
            if (qmIndex > 50) {
                showToast(cfg.lang === 'ja' ? "対戦相手が見つかりませんでした" : "No opponent found.");
                disconnectOnline();
                return;
            }

            clearQuickMatchRetryTimeout();
            suspendIdentityReservation();
            const searchToken = ++quickMatchSearchToken;
            const oldPeer = peer;
            peer = null;
            peerGeneration++;
            if (oldPeer) oldPeer.destroy();
            const targetId = "TETRIS-QM-" + qmIndex;

            // Try to become the host for this QM slot
            peer = createPeerInstance(targetId);
            const hostPeer = peer;

            hostPeer.on('open', (id) => {
                if (peer !== hostPeer || searchToken !== quickMatchSearchToken || !isQuickMatch) return;
                // Successfully hosted
                isHost = true;
                hostPeer.on('connection', (connection) => {
                    if (peer !== hostPeer || searchToken !== quickMatchSearchToken || !isQuickMatch) {
                        try {
                            connection.close();
                        } catch (err) {
                            console.warn('Failed to close stale quick match connection:', err);
                        }
                        return;
                    }
                    if (conn && conn.open || isOnline) {
                        connection.on('open', () => {
                            connection.send({ type: 'reject' });
                            setTimeout(() => connection.close(), 500);
                        });
                        return;
                    }
                    setupConnectionEvents(connection);
                });
            });

            hostPeer.on('error', (err) => {
                if (peer !== hostPeer || searchToken !== quickMatchSearchToken || !isQuickMatch) return;
                // If ID is already taken, someone is hosting it. Try to join them.
                if (err.type === 'unavailable-id') {
                    hostPeer.destroy();
                    peerGeneration++;
                    peer = createPeerInstance(generateClientPeerId('TETRIS-QMC'));
                    const joinPeer = peer;
                    joinPeer.on('open', () => {
                        if (peer !== joinPeer || searchToken !== quickMatchSearchToken || !isQuickMatch) return;
                        isHost = false;
                        document.getElementById('lobby-p1-name').innerText = "---";
                        document.getElementById('lobby-p2-name').innerText = cfg.playerName;

                        const connection = joinPeer.connect(targetId, { reliable: true });
                        setupConnectionEvents(connection);

                        // Fallback timeout in case the connection hangs
                        clearQuickMatchRetryTimeout();
                        quickMatchRetryTimeout = setTimeout(() => {
                            if (searchToken !== quickMatchSearchToken || !isQuickMatch || connection.open) return;
                            try {
                                connection.close();
                            } catch (closeErr) {
                                console.warn('Failed to close timed out quick match connection:', closeErr);
                            }
                            qmIndex++;
                            searchQuickMatch();
                        }, 6000);
                    });
                    joinPeer.on('error', (joinErr) => {
                        if (peer !== joinPeer || searchToken !== quickMatchSearchToken || !isQuickMatch) return;
                        console.error("Quick Match Join Error:", joinErr);
                        qmIndex++;
                        searchQuickMatch();
                    });
                } else {
                    console.error("Quick Match Error:", err);
                    showToast(cfg.lang === 'ja' ? "クイックマッチ中にエラーが発生しました" : "Error during Quick Match.");
                    disconnectOnline();
                }
            });
        }

        function resetOnlineLobby() {
            document.getElementById('btn-create-room').innerText = TRANSLATIONS[cfg.lang]["online-create"];
            document.getElementById('btn-join-room').innerText = TRANSLATIONS[cfg.lang]["online-join"];
        }

        function disconnectOnline(showMenu = true) {
            suppressConnectionCloseHandler = true;
            clearQuickMatchRetryTimeout();
            clearQuickMatchReadyState();
            clearMatchCountdown();
            peerGeneration++;
            quickMatchSearchToken++;
            const activeConn = conn;
            const activeClients = [...partyClients];
            const activePeer = peer;
            conn = null;
            peer = null;
            isOnline = false;
            isHost = false;
            isQuickMatch = false;
            isPartyMode = false;
            partyClients = [];
            opponents = [];
            onlinePlayerCount = 0;
            onlineMyIndex = 0;
            onlineRoomRules = { ...DEFAULT_ROOM_RULES };
            window.partyModeInstance = null;
            p1Wins = 0;
            p2Wins = 0;
            activeChallengeRoomCode = '';
            activeChallengeTargetName = '';
            if (activeConn) activeConn.close();
            activeClients.forEach(c => c.close());
            if (activePeer) activePeer.destroy();
            document.getElementById('online-lobby').style.display = 'none';
            document.getElementById('quick-match-lobby').style.display = 'none';
            document.getElementById('room-settings-menu').style.display = 'none';
            const partyView = document.getElementById('party-view');
            if (partyView) partyView.remove();
            const opponentsContainer = document.getElementById('opponents-container');
            if (opponentsContainer) opponentsContainer.remove();
            if (showMenu) document.getElementById('online-menu').style.display = 'block';
            else document.getElementById('online-menu').style.display = 'none';
            restoreGameViewLayout();
            resetOnlineLobby();
            updateOnlineLobbyExitButton();
            clearLobbyChat();
            resetConnectionQuality();
            resetLobbyProfileState();
            resumeIdentityReservation();
        }

        function startOnlineGame() {
            if (!isHost) return;
            if (isQuickMatch) {
                if (!quickMatchReadySelf || !quickMatchReadyRemote || quickMatchStartLock) {
                    updateQuickMatchReadyUI();
                    return;
                }
                quickMatchStartLock = true;
            }
            const countdownAt = Date.now() + Math.max(800, ((onlineRoomRules && onlineRoomRules.countdownSeconds) || 3.2) * 1000);
            const useSharedPartyMode = isPartyMode && !hasPartySpecialRules(onlineRoomRules);
            if (!useSharedPartyMode) isPartyMode = false;
            if (useSharedPartyMode) {
                partyClients.forEach((c, idx) => c.send({ type: 'start_party', playerCount: partyClients.length + 1, myIndex: idx + 1, countdownAt, partyRoles: partySlotRoles, partyTeams: partySlotTeams, roomRules: onlineRoomRules }));
                startPartyModeExecution(partyClients.length + 1, 0, countdownAt, partySlotRoles, partySlotTeams, onlineRoomRules);
            } else {
                if (isQuickMatch) {
                    if (!conn) return;
                    conn.send({ type: 'start', countdownAt });
                    startOnlineGameExecution(2, 0, countdownAt); // QuickMatch is always 2 players
                } else {
                    partyClients.forEach((c, idx) => c.send({ type: 'start_multi', playerCount: partyClients.length + 1, myIndex: idx + 1, countdownAt }));
                    startOnlineGameExecution(partyClients.length + 1, 0, countdownAt);
                }
            }
        }

        function applyRuleSetToActiveBoards(ruleSet) {
            const normalizedRuleSet = { ...DEFAULT_ROOM_RULES, ...ruleSet };
            const applyToBoard = (board) => {
                if (!board) return;
                const hasLiveState = !!(typeof board.networkId === 'number' && onlineStateCache[board.networkId]);
                if (typeof board.setRuleSet === 'function') board.setRuleSet(normalizedRuleSet, !hasLiveState);
                else board.ruleSet = { ...normalizedRuleSet };
                if ((board.player.time || 0) === 0 && (board.player.pieces || 0) === 0) {
                    board.player.level = normalizedRuleSet.startLevel;
                    if (!normalizedRuleSet.allowHold) board.player.canHold = false;
                    board.updateUI();
                }
            };
            applyToBoard(p1);
            applyToBoard(cpu);
            opponents.forEach(applyToBoard);
        }

        function startOnlineGameExecution(playerCount, myIndex, countdownAt = null) {
            resetSoloCpuHintState();
            isOnline = true;
            onlinePlayerCount = playerCount;
            onlineMyIndex = myIndex;
            resetOnlineRoundState();
            clearMatchSummaryState();
            clearQuickMatchReadyState();
            restoreGameViewLayout();
            document.getElementById('online-menu').style.display = 'none';
            document.getElementById('online-lobby').style.display = 'none';
            document.getElementById('quick-match-lobby').style.display = 'none';
            document.getElementById('btn-save-menu').style.display = 'none';
            document.getElementById('online-self-indicator').style.display = 'block';

            document.getElementById('menu').style.display = 'none';
            document.getElementById('mode-select-menu').style.display = 'none';
            document.getElementById('game-view').style.display = 'flex';
            updateTouchControlsVisibility();
            const meters = document.querySelectorAll('.meter-container');
            meters.forEach(m => m.style.display = 'block');
            document.getElementById('cpu-field').style.display = 'none'; // Hide default CPU field

            // Clean up old opponents DOM
            let opponentsContainer = document.getElementById('opponents-container');
            if (opponentsContainer) opponentsContainer.remove();

            opponentsContainer = document.createElement('div');
            opponentsContainer.id = 'opponents-container';
            opponentsContainer.style.display = 'flex';
            opponentsContainer.style.gap = '20px';
            document.getElementById('game-view').appendChild(opponentsContainer);

            isPaused = true;
            p1 = new Tetris('p-canvas', 'p-hold', 'p-next', 'p-score', false, 'p-action-layer', 'p-meter');
            p1.displayName = cfg.playerName || 'PLAYER 1';
            cpu = null;
            opponents = [];

            // playerCount is total (Host + Clients)
            let oppIndex = 0;
            for (let i = 0; i < playerCount; i++) {
                if (i === myIndex) {
                    p1.networkId = myIndex;
                    continue; // Skip myself
                }

                let name = "---";
                if (isHost) {
                    if (i === 0) name = cfg.playerName;
                    else if (isQuickMatch && conn && conn.peerName) name = conn.peerName;
                    else if (partyClients[i - 1]) name = partyClients[i - 1].peerName || `PLAYER ${i + 1}`;
                } else {
                    if (i === 0 && isQuickMatch && conn && conn.peerName) name = conn.peerName;
                    else if (i === 0) name = document.getElementById('lobby-p1-name').innerText;
                    else name = document.getElementById(`lobby-p${i + 1}-name`).innerText;
                }

                // Create DOM for opponent
                let oppId = 'opp-' + oppIndex;
                let scaleStr = playerCount > 2 ? 'transform: scale(0.85); transform-origin: top;' : '';

                opponentsContainer.insertAdjacentHTML('beforeend', `
                    <div style="display:flex; gap:10px; ${scaleStr}">
                        <div class="field-wrap" id="${oppId}-field">
                            <div style="font-size:12px; color:#ff5555; font-weight:bold; letter-spacing:2px; text-align:center;">
                                <span style="color:#00f0f0;">${name}</span>
                            </div>
                            <div class="board-area">
                                <div id="${oppId}-meter-container" class="meter-container" style="display:block;">
                                    <div id="${oppId}-meter" class="meter-fill" style="height:0%;"></div>
                                </div>
                                <div class="side-column">
                                    <div class="hold-next-box">
                                        <div class="stat-label">HOLD</div>
                                        <canvas id="${oppId}-hold" class="mini-canvas" width="60" height="60"></canvas>
                                    </div>
                                    <div class="stat-box"><div class="stat-label">SCORE</div><div id="${oppId}-score" class="stat-val">0</div></div>
                                </div>
                                <div style="position:relative;">
                                    <div id="${oppId}-action-layer" class="action-layer"></div>
                                    <canvas id="${oppId}-canvas" class="main-canvas" width="240" height="480"></canvas>
                                </div>
                                <div class="side-column">
                                    <div class="hold-next-box" style="padding-bottom:5px;">
                                        <div class="stat-label">NEXT</div>
                                        <canvas id="${oppId}-next-0" class="mini-canvas" width="60" height="60"></canvas>
                                        <canvas id="${oppId}-next-1" class="mini-canvas" width="60" height="60"></canvas>
                                        <canvas id="${oppId}-next-2" class="mini-canvas" width="60" height="60"></canvas>
                                        <canvas id="${oppId}-next-3" class="mini-canvas" width="60" height="60"></canvas>
                                        <canvas id="${oppId}-next-4" class="mini-canvas" width="60" height="60"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `);

                let newOpp = new Tetris(oppId + '-canvas', oppId + '-hold', oppId + '-next', oppId + '-score', true, oppId + '-action-layer', oppId + '-meter', null, true);
                newOpp.isNetworkPlayer = true;
                newOpp.isAI = true; // Just passive
                newOpp.networkId = i;
                newOpp.displayName = name;
                if (onlineStateCache[i]) newOpp.setState(onlineStateCache[i]);
                else {
                    newOpp.updateUI();
                    newOpp.updateMeter();
                    newOpp.draw();
                }
                opponents.push(newOpp);
                oppIndex++;
            }

            p1.opponents = opponents;
            applyRuleSetToActiveBoards(onlineRoomRules);
            beginMatchSession('online', onlineRoomRules);
            captureReplayFrame(performance.now(), true);
            refreshSkillPanel(p1);
            syncCurrentStandardOnlineState();
            setTimeout(() => {
                if (isStandardOnlineMatch()) syncCurrentStandardOnlineState();
            }, 120);
            startConnectionMonitor();

            runMatchCountdown(countdownAt, () => {
                if (!lastTime) animate();
                else lastTime = performance.now();
            });
        }

        function startPartyModeExecution(playerCount, myIndex, countdownAt = null, roles = partySlotRoles, teams = partySlotTeams, ruleSet = onlineRoomRules) {
            resetSoloCpuHintState();
            isOnline = true;
            isPartyMode = true;
            onlinePlayerCount = playerCount;
            onlineMyIndex = myIndex;
            const normalizedRuleSet = { ...DEFAULT_ROOM_RULES, ...(ruleSet || {}) };
            partySlotRoles = Array.from({ length: playerCount }, (_, index) => sanitizePartyRole((roles || [])[index] || 'player'));
            partySlotTeams = Array.from({ length: playerCount }, (_, index) => sanitizePartyTeam((teams || [])[index] || (index % 2 === 0 ? 'A' : 'B')));
            if (!normalizedRuleSet.allowSpectators) partySlotRoles = partySlotRoles.map(() => 'player');
            onlineRoomRules = { ...normalizedRuleSet };
            clearMatchSummaryState();
            beginMatchSession('party', normalizedRuleSet);
            startConnectionMonitor();
            refreshSkillPanel(null);
            document.getElementById('online-lobby').style.display = 'none';
            document.getElementById('btn-save-menu').style.display = 'none';
            document.getElementById('online-self-indicator').style.display = 'none';

            document.getElementById('menu').style.display = 'none';
            document.getElementById('mode-select-menu').style.display = 'none';
            document.getElementById('game-view').style.display = 'flex';
            updateTouchControlsVisibility();

            Array.from(document.getElementById('game-view').children).forEach(el => {
                if (el.id !== 'party-view') el.style.display = 'none';
            });

            let partyView = document.getElementById('party-view');
            if (!partyView) {
                partyView = document.createElement('div');
                partyView.id = 'party-view';
                partyView.style.display = 'flex';
                partyView.style.gap = '20px';
                partyView.style.alignItems = 'flex-start';
                partyView.style.width = '100%';
                partyView.style.justifyContent = 'center';
                document.getElementById('game-view').appendChild(partyView);
            }
            partyView.innerHTML = '';
            partyView.style.display = 'flex';

            let leftUI = document.createElement('div'); leftUI.className = 'field-wrap'; leftUI.style.gap = '20px';
            let centerUI = document.createElement('div');
            let rightUI = document.createElement('div'); rightUI.className = 'field-wrap'; rightUI.style.gap = '20px';

            let canvasWrap = document.createElement('div');
            canvasWrap.style.position = 'relative';

            let actionLayer = document.createElement('div');
            actionLayer.id = 'party-action-layer';
            actionLayer.className = 'action-layer';
            canvasWrap.appendChild(actionLayer);

            let partyCanvas = document.createElement('canvas');
            partyCanvas.id = 'party-canvas';
            partyCanvas.className = 'main-canvas';
            partyCanvas.width = 30 * 24;
            partyCanvas.height = 30 * 24;
            canvasWrap.appendChild(partyCanvas);

            centerUI.appendChild(canvasWrap);
            const supportPanel = document.createElement('div');
            supportPanel.id = 'party-support-panel';
            supportPanel.className = 'party-support-panel';
            supportPanel.style.display = 'none';
            supportPanel.innerHTML = `
                <div class="party-spectator-badge" id="party-spectator-badge">SUPPORT MODE</div>
                <button class="btn small" onclick="window.partyModeInstance && window.partyModeInstance.requestSupport('cheer')">CHEER</button>
                <button class="btn small" onclick="window.partyModeInstance && window.partyModeInstance.requestSupport('cleanTop')">TOP CLEAN</button>
            `;
            centerUI.appendChild(supportPanel);

            const roleText = { player: 'PLAYER', spectator: 'WATCH', cheer: 'CHEER' };
            const partyPlayerNames = [];
            for (let i = 0; i < playerCount; i++) {
                let name = '---';
                if (isHost) {
                    if (i === 0) name = cfg.playerName;
                    else if (partyClients[i - 1]) name = partyClients[i - 1].peerName || `PLAYER ${i + 1}`;
                } else {
                    if (i === 0) name = document.getElementById('lobby-p1-name').innerText;
                    else if (i === myIndex) name = cfg.playerName;
                    else name = document.getElementById(`lobby-p${i + 1}-name`).innerText;
                }
                partyPlayerNames[i] = name;
                const role = partySlotRoles[i] || 'player';
                const team = partySlotTeams[i] || '-';

                let pUI = document.createElement('div');
                pUI.className = 'board-area';
                pUI.innerHTML = `
                    <div class="side-column">
                        <div style="font-size:12px; color:${COLORS[(i % 7) + 1]}; font-weight:bold; letter-spacing:2px; text-align:center;">
                            ${escapeHtml(name)}
                            <div style="font-size:10px; color:#fff; opacity:.75; letter-spacing:1px;">${roleText[role] || 'PLAYER'} / TEAM ${escapeHtml(team)}</div>
                        </div>
                        <div class="hold-next-box" ${i !== myIndex || role === 'spectator' ? 'style="visibility:hidden;"' : ''}>
                            <div class="stat-label">HOLD</div>
                            <canvas id="party-hold-${i}" class="mini-canvas" width="60" height="60"></canvas>
                        </div>
                        <div class="stat-box"><div class="stat-label">SCORE</div><div id="party-score-${i}" class="stat-val">0</div></div>
                    </div>
                `;
                let nextCol = document.createElement('div');
                nextCol.className = 'side-column';
                nextCol.innerHTML = `
                    <div class="hold-next-box" style="padding-bottom:5px; ${i !== myIndex || role === 'spectator' ? 'visibility:hidden;' : ''}">
                        <div class="stat-label">NEXT</div>
                        <canvas id="party-next-${i}-0" class="mini-canvas" width="60" height="60"></canvas>
                        <canvas id="party-next-${i}-1" class="mini-canvas" width="60" height="60"></canvas>
                        <canvas id="party-next-${i}-2" class="mini-canvas" width="60" height="60"></canvas>
                    </div>
                `;
                pUI.appendChild(nextCol);

                if (i % 2 === 0) leftUI.appendChild(pUI);
                else rightUI.appendChild(pUI);
            }

            partyView.appendChild(leftUI);
            partyView.appendChild(centerUI);
            partyView.appendChild(rightUI);

            isPaused = true;
            p1 = null; cpu = null;

            window.partyModeInstance = new PartyTetris('party-canvas', playerCount, myIndex, {
                roles: partySlotRoles,
                teams: partySlotTeams,
                ruleSet: normalizedRuleSet
            });
            window.partyModeInstance.playerNames = cloneReplayValue(partyPlayerNames);
            captureReplayFrame(performance.now(), true);

            runMatchCountdown(countdownAt, () => {
                if (!lastTime) animate();
                else lastTime = performance.now();
            });
        }

        // --- Menu Functions ---
        let selectedTemplate = null;

        function formatReplayArchiveDate(timestamp) {
            const date = new Date(timestamp || Date.now());
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const mi = String(date.getMinutes()).padStart(2, '0');
            return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
        }

        function formatReplayArchiveDateOnly(timestamp) {
            const date = new Date(timestamp || Date.now());
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }

        function getReplayArchiveEntryMode(entry) {
            return entry && entry.replayData && entry.replayData.meta ? entry.replayData.meta.mode || 'solo' : 'solo';
        }

        function getReplayArchiveFilters() {
            const modeInput = document.getElementById('replay-filter-mode');
            const dateInput = document.getElementById('replay-filter-date');
            const opponentInput = document.getElementById('replay-filter-opponent');
            return {
                mode: modeInput ? modeInput.value : '',
                date: dateInput ? dateInput.value : '',
                opponent: opponentInput ? opponentInput.value.trim().toLowerCase() : ''
            };
        }

        function matchesReplayArchiveFilters(entry, filters) {
            if (filters.mode && getReplayArchiveEntryMode(entry) !== filters.mode) return false;
            if (filters.date && formatReplayArchiveDateOnly(entry.createdAt) !== filters.date) return false;
            if (filters.opponent) {
                const haystack = [
                    entry.ownerName || getReplayArchiveOwnerName(entry.replayData),
                    ...(entry.opponentNames || [])
                ].join(' ').toLowerCase();
                if (!haystack.includes(filters.opponent)) return false;
            }
            return true;
        }

        function updateReplayArchiveFilterSummary(filteredCount, totalCount) {
            const summary = document.getElementById('replay-filter-summary');
            if (!summary) return;
            const safeFiltered = Number(filteredCount) || 0;
            const safeTotal = Number(totalCount) || 0;
            const formats = {
                ja: `${safeFiltered}件 / 全${safeTotal}件`,
                ko: `${safeFiltered}개 / 전체 ${safeTotal}개`,
                zh: `${safeFiltered}条 / 共 ${safeTotal}条`,
                es: `${safeFiltered} resultados / ${safeTotal} total`,
                fr: `${safeFiltered} résultats / ${safeTotal} total`,
                en: `${safeFiltered} RESULTS / ${safeTotal} TOTAL`
            };
            summary.innerText = formats[cfg.lang] || formats.en;
        }

        function resetReplayArchiveFilters() {
            const modeInput = document.getElementById('replay-filter-mode');
            const dateInput = document.getElementById('replay-filter-date');
            const opponentInput = document.getElementById('replay-filter-opponent');
            if (modeInput) modeInput.value = '';
            if (dateInput) dateInput.value = '';
            if (opponentInput) opponentInput.value = '';
            renderReplayArchiveList();
        }

        function applyReplayArchiveFilters() {
            renderReplayArchiveList();
        }

        function renderReplayArchiveList(entries) {
            const list = document.getElementById('replay-archive-list');
            if (!list) return;
            if (Array.isArray(entries)) replayArchiveListCache = entries;
            const sourceEntries = Array.isArray(entries) ? entries : replayArchiveListCache;
            const filteredEntries = sourceEntries.filter(entry => matchesReplayArchiveFilters(entry, getReplayArchiveFilters()));
            updateReplayArchiveFilterSummary(filteredEntries.length, sourceEntries.length);
            if (!sourceEntries || !sourceEntries.length) {
                list.innerHTML = `
                    <div class="replay-library-empty">
                        ${escapeHtml(tr('replay-empty'))}
                    </div>
                `;
                return;
            }
            if (!filteredEntries.length) {
                list.innerHTML = `
                    <div class="replay-library-empty">
                        ${escapeHtml(tr('replay-no-match'))}
                    </div>
                `;
                return;
            }
            list.innerHTML = filteredEntries.map(entry => {
                const summary = entry.summary || {};
                const ownerName = escapeHtml(entry.ownerName || getReplayArchiveOwnerName(entry.replayData));
                const opponentNames = escapeHtml((entry.opponentNames || []).slice(0, 3).join(', ') || '---');
                const replayCode = escapeHtml(entry.code || '---');
                const replayMeta = entry.replayData && entry.replayData.meta ? entry.replayData.meta : {};
                const sourceTag = entry.source === 'remote'
                    ? tr('replay-source-shared')
                    : tr('replay-source-local');
                const modeLabel = escapeHtml(summary.modeLabel || getMatchModeLabel(replayMeta.mode || 'solo', replayMeta.soloModeId || null));
                const resultText = escapeHtml(summary.resultText || 'RESULT');
                const ppsText = escapeHtml(summary.pps || '0.00');
                const apmText = escapeHtml(summary.apm || '0.00');
                const lpmText = escapeHtml(summary.lpm || '0.00');
                return `
                    <div class="replay-library-card">
                        <div class="replay-library-top">
                            <div>
                                <div class="replay-library-code">${replayCode}</div>
                                <div class="replay-library-tags">
                                    <span class="replay-tag">${modeLabel}</span>
                                    <span class="replay-tag">${resultText}</span>
                                    <span class="replay-tag">${escapeHtml(formatReplayArchiveDate(entry.createdAt))}</span>
                                </div>
                            </div>
                            <div class="replay-tag">${escapeHtml(sourceTag)}</div>
                        </div>
                        <div class="replay-library-meta">
                            <div class="block">
                                <span class="hint">${escapeHtml(tr('replay-owner'))}</span>
                                <span class="value">${ownerName}</span>
                            </div>
                            <div class="block">
                                <span class="hint">${escapeHtml(tr('replay-opponents'))}</span>
                                <span class="value">${opponentNames}</span>
                            </div>
                            <div class="block">
                                <span class="hint">${escapeHtml(tr('replay-stats'))}</span>
                                <span class="value">${ppsText} / ${apmText} / ${lpmText}</span>
                            </div>
                            <div class="block">
                                <span class="hint">${escapeHtml(tr('replay-time-rating'))}</span>
                                <span class="value">${escapeHtml(summary.timeText || '--')} / ${escapeHtml(summary.ratingText || '--')}</span>
                            </div>
                        </div>
                        <div class="replay-library-actions">
                            <button class="btn replay-card-btn" style="--accent:#55ff55;" onclick="playReplayArchiveByCode('${entry.code}')">${escapeHtml(tr('replay-card-watch'))}</button>
                            <button class="btn replay-card-btn" style="--accent:#55aaff;" onclick="fillReplayCodeInput('${entry.code}')">${escapeHtml(tr('replay-card-use-code'))}</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function fillReplayCodeInput(code) {
            const input = document.getElementById('replay-code-input');
            if (input) input.value = code || '';
        }

        function showSoloMenu() {
            document.getElementById('main-menu-btns').style.display = 'none';
            document.getElementById('profile-menu').style.display = 'none';
            document.getElementById('solo-menu').style.display = 'block';
            updateSoloMenuMeta();
        }

        function hideSoloMenu() {
            document.getElementById('solo-menu').style.display = 'none';
            document.getElementById('main-menu-btns').style.display = 'block';
        }

        async function showReplayMenu() {
            if (blockAdminRestrictedAction()) return;
            document.getElementById('main-menu-btns').style.display = 'none';
            document.getElementById('solo-menu').style.display = 'none';
            document.getElementById('profile-menu').style.display = 'none';
            document.getElementById('tutorial-menu').style.display = 'none';
            document.getElementById('online-menu').style.display = 'none';
            document.getElementById('room-settings-menu').style.display = 'none';
            document.getElementById('online-lobby').style.display = 'none';
            document.getElementById('quick-match-lobby').style.display = 'none';
            document.getElementById('template-menu').style.display = 'none';
            document.getElementById('mode-select-menu').style.display = 'none';
            document.getElementById('replay-menu').style.display = 'block';
            try {
                renderReplayArchiveList(await listReplayArchiveEntries());
            } catch (err) {
                console.warn('Failed to load replay archive:', err);
                renderReplayArchiveList([]);
            }
        }

        function hideReplayMenu() {
            document.getElementById('replay-menu').style.display = 'none';
            updateTutorialEntryUI();
        }

        function playReplayArchiveEntry(entry) {
            if (!entry || !entry.replayData || !entry.replayData.frames || entry.replayData.frames.length < 2) {
                showToast(cfg.lang === 'ja' ? "リプレイデータが壊れています" : "Replay data is invalid.");
                return;
            }
            document.getElementById('replay-menu').style.display = 'none';
            pendingMatchSummary = null;
            startReplayPlayback(cloneReplayValue(entry.replayData), { returnToSummary: false });
        }

        async function playReplayArchiveByCode(code) {
            fillReplayCodeInput(code);
            await openReplayByCode();
        }

        async function openReplayByCode() {
            const input = document.getElementById('replay-code-input');
            const requestedCode = (input ? input.value : '').trim();
            if (!requestedCode) {
                showToast(cfg.lang === 'ja' ? "リプレイコードを入力してください" : "Please enter a replay code.");
                return;
            }

            try {
                let entry = await getReplayArchiveEntryByCode(requestedCode);
                if (!entry) {
                    showToast(cfg.lang === 'ja' ? "コードを検索しています..." : "Searching replay code...");
                    const remoteEntry = await requestReplayArchiveFromNetwork(requestedCode);
                    entry = await importReplayArchiveEntry(remoteEntry, true);
                    renderReplayArchiveList(await listReplayArchiveEntries());
                }
                if (!entry) {
                    showToast(cfg.lang === 'ja' ? "そのコードのリプレイは見つかりませんでした" : "Replay code not found.");
                    return;
                }
                fillReplayCodeInput(entry.code);
                playReplayArchiveEntry(entry);
            } catch (err) {
                console.warn('Failed to open replay by code:', err);
                showToast(cfg.lang === 'ja' ? "そのコードのリプレイを取得できませんでした" : "Could not load that replay code.");
            }
        }

        function startSoloMode(modeId) {
            if (!getSoloModeDef(modeId)) return;
            startGame(false, null, false, { soloModeId: modeId });
        }

        function showTemplateMenu() {
            if (blockAdminRestrictedAction()) return;
            document.getElementById('main-menu-btns').style.display = 'none';
            document.getElementById('solo-menu').style.display = 'none';
            document.getElementById('template-menu').style.display = 'block';
            renderCustomTemplateButtons();
        }

        function hideTemplateMenu() {
            document.getElementById('template-menu').style.display = 'none';
            document.getElementById('mode-select-menu').style.display = 'none';
            closeTemplateBuilder();
            document.getElementById('main-menu-btns').style.display = 'block';
            toggleElevatorMenu(false);
            toggleRenMenu(false);
            toggleTdMenu(false);
            togglePCMenu(false);
            toggleTspinMenu(false);
            selectedTemplate = null;
        }

        function selectTemplate(tmpl) {
            selectedTemplate = tmpl;
            document.getElementById('template-menu').style.display = 'none';
            document.getElementById('mode-select-menu').style.display = 'block';
        }

        function cancelTemplateSelect() {
            selectedTemplate = null;
            document.getElementById('mode-select-menu').style.display = 'none';
            document.getElementById('template-menu').style.display = 'block';
        }

        function startSelectedTemplate(isCPU) {
            startGame(isCPU, selectedTemplate);
        }

        function openTemplateBuilder() {
            const overlay = document.getElementById('template-builder-overlay');
            if (!overlay) return;
            if (overlay.parentElement !== document.body) document.body.appendChild(overlay);
            overlay.style.display = 'flex';
        }

        function closeTemplateBuilder() {
            const overlay = document.getElementById('template-builder-overlay');
            if (overlay) overlay.style.display = 'none';
        }

        function openTemplateJsonPicker() {
            const input = document.getElementById('template-json-file');
            if (input) input.click();
        }

        async function handleTemplateJsonFile(event) {
            const input = event && event.target ? event.target : document.getElementById('template-json-file');
            const file = input && input.files ? input.files[0] : null;
            if (!file) return;

            try {
                const raw = await file.text();
                const parsed = JSON.parse(raw);
                const template = normalizeCustomTemplateData(parsed);
                const defaultName = sanitizeCustomTemplateName(parsed.name || file.name.replace(/\.[^.]+$/, '')) || 'カスタムテンプレート';
                const decidedName = sanitizeCustomTemplateName(prompt('読み込んだテンプレートの名前を入力してください。', defaultName));
                if (!decidedName) {
                    showToast('テンプレート名が空です。');
                    return;
                }

                const record = {
                    id: createCustomTemplateId(),
                    name: decidedName,
                    template,
                    createdAt: Date.now()
                };
                customTemplates.push(record);
                registerCustomTemplateRecord(record);
                saveCustomTemplates();
                renderCustomTemplateButtons();
                showToast(`テンプレート「${decidedName}」を追加しました。`);
            } catch (error) {
                console.warn('Failed to import template JSON:', error);
                showToast(error.message || 'JSONの読み込みに失敗しました。');
            } finally {
                if (input) input.value = '';
            }
        }

        function toggleElevatorMenu(showSub) {
            const mainList = document.getElementById('tmpl-main-list');
            const subList = document.getElementById('tmpl-elevator-list');
            if (showSub) {
                mainList.style.display = 'none';
                subList.style.display = 'block';
            } else {
                mainList.style.display = 'block';
                subList.style.display = 'none';
            }
        }

        function toggleRenMenu(showSub) {
            const mainList = document.getElementById('tmpl-main-list');
            const subList = document.getElementById('tmpl-ren-list');
            if (showSub) {
                mainList.style.display = 'none';
                subList.style.display = 'block';
            } else {
                mainList.style.display = 'block';
                subList.style.display = 'none';
            }
        }

        function toggleTdMenu(showSub) {
            const mainList = document.getElementById('tmpl-main-list');
            const subList = document.getElementById('tmpl-td-list');
            if (showSub) {
                mainList.style.display = 'none';
                subList.style.display = 'block';
            } else {
                mainList.style.display = 'block';
                subList.style.display = 'none';
            }
        }

        function togglePCMenu(showSub) {
            const mainList = document.getElementById('tmpl-main-list');
            const subList = document.getElementById('tmpl-pc-list');
            if (showSub) {
                mainList.style.display = 'none';
                subList.style.display = 'block';
            } else {
                mainList.style.display = 'block';
                subList.style.display = 'none';
            }
        }

        function toggleTspinMenu(showSub) {
            const mainList = document.getElementById('tmpl-main-list');
            const subList = document.getElementById('tmpl-tspin-list');
            if (showSub) {
                mainList.style.display = 'none';
                subList.style.display = 'block';
            } else {
                mainList.style.display = 'block';
                subList.style.display = 'none';
            }
        }

        // --- Tetris Game Class ---
        class Tetris {
            constructor(canvasId, holdId, nextBaseId, scoreId, isAI = false, actionId = null, meterId = null, templateKey = null, isLoad = false) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                if (!this.canvas.dataset.baseWidth) {
                    this.canvas.dataset.baseWidth = String(this.canvas.width);
                    this.canvas.dataset.baseHeight = String(this.canvas.height);
                }
                this.baseCanvasWidth = parseInt(this.canvas.dataset.baseWidth, 10) || this.canvas.width;
                this.baseCanvasHeight = parseInt(this.canvas.dataset.baseHeight, 10) || this.canvas.height;
                this.holdCanvas = document.getElementById(holdId);
                this.isAI = isAI;
                this.isPlayerBoard = canvasId === 'p-canvas';
                this.hintCanvas = this.isPlayerBoard ? document.getElementById('p-hint-canvas') : null;
                this.hintCtx = this.hintCanvas ? this.hintCanvas.getContext('2d') : null;
                this.hintBadge = this.isPlayerBoard ? document.getElementById('p-hint-badge') : null;
                this.nextCount = 5;
                this.nextCanvases = Array.from({ length: this.nextCount }, (_, i) => document.getElementById(`${nextBaseId}-${i}`));
                this.riseNextCanvases = Array.from({ length: 2 }, (_, i) => document.getElementById(`${nextBaseId.replace('next', 'rise-next')}-${i}`));
                this.riseNextBox = document.getElementById(`${nextBaseId.replace('next', 'rise-next')}-box`);
                this.scoreElem = document.getElementById(scoreId);
                this.actionLayer = actionId ? document.getElementById(actionId) : null;
                this.meterFill = meterId ? document.getElementById(meterId) : null;

                this.boardWidth = 10;
                this.hiddenRows = 2;
                this.ruleSet = { ...DEFAULT_ROOM_RULES };
                this.visibleRows = 20;
                this.arenaHeight = 22;
                this.effects = { speedUpUntil: 0, slowUntil: 0 };
                this.bombCountdown = 14;
                this.survivalRushTimer = 0;
                this.arena = Array.from({ length: this.arenaHeight }, () => new Array(this.boardWidth).fill(0));
                this.player = {
                    pos: { x: 0, y: 0 }, matrix: null, type: null, color: null, score: 0, holdType: null, holdColor: null,
                    canHold: true, ren: -1, btb: false, rotation: 0, time: 0, pieces: 0, lines: 0, attacks: 0, level: 1,
                    tSpins: 0, garbageReceived: 0, maxRen: 0, perfectClears: 0, skillCoins: 0
                };
                this.bag = []; this.nextQueue = []; this.isGameOver = false; this.dropCounter = 0; this.pendingGarbage = 0;
                this.lockDelayThreshold = 500; this.lockDelayCounter = 0; this.dasL = 0; this.arrL = 0; this.dasR = 0; this.arrR = 0;
                this.lockResetCount = 0; this.hasTouchedGround = false;
                this.oSpinRotCount = 0; this.oSpinTimer = 0; this.isOtransformed = false;
                this.lastMoveRotate = false; this.lastRotationUsedKick = false;

                this.templateKey = templateKey;
                this.targetBoard = null;
                this.riseFrame = null;
                this.riseQueue = [];
                this.risePiece = null;
                this.riseActive = false;
                this.riseAllowedTop = this.hiddenRows;
                this.risePieceSerial = 0;
                this.applyRuleGeometry(true);

                if (!isLoad) {
                    if (this.templateKey) this.loadTemplate(this.templateKey);
                    while (this.nextQueue.length < 10) this.nextQueue.push(this.pullFromBag());
                    this.reset();
                }

                this.renderCpuHintOverlay(null);
            }

            getBoardWidth() {
                return this.boardWidth;
            }

            getVisibleRows() {
                return this.visibleRows;
            }

            getArenaHeight() {
                return this.arenaHeight;
            }

            getCellSize() {
                return Math.max(8, Math.floor(Math.min(this.canvas.width / this.getBoardWidth(), this.canvas.height / this.getVisibleRows())));
            }

            getPreferredCellSize() {
                const baseCell = Math.max(8, Math.floor(this.baseCanvasWidth / this.getBoardWidth()));
                if (!this.ruleSet.tallBoard) return baseCell;

                const viewportW = window.innerWidth || 900;
                const viewportH = window.innerHeight || 700;
                const sideAllowance = cpu || isOnline || window.partyModeInstance ? 460 : 250;
                const widthBudget = Math.max(120, viewportW - sideAllowance);
                const heightBudget = Math.max(360, viewportH - 170);
                const widthCell = Math.floor(widthBudget / this.getBoardWidth());
                const heightCell = Math.floor(heightBudget / this.getVisibleRows());
                return Math.max(8, Math.min(baseCell, widthCell, heightCell));
            }

            resizeMainCanvasForRows() {
                const cellSize = this.getPreferredCellSize();
                const width = this.getBoardWidth() * cellSize;
                const height = this.getVisibleRows() * cellSize;
                this.canvas.width = width;
                this.canvas.height = height;
                this.canvas.style.width = `${width}px`;
                this.canvas.style.height = `${height}px`;
                if (this.hintCanvas) {
                    this.hintCanvas.width = width;
                    this.hintCanvas.height = height;
                    this.hintCanvas.style.width = `${width}px`;
                    this.hintCanvas.style.height = `${height}px`;
                }
                const meter = this.meterFill ? this.meterFill.parentElement : null;
                if (meter) meter.style.height = `${height}px`;
            }

            getDisplayOffsetY() {
                return -this.hiddenRows;
            }

            cloneMatrix(matrix) {
                return JSON.parse(JSON.stringify(matrix));
            }

            scaleMatrix(matrix, factor) {
                if (!matrix || factor <= 1) return this.cloneMatrix(matrix);
                const result = [];
                matrix.forEach(row => {
                    const expandedRow = [];
                    row.forEach(cell => {
                        for (let i = 0; i < factor; i++) expandedRow.push(cell !== 0 ? 1 : 0);
                    });
                    for (let i = 0; i < factor; i++) result.push([...expandedRow]);
                });
                return result;
            }

            createPieceMatrix(type) {
                const base = PIECES[type] || [[1]];
                if (this.ruleSet.giantBlocks && type !== 'B') return this.scaleMatrix(base, 2);
                return this.cloneMatrix(base);
            }

            getPreviewMatrix(type) {
                const base = PIECES[type] || [[1]];
                return this.cloneMatrix(base);
            }

            getBombSpawnInterval() {
                return 12 + Math.floor(Math.random() * 5);
            }

            applyRuleGeometry(resetArena = false) {
                this.visibleRows = this.ruleSet.tallBoard ? 40 : 20;
                this.arenaHeight = this.visibleRows + this.hiddenRows;
                this.resizeMainCanvasForRows();
                if (resetArena || !this.arena || this.arena.length !== this.arenaHeight || this.arena[0].length !== this.boardWidth) {
                    this.arena = Array.from({ length: this.arenaHeight }, () => new Array(this.boardWidth).fill(0));
                }
                if (this.targetBoard && (this.targetBoard.length !== this.arenaHeight || this.targetBoard[0].length !== this.boardWidth)) {
                    this.targetBoard = Array.from({ length: this.arenaHeight }, () => new Array(this.boardWidth).fill(-1));
                }
                const grid = `${this.getCellSize()}px ${this.getCellSize()}px`;
                this.canvas.style.backgroundSize = grid;
            }

            setRuleSet(ruleSet, resetArena = false) {
                this.ruleSet = { ...DEFAULT_ROOM_RULES, ...ruleSet };
                this.applyRuleGeometry(resetArena);
                if (resetArena) {
                    this.effects = { speedUpUntil: 0, slowUntil: 0 };
                    this.bombCountdown = this.getBombSpawnInterval();
                    this.survivalRushTimer = 0;
                    this.player.holdType = null;
                    this.player.holdColor = null;
                    this.player.skillCoins = 0;
                    this.bag = [];
                    this.nextQueue = [];
                    while (this.nextQueue.length < 10) this.nextQueue.push(this.pullFromBag());
                    if (!this.isGameOver) this.reset();
                }
                this.updateUI();
                this.draw();
            }

            getSpawnPosition(matrix = this.player.matrix) {
                return {
                    x: Math.floor((this.getBoardWidth() - (matrix ? matrix[0].length : 1)) / 2),
                    y: this.hiddenRows
                };
            }

            getPieceColor(type) {
                return type === 'B' ? 9 : Object.keys(PIECES).indexOf(type) + 1;
            }

            addSkillCoins(amount) {
                if (!this.ruleSet.skillMode || !amount) return;
                this.player.skillCoins = Math.max(0, Math.min(99, (this.player.skillCoins || 0) + amount));
                refreshSkillPanel(this);
            }

            getTimeScale() {
                let scale = 1;
                const now = performance.now();
                if (this.effects.speedUpUntil > now) scale *= 2;
                if (this.effects.slowUntil > now) scale *= 0.55;
                if (adminControlEnabled && this === p1 && adminCheats.slowMotion) scale *= (adminCheats.settings.slowMotionFactor || 0.35);
                return scale;
            }

            applyWallObstacle() {
                const wallHeight = Math.min(8, this.getVisibleRows());
                const wallColumn = Math.max(0, Math.min(this.getBoardWidth() - 1, Math.floor(Math.random() * this.getBoardWidth())));
                for (let i = 0; i < wallHeight; i++) {
                    const y = this.getArenaHeight() - 1 - i;
                    this.arena[y][wallColumn] = 8;
                }
                let lift = 0;
                while (this.collide() && lift < this.getArenaHeight()) {
                    this.player.pos.y--;
                    lift++;
                }
                if (this.player.pos.y < 0) this.gameOver();
            }

            applySkillEffect(skillKey, fromId = null) {
                const skill = PARTY_SKILLS[skillKey];
                if (!skill || this.isGameOver) return false;
                const now = performance.now();
                if (skillKey === 'speed') {
                    this.effects.speedUpUntil = Math.max(this.effects.speedUpUntil, now + skill.duration);
                    this.showAction(`JAMMED${fromId !== null ? `\nP${fromId + 1}` : ''}`);
                } else if (skillKey === 'wall') {
                    this.applyWallObstacle();
                    this.showAction(`WALL${fromId !== null ? `\nP${fromId + 1}` : ''}`);
                } else if (skillKey === 'slow') {
                    this.effects.slowUntil = Math.max(this.effects.slowUntil, now + skill.duration);
                    this.showAction("FOCUS");
                } else if (skillKey === 'clean') {
                    let changed = false;
                    const start = this.hiddenRows || 0;
                    const end = Math.min(this.getArenaHeight(), start + 4);
                    for (let y = start; y < end; y++) {
                        if (this.arena[y] && this.arena[y].some(Boolean)) {
                            this.arena[y].fill(0);
                            changed = true;
                        }
                    }
                    if (!changed) {
                        const firstFilled = this.arena.findIndex(row => row.some(Boolean));
                        if (firstFilled >= 0) this.arena[firstFilled].fill(0);
                    }
                    this.showAction("TOP CLEAN");
                }
                this.updateUI();
                captureReplayFrame(performance.now(), true);
                return true;
            }

            useSkill(skillKey) {
                const skill = PARTY_SKILLS[skillKey];
                if (!skill || !this.ruleSet.skillMode || this.isGameOver) return false;
                if ((this.player.skillCoins || 0) < skill.cost) {
                    showToast(cfg.lang === 'ja' ? "コインが足りません" : "Not enough coins.");
                    return false;
                }
                this.player.skillCoins -= skill.cost;
                refreshSkillPanel(this);
                if (skillKey === 'slow' || skillKey === 'clean') {
                    this.applySkillEffect(skillKey, this.networkId);
                    syncCurrentStandardOnlineState();
                    return true;
                }
                const sent = sendStandardOnlineSkillRequest(skillKey, this.networkId);
                if (!sent) {
                    this.player.skillCoins += skill.cost;
                    refreshSkillPanel(this);
                    showToast(cfg.lang === 'ja' ? "スキル送信に失敗しました" : "Failed to send skill.");
                    return false;
                }
                this.showAction(skill.label);
                syncCurrentStandardOnlineState();
                return true;
            }

            getState() {
                return {
                    arena: this.arena.map(row => row.map(v => v === 0 ? '.' : v).join('')),
                    player: JSON.parse(JSON.stringify(this.player)),
                    bag: JSON.parse(JSON.stringify(this.bag)),
                    nextQueue: JSON.parse(JSON.stringify(this.nextQueue)),
                    pendingGarbage: this.pendingGarbage,
                    isGameOver: this.isGameOver,
                    targetBoard: this.targetBoard ? this.targetBoard.map(row => row.map(v => v === -1 ? '.' : v).join('')) : null,
                    bombCountdown: this.bombCountdown,
                    survivalRushTimer: this.survivalRushTimer || 0,
                    lockDelayCounter: this.lockDelayCounter,
                    lockResetCount: this.lockResetCount || 0,
                    hasTouchedGround: !!this.hasTouchedGround,
                    dropCounter: this.dropCounter,
                    effects: cloneReplayValue(this.effects),
                    oSpinRotCount: this.oSpinRotCount || 0,
                    oSpinTimer: this.oSpinTimer || 0,
                    isOtransformed: !!this.isOtransformed,
                    lastMoveRotate: !!this.lastMoveRotate,
                    lastRotationUsedKick: !!this.lastRotationUsedKick
                };
            }

            setState(state) {
                if (state.arena && typeof state.arena[0] === 'string') {
                    this.arena = state.arena.map(row => row.split('').map(c => c === '.' ? 0 : parseInt(c)));
                } else {
                    this.arena = state.arena;
                }

                this.player = state.player;
                if (typeof this.player.level === 'undefined') this.player.level = 1;
                if (typeof this.player.time === 'undefined') this.player.time = 0;
                if (typeof this.player.pieces === 'undefined') this.player.pieces = 0;
                if (typeof this.player.attacks === 'undefined') this.player.attacks = 0;
                if (typeof this.player.tSpins === 'undefined') this.player.tSpins = 0;
                if (typeof this.player.garbageReceived === 'undefined') this.player.garbageReceived = 0;
                if (typeof this.player.maxRen === 'undefined') this.player.maxRen = 0;
                if (typeof this.player.perfectClears === 'undefined') this.player.perfectClears = 0;
                if (typeof this.player.skillCoins === 'undefined') this.player.skillCoins = 0;
                this.bag = state.bag;
                this.nextQueue = state.nextQueue;
                this.pendingGarbage = state.pendingGarbage;
                this.isGameOver = state.isGameOver;

                if (state.targetBoard && typeof state.targetBoard[0] === 'string') {
                    this.targetBoard = state.targetBoard.map(row => row.split('').map(c => c === '.' ? -1 : parseInt(c)));
                } else {
                    this.targetBoard = state.targetBoard;
                }

                this.lockDelayCounter = state.lockDelayCounter || 0;
                this.lockResetCount = state.lockResetCount || 0;
                this.hasTouchedGround = !!state.hasTouchedGround;
                this.dropCounter = state.dropCounter || 0;
                this.bombCountdown = typeof state.bombCountdown === 'number' ? state.bombCountdown : this.getBombSpawnInterval();
                this.survivalRushTimer = state.survivalRushTimer || 0;
                this.effects = cloneReplayValue(state.effects || { speedUpUntil: 0, slowUntil: 0 });
                this.oSpinRotCount = state.oSpinRotCount || 0;
                this.oSpinTimer = state.oSpinTimer || 0;
                this.isOtransformed = !!state.isOtransformed;
                this.lastMoveRotate = !!state.lastMoveRotate;
                this.lastRotationUsedKick = !!state.lastRotationUsedKick;
                this.updateUI();
                this.updateMeter();
                refreshSkillPanel(this);
                if (!this.isAI) syncSoloCpuHint();
            }

            loadTemplate(tmplKey) {
                const t = TEMPLATES[tmplKey]; if (!t) return;
                const boardRows = (t.board || [])
                    .map(row => String(row || '').padEnd(this.getBoardWidth(), '.').slice(0, this.getBoardWidth()))
                    .slice(-this.getArenaHeight());

                if (this.isAI) {
                    this.targetBoard = Array.from({ length: this.getArenaHeight() }, () => new Array(this.getBoardWidth()).fill(-1));
                    let startY = this.getArenaHeight() - boardRows.length;
                    for (let i = 0; i < boardRows.length; i++) {
                        for (let j = 0; j < this.getBoardWidth(); j++) {
                            this.targetBoard[startY + i][j] = boardRows[i][j] === '.' ? 0 : 1;
                        }
                    }
                } else {
                    let startY = this.getArenaHeight() - boardRows.length;
                    for (let i = 0; i < boardRows.length; i++) {
                        for (let j = 0; j < this.getBoardWidth(); j++) { this.arena[startY + i][j] = boardRows[i][j] === '.' ? 0 : parseInt(boardRows[i][j]); }
                    }
                    this.nextQueue = [...t.queue];
                    if (t.hold) { this.player.holdType = t.hold; this.player.holdColor = this.getPieceColor(t.hold); }
                }
            }

            applyTemplateSetup(tmplKey) {
                const t = TEMPLATES[tmplKey];
                if (!t) return false;
                this.templateKey = tmplKey;
                this.ruleSet = { ...DEFAULT_ROOM_RULES, tallBoard: !!t.tallBoard };
                this.applyRuleGeometry(true);
                this.arena = Array.from({ length: this.getArenaHeight() }, () => new Array(this.getBoardWidth()).fill(0));
                this.targetBoard = null;
                this.bag = [];
                this.nextQueue = [];
                this.pendingGarbage = 0;
                this.player.holdType = null;
                this.player.holdColor = null;
                this.player.canHold = true;
                this.lockDelayCounter = 0;
                this.lockResetCount = 0;
                this.hasTouchedGround = false;
                this.loadTemplate(tmplKey);
                while (this.nextQueue.length < 10) this.nextQueue.push(this.pullFromBag());
                this.reset();
                this.updateMeter();
                this.updateUI();
                this.draw();
                return true;
            }

            pullFromBag() {
                if (this.ruleSet.chaosMode && Math.random() < 0.12) return 'B';
                if (this.ruleSet.bombMino) {
                    if (typeof this.bombCountdown !== 'number' || this.bombCountdown <= 0) {
                        this.bombCountdown = this.getBombSpawnInterval();
                    }
                    this.bombCountdown--;
                    if (this.bombCountdown <= 0) {
                        this.bombCountdown = this.getBombSpawnInterval();
                        return 'B';
                    }
                }
                if (this.bag.length === 0) {
                    this.bag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
                    for (let i = this.bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]; }
                }
                return this.bag.shift();
            }

            reset() {
                if (this.isGameOver) return;
                if (adminControlEnabled && this === p1 && adminCheats.shield) {
                    this.pendingGarbage = 0;
                    this.updateMeter();
                }
                if (this.pendingGarbage > 0) { this.pushGarbageToArena(this.pendingGarbage); this.pendingGarbage = 0; this.updateMeter(); }
                this.player.type = this.nextQueue.shift();
                this.nextQueue.push(this.pullFromBag());
                this.player.matrix = this.createPieceMatrix(this.player.type);
                this.player.color = this.getPieceColor(this.player.type);
                this.player.pos = this.getSpawnPosition(this.player.matrix);
                if ((this.player.time || 0) === 0 && (this.player.pieces || 0) === 0) this.player.level = (this.ruleSet && this.ruleSet.startLevel) || 1;
                this.player.rotation = 0; this.player.canHold = true; this.lockDelayCounter = 0;
                this.lockResetCount = 0; this.hasTouchedGround = false;
                this.isOtransformed = false; this.oSpinRotCount = 0; this.oSpinTimer = 0; this.lastMoveRotate = false; this.lastRotationUsedKick = false;
                if (this.collide()) { this.player.pos.y--; if (this.collide()) this.gameOver(); }
                if (this.isAI) this.aiPlan();
                this.updateUI();
                refreshSkillPanel(this);
                if (!this.isAI) syncSoloCpuHint();
            }

            collide(m = this.player.matrix, o = this.player.pos) {
                for (let y = 0; y < m.length; ++y) {
                    for (let x = 0; x < m[y].length; ++x) {
                        if (m[y][x] !== 0) {
                            const ay = y + o.y, ax = x + o.x;
                            if (ay >= this.getArenaHeight() || ax < 0 || ax >= this.getBoardWidth() || (ay >= 0 && this.arena[ay][ax] !== 0)) return true;
                        }
                    }
                }
                return false;
            }

            isPieceGrounded(m = this.player.matrix, o = this.player.pos) {
                return this.collide(m, { x: o.x, y: o.y + 1 });
            }

            registerLockResetAction(wasGrounded = false) {
                const groundedNow = this.isPieceGrounded();
                if (!this.hasTouchedGround && !wasGrounded && !groundedNow) return false;
                this.hasTouchedGround = true;
                this.lockResetCount = (this.lockResetCount || 0) + 1;
                if (this.lockResetCount >= LOCK_RESET_LIMIT) {
                    this.lock();
                    return true;
                }
                return false;
            }

            playerRotate(dir) {
                if (!this.isAI && this === p1 && isAdminControlLockActive()) return false;
                const oldM = JSON.parse(JSON.stringify(this.player.matrix));
                const oldR = this.player.rotation;
                const oldP = { ...this.player.pos };
                const wasGrounded = this.isPieceGrounded(oldM, oldP);
                const newR = (oldR + dir + 4) % 4;
                const rotated = this.player.matrix[0].map((_, i) => this.player.matrix.map(row => row[i]));
                this.player.matrix = dir > 0 ? rotated.map(row => row.reverse()) : rotated.reverse();
                const kickTable = (this.player.type === 'I') ? KICKS_I : KICKS;
                const kickSet = kickTable[`${oldR}-${newR}`] || [[0, 0]];
                const kickScale = (this.ruleSet.giantBlocks && this.player.type !== 'B') ? 2 : 1;
                let success = false;
                let usedKick = false;
                for (let [kx, ky] of kickSet) {
                    this.player.pos.x += kx * kickScale; this.player.pos.y -= ky * kickScale;
                    if (!this.collide()) {
                        if (this.player.type === 'I' && this.player.pos.y < oldP.y && !this.isPieceGrounded()) {
                            this.player.pos = { ...oldP };
                            continue;
                        }
                        success = true;
                        usedKick = (kx !== 0 || ky !== 0);
                        break;
                    }
                    this.player.pos = { ...oldP };
                }
                if (success) {
                    this.player.rotation = newR; this.lastMoveRotate = true; this.lastRotationUsedKick = usedKick; this.lockDelayCounter = 0;
                    if (cfg.ospin && this.player.type === 'O' && !this.isOtransformed) {
                        if (this.oSpinRotCount === 0) this.oSpinTimer = 3000;
                        this.oSpinRotCount++;
                        if (this.oSpinRotCount >= 15 && this.oSpinTimer > 0) {
                            if (typeof cfg.ospinTransform === 'undefined' || cfg.ospinTransform === 'fixed') {
                                this.player.matrix = this.createPieceMatrix('I');
                            } else {
                                const pList = ['I', 'J', 'L', 'S', 'T', 'Z'];
                                const rType = pList[Math.floor(Math.random() * pList.length)];
                                this.player.matrix = this.createPieceMatrix(rType);
                            }
                            // Modify matrix internally to use the player's original O-mino color (Yellow)
                            this.player.matrix = this.player.matrix.map(row => row.map(cell => cell !== 0 ? this.player.color : 0));
                            this.isOtransformed = true; this.showAction("O-SPIN");
                        }
                    }
                    captureReplayFrame(performance.now(), true);
                    this.registerLockResetAction(wasGrounded);
                } else { this.player.matrix = oldM; this.player.pos = { ...oldP }; this.lastRotationUsedKick = false; }
                if (!this.isAI) syncSoloCpuHint();
            }

            playerMove(dir) {
                if (!this.isAI && this === p1 && isAdminControlLockActive()) return false;
                const wasGrounded = this.isPieceGrounded();
                this.player.pos.x += dir;
                if (this.collide()) {
                    this.player.pos.x -= dir;
                    if (!this.isAI) syncSoloCpuHint();
                    return false;
                }
                this.lastMoveRotate = false; this.lastRotationUsedKick = false; this.lockDelayCounter = 0;
                captureReplayFrame(performance.now());
                this.registerLockResetAction(wasGrounded);
                if (!this.isAI) syncSoloCpuHint();
                return true;
            }

            playerDrop(isSoftDrop = false) {
                if (!this.isAI && this === p1 && isAdminControlLockActive()) return false;
                this.player.pos.y++;
                if (this.collide()) {
                    this.player.pos.y--;
                    if (!this.isAI) syncSoloCpuHint();
                    return false;
                }
                if (isSoftDrop && !this.isAI) { this.player.score += 1; this.updateUI(); }
                this.lockDelayCounter = 0; this.dropCounter = 0; this.lastMoveRotate = false; this.lastRotationUsedKick = false;
                if (!this.isAI) syncSoloCpuHint();
                return true;
            }

            hardDrop() {
                if (!this.isAI && this === p1 && isAdminControlLockActive()) return false;
                if (adminControlEnabled && this === p1 && adminCheats.hardDropOnlyI) forceAdminNextPiece('I');
                let dropped = 0;
                while (this.playerDrop()) {
                    dropped++;
                }
                if (!this.isAI && dropped > 0) {
                    this.player.score += dropped * 2;
                    this.updateUI();
                }
                this.lock();
                captureReplayFrame(performance.now(), true);
            }

            detonateBomb() {
                const cx = this.player.pos.x;
                const cy = this.player.pos.y;
                for (let y = cy - 1; y <= cy + 1; y++) {
                    for (let x = cx - 1; x <= cx + 1; x++) {
                        if (y >= 0 && y < this.getArenaHeight() && x >= 0 && x < this.getBoardWidth()) {
                            this.arena[y][x] = 0;
                        }
                    }
                }
                this.showAction("BOMB!");
            }

            lock() {
                let tSpinInfo = { isTSpin: false, isMini: false };
                if (!this.ruleSet.giantBlocks && this.player.type === 'T' && this.lastMoveRotate) tSpinInfo = this.checkTSpin();
                const genericSpinActive = !!this.checkGenericSpinLabel();
                if (this.player.type === 'B') {
                    this.detonateBomb();
                } else {
                    this.player.matrix.forEach((row, y) => row.forEach((v, x) => {
                        if (v !== 0 && this.arena[y + this.player.pos.y]) this.arena[y + this.player.pos.y][x + this.player.pos.x] = this.player.color;
                    }));
                }
                this.player.pieces++;
                this.sweep(tSpinInfo, genericSpinActive); this.reset();
                captureReplayFrame(performance.now(), true);
            }

            checkTSpin() {
                let corners = 0; let frontCorners = 0; const { x, y } = this.player.pos;
                const cornerCoords = [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: 2, y: 2 }];
                const frontMap = { 0: [0, 1], 1: [1, 3], 2: [2, 3], 3: [0, 2] };
                const myFronts = frontMap[this.player.rotation];
                cornerCoords.forEach((c, i) => {
                    const ay = y + c.y, ax = x + c.x;
                    if (ax < 0 || ax >= this.getBoardWidth() || ay >= this.getArenaHeight() || (ay >= 0 && this.arena[ay][ax] !== 0)) { corners++; if (myFronts.includes(i)) frontCorners++; }
                });
                return corners >= 3 ? { isTSpin: true, isMini: frontCorners < 2 } : { isTSpin: false, isMini: false };
            }

            getSpinLineLabel(lines) {
                const lineNames = ["NON-LINE", "SINGLE", "DOUBLE", "TRIPLE", "QUAD"];
                return lineNames[Math.min(lines, 4)] || `${lines} LINES`;
            }

            checkGenericSpinLabel(lines = 0) {
                if (cfg.allSpinDisplay === false || !this.lastMoveRotate) return null;
                if (!['I', 'J', 'L', 'S', 'Z'].includes(this.player.type)) return null;
                const downBlocked = this.collide(this.player.matrix, { x: this.player.pos.x, y: this.player.pos.y + 1 });
                const leftBlocked = this.collide(this.player.matrix, { x: this.player.pos.x - 1, y: this.player.pos.y });
                const rightBlocked = this.collide(this.player.matrix, { x: this.player.pos.x + 1, y: this.player.pos.y });
                const blockedCount = (downBlocked ? 1 : 0) + (leftBlocked ? 1 : 0) + (rightBlocked ? 1 : 0);
                if (!this.lastRotationUsedKick && blockedCount < 3 && !(downBlocked && (leftBlocked || rightBlocked))) return null;
                return `${this.player.type}-SPIN ${this.getSpinLineLabel(lines)}`;
            }

            sweep(tSpinInfo, genericSpinActive = false) {
                let lines = 0;
                outer: for (let y = this.getArenaHeight() - 1; y >= 0; --y) {
                    for (let x = 0; x < this.getBoardWidth(); ++x) { if (this.arena[y][x] === 0) continue outer; }
                    this.arena.splice(y, 1); this.arena.unshift(new Array(this.getBoardWidth()).fill(0)); ++y; lines++;
                }
                const genericSpinLabel = genericSpinActive ? this.checkGenericSpinLabel(lines) : null;

                if (lines > 0) {
                    this.player.lines += lines;
                    let isSoloMode = (typeof cpu === 'undefined' || !cpu) && (typeof isOnline === 'undefined' || !isOnline) && (typeof window.partyModeInstance === 'undefined' || !window.partyModeInstance) && !this.targetBoard;
                    let enableLvLog = true;
                    if (isSoloMode && typeof cfg !== 'undefined' && cfg.enableLevelUp === false) {
                        enableLvLog = false;
                    }
                    if (enableLvLog) {
                        this.player.level = Math.floor(this.player.lines / 10) + 1;
                    }
                }
                const isPerfectClear = this.arena.every(row => row.every(cell => cell === 0));

                if (lines > 0 || tSpinInfo.isTSpin || genericSpinLabel) {
                    let actionText = ""; let atk = 0;
                    let lineScore = 0;
                    const level = cfg.lv || 1;
                    const cappedLines = Math.min(lines, 4);
                    const overflowLines = Math.max(0, lines - 4);

                    if (tSpinInfo.isTSpin) {
                        const mini = tSpinInfo.isMini ? "MINI " : "";
                        const lineNames = ["", "SINGLE", "DOUBLE", "TRIPLE"];
                        actionText = `T-SPIN ${mini}${lineNames[Math.min(lines, 3)] || "NON-LINE"}`;
                        atk = tSpinInfo.isMini ? [0, 1, 2, 3][Math.min(lines, 3)] : [0, 2, 4, 6][Math.min(lines, 3)];

                        if (tSpinInfo.isMini) {
                            lineScore = ([100, 200, 400][Math.min(lines, 2)] || 0) * level;
                        } else {
                            lineScore = ([400, 800, 1200, 1600][Math.min(lines, 3)] || 0) * level;
                        }
                    }

                    if (lines > 0) {
                        if (!tSpinInfo.isTSpin) {
                            if (genericSpinLabel) {
                                actionText = genericSpinLabel + (overflowLines > 0 ? `+${overflowLines}` : "");
                            } else {
                                const lineNames = ["", "SINGLE", "DOUBLE", "TRIPLE", "TETRIS"];
                                actionText = lineNames[cappedLines] + (overflowLines > 0 ? `+${overflowLines}` : "");
                            }
                            atk = [0, 0, 1, 2, 4][cappedLines] + overflowLines * 2;
                            lineScore = ([0, 100, 300, 500, 800][cappedLines] + overflowLines * 300) * level;
                        }
                        this.player.ren++;
                        this.player.maxRen = Math.max(this.player.maxRen || 0, this.player.ren);
                    } else {
                        this.player.ren = -1;
                        if (!tSpinInfo.isTSpin && genericSpinLabel) actionText = genericSpinLabel;
                    }

                    if ((tSpinInfo.isTSpin || lines === 4) && lines > 0) {
                        if (this.player.btb) {
                            atk += 1;
                            actionText = "B2B " + actionText;
                            lineScore = Math.floor(lineScore * 1.5);
                        }
                        this.player.btb = true;
                    } else if (lines > 0) {
                        this.player.btb = false;
                    }

                    if (lines > 0 && this.player.ren > 0) {
                        lineScore += 50 * this.player.ren * level;
                    }

                    atk += Math.floor(this.player.ren / 2);

                    if (isPerfectClear) {
                        actionText = "PERFECT CLEAR";
                        atk += 10;
                        lineScore += ([0, 800, 1200, 1800, 2000][cappedLines] + overflowLines * 400) * level;
                        this.player.perfectClears = (this.player.perfectClears || 0) + 1;
                    }

                    if (tSpinInfo.isTSpin) {
                        this.player.tSpins = (this.player.tSpins || 0) + 1;
                    }

                    const coinGain = Math.max(0, lines + (tSpinInfo.isTSpin ? 2 : 0) + (lines === 4 ? 2 : 0) + (isPerfectClear ? 3 : 0));
                    this.addSkillCoins(coinGain);

                    if (atk > 0) {
                        atk = Math.max(0, Math.round(atk * ((this.ruleSet && this.ruleSet.garbageMultiplier) || 1) * getAdminAttackMultiplier(this)));
                        this.player.attacks += atk;
                        if (this.pendingGarbage > 0) { const offset = Math.min(atk, this.pendingGarbage); atk -= offset; this.pendingGarbage -= offset; this.updateMeter(); }
                        if (atk > 0 && !this.isAI && isStandardOnlineMatch()) {
                            sendStandardOnlineAttack(atk, this.networkId);
                        } else if (isOnline && conn && conn.open && atk > 0 && !this.isAI) {
                            conn.send({ type: 'attack', amount: atk });
                        } else if (this.opponent && atk > 0) {
                            this.opponent.receiveGarbage(atk);
                        }
                    }
                    if (actionText) this.showAction(actionText + (this.player.ren > 0 ? `\n${this.player.ren} REN` : ""));
                    this.player.score += lineScore;
                } else {
                    this.player.ren = -1;
                }
                this.updateUI();
                if (!this.isAI && this === p1) {
                    const soloMode = getSoloModeDef();
                    if (soloMode && soloMode.lineTarget && !cpu && !isOnline && !window.partyModeInstance && !this.targetBoard && (this.player.lines || 0) >= soloMode.lineTarget) {
                        completeSoloMode(this);
                    }
                }
            }

            receiveGarbage(n) {
                if (adminControlEnabled && this === p1 && adminCheats.shield) {
                    this.pendingGarbage = 0;
                    this.updateMeter();
                    this.showAction('ADMIN SHIELD');
                    return;
                }
                const amount = normalizeGarbageAmount(n);
                if (amount <= 0) return;
                this.pendingGarbage += amount;
                this.player.garbageReceived = (this.player.garbageReceived || 0) + amount;
                this.updateMeter();
                captureReplayFrame(performance.now(), true);
            }
            pushGarbageToArena(n) {
                for (let i = 0; i < n; i++) {
                    const r = new Array(this.getBoardWidth()).fill(8);
                    r[Math.floor(Math.random() * this.getBoardWidth())] = 0;
                    this.arena.shift();
                    this.arena.push(r);
                }
                let limit = 0; while (this.collide() && limit < this.getArenaHeight()) { this.player.pos.y--; limit++; }
                if (this.player.pos.y < 0) this.gameOver();
            }

            updateMeter() { if (this.meterFill) { const percent = Math.min(100, (this.pendingGarbage / 20) * 100); this.meterFill.style.height = percent + '%'; } }

            playerHold() {
                if (this.ruleSet && this.ruleSet.allowHold === false) return;
                if (adminControlEnabled && this === p1 && adminCheats.infiniteHold) this.player.canHold = true;
                if (!this.player.canHold) return;
                const curType = this.player.type, curColor = this.player.color;
                if (this.player.holdType) {
                    this.player.type = this.player.holdType; this.player.color = this.player.holdColor;
                    this.player.matrix = this.createPieceMatrix(this.player.type);
                    this.player.pos = this.getSpawnPosition(this.player.matrix); this.player.rotation = 0;
                } else this.reset();
                this.player.holdType = curType; this.player.holdColor = curColor; this.player.canHold = false;
                if (adminControlEnabled && this === p1 && adminCheats.infiniteHold) this.player.canHold = true;
                this.lockDelayCounter = 0; this.lockResetCount = 0; this.hasTouchedGround = false;
                this.isOtransformed = false; this.oSpinRotCount = 0; this.lastMoveRotate = false; this.lastRotationUsedKick = false;
                if (this.isAI) this.aiPlan();
                this.updateUI();
                refreshSkillPanel(this);
                captureReplayFrame(performance.now(), true);
                if (!this.isAI) syncSoloCpuHint();
            }

            gameOver() {
                if (adminControlEnabled && this === p1 && adminCheats.invincible) {
                    rescueAdminTopOut(this);
                    this.showAction('ADMIN INVINCIBLE');
                    return;
                }
                if (this.isGameOver) return; this.isGameOver = true;
                if (!this.isAI) syncSoloCpuHint();
                refreshSkillPanel(this);

                if (inTutorial) {
                    endTutorial();
                    return;
                }

                if (!this.isAI && this === p1) finalizeSoloModeResult(this, false);

                if (isStandardOnlineMatch() && !this.isAI) {
                    sendStandardOnlineGameOver(typeof this.networkId === 'number' ? this.networkId : onlineMyIndex);
                } else if (isOnline && (conn && conn.open)) {
                    conn.send({ type: 'gameover' });
                }

                if ((isQuickMatch || (isOnline && !isPartyMode)) && !this.isAI) {
                    p2Wins++;
                    if (p2Wins >= targetWins) {
                        queueMatchSummary('defeat', 'online');
                        showToast(TRANSLATIONS[cfg.lang].defeat + " (Match Lost!)");
                    } else {
                        showToast(TRANSLATIONS[cfg.lang].defeat + ` (Round Lost! Score: ${p1Wins} - ${p2Wins})`);
                        setTimeout(() => resetRound(), 3000);
                    }
                    return;
                }

                let msg = this.isAI ? TRANSLATIONS[cfg.lang].victory : (this.opponent ? TRANSLATIONS[cfg.lang].defeat : TRANSLATIONS[cfg.lang].gameover);
                queueMatchSummary(this.isAI ? 'victory' : (this.opponent ? 'defeat' : 'gameover'), this.opponent ? 'cpu' : 'solo');
                showToast(msg); setTimeout(() => returnToMenu(), 3000);
            }

            getPrefixMatrix(type, r) {
                if (!this.memoMatrices) this.memoMatrices = {};
                let key = type + r;
                if (this.memoMatrices[key]) return this.memoMatrices[key];
                let m = JSON.parse(JSON.stringify(PIECES[type]));
                for (let i = 0; i < r; i++) {
                    let rot = m[0].map((_, idx) => m.map(row => row[idx]));
                    m = rot.map(row => row.reverse());
                }
                this.memoMatrices[key] = m;
                return m;
            }

            checkCollisionRaw(type, x, y, r) {
                let m = this.getPrefixMatrix(type, r);
                for (let yy = 0; yy < m.length; ++yy) {
                    for (let xx = 0; xx < m[yy].length; ++xx) {
                        if (m[yy][xx] !== 0) {
                            let ax = x + xx;
                            let ay = y + yy;
                            if (ax < 0 || ax >= 10 || ay >= 22 || (ay >= 0 && this.arena[ay][ax] !== 0)) return true;
                        }
                    }
                }
                return false;
            }

            getLockablePlacements(type) {
                let placements = [];
                for (let r = 0; r < 4; r++) {
                    for (let x = -2; x < 10; x++) {
                        if (!this.checkCollisionRaw(type, x, 0, r)) {
                            let y = 0;
                            while (!this.checkCollisionRaw(type, x, y + 1, r)) y++;
                            placements.push({ x, y, r });
                        }
                    }
                }
                return placements;
            }

            getPieceColor(type) {
                return type === 'B' ? 9 : Object.keys(PIECES).indexOf(type) + 1;
            }

            getRecommendedMove(options = {}) {
                const {
                    level = cfg.lv,
                    forcePerfect = false,
                    allowJitter = true
                } = options;
                const evalLevel = forcePerfect ? Math.max(30, level) : level;
                const holdLevel = forcePerfect ? Math.max(50, level) : level;
                const evalBoard = (type) => {
                    let best = { s: -Infinity, x: 0, y: 0, r: 0 };
                    let placements = this.getLockablePlacements(type);

                    for (let p of placements) {
                        let { x, y, r } = p;
                        let m = this.getPrefixMatrix(type, r);
                        let sim = this.arena.map(row => [...row]);

                        // Center of mass landing height equivalent
                        let landingHeight = 22 - (y + m.length / 2);

                        for (let pr = 0; pr < m.length; pr++) {
                            for (let pc = 0; pc < m[pr].length; pc++) {
                                if (m[pr][pc]) {
                                    if (y + pr >= 0 && y + pr < 22 && x + pc >= 0 && x + pc < 10) sim[y + pr][x + pc] = 1;
                                }
                            }
                        }

                        let linesCleared = 0;
                        let newSim = [];
                        for (let sr = 0; sr < 22; sr++) {
                            if (sim[sr].every(cell => cell !== 0)) {
                                linesCleared++;
                            } else {
                                newSim.push(sim[sr]);
                            }
                        }
                        while (newSim.length < 22) newSim.unshift(new Array(10).fill(0));
                        sim = newSim;

                        let rowTransitions = 0;
                        for (let r2 = 0; r2 < 22; r2++) {
                            let lastCell = 1;
                            for (let c2 = 0; c2 < 10; c2++) {
                                let cell = sim[r2][c2] > 0 ? 1 : 0;
                                if (cell !== lastCell) rowTransitions++;
                                lastCell = cell;
                            }
                            if (lastCell !== 1) rowTransitions++;
                        }

                        let colTransitions = 0;
                        for (let c2 = 0; c2 < 10; c2++) {
                            let lastCell = 0; // Top bounding box is empty
                            for (let r2 = 0; r2 < 22; r2++) {
                                let cell = sim[r2][c2] > 0 ? 1 : 0;
                                if (cell !== lastCell) colTransitions++;
                                lastCell = cell;
                            }
                            if (lastCell !== 1) colTransitions++; // Floor is solid
                        }

                        let holes = 0, wellSums = 0;
                        for (let c2 = 0; c2 < 10; c2++) {
                            let blockFound = false;
                            for (let r2 = 0; r2 < 22; r2++) {
                                if (sim[r2][c2] !== 0) {
                                    blockFound = true;
                                } else {
                                    if (blockFound) holes++;
                                    else {
                                        let leftSolid = (c2 === 0 || sim[r2][c2 - 1] !== 0);
                                        let rightSolid = (c2 === 9 || sim[r2][c2 + 1] !== 0);
                                        if (leftSolid && rightSolid) {
                                            for (let wy = r2; wy < 22; wy++) {
                                                if (sim[wy][c2] === 0) wellSums += (wy - r2 + 1);
                                                else break;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        let score = 0;
                        if (this.targetBoard) {
                            let templateScore = 0;
                            for (let pr = 0; pr < m.length; pr++) {
                                for (let pc = 0; pc < m[pr].length; pc++) {
                                    if (m[pr][pc]) {
                                        let rr = y + pr, cc = x + pc;
                                        if (rr >= 0 && rr < 22 && cc >= 0 && cc < 10) {
                                            if (this.targetBoard[rr][cc] === 1) templateScore += 1000;
                                            else if (this.targetBoard[rr][cc] === 0) templateScore -= 2000;
                                        }
                                    }
                                }
                            }
                            for (let c = x; c < x + m[0].length; c++) {
                                if (c >= 0 && c < 10) {
                                    for (let r2 = Math.min(22, y + m.length); r2 < 22; r2++) {
                                        if (this.targetBoard[r2][c] === 1 && sim[r2][c] === 0) templateScore -= 5000;
                                    }
                                }
                            }
                            score += templateScore + (y * 10) - (holes * 200);
                        } else {
                            if (forcePerfect || evalLevel >= 30) {
                                // Genetic AI weights (Dellacherie algorithm) - practically unbeatable
                                score = (landingHeight * -4.500)
                                    + (linesCleared * 3.418)
                                    + (rowTransitions * -3.218)
                                    + (colTransitions * -9.349)
                                    + (holes * -7.899)
                                    + (wellSums * -3.386);
                            } else {
                                let intelligence = evalLevel / 30; // 0 to 1
                                score = (landingHeight * (-10 + intelligence * 5))
                                    + (linesCleared * (1 + intelligence * 2.4))
                                    + (rowTransitions * (-8 + intelligence * 4.8))
                                    + (colTransitions * (-15 + intelligence * 5.7))
                                    + (holes * (-20 + intelligence * 12))
                                    + (wellSums * (-8 + intelligence * 4.6));
                            }
                        }

                        if (score > best.s) { best.s = score; best.x = x; best.y = y; best.r = r; }
                    }
                    if (best.s === -Infinity) { best = { s: -100000, x: 3, y: 0, r: 0 }; }
                    return best;
                };

                let cur = evalBoard(this.player.type);
                let holdT = this.player.holdType || this.nextQueue[0];
                let hld = holdT ? evalBoard(holdT) : { s: -Infinity, x: 3, y: 0, r: 0 };

                let willHold = false;
                if (this.player.canHold && holdT) {
                    let holdAdvantage = hld.s - cur.s;
                    let holdThreshold = Math.max(0, 50 - holdLevel);
                    if (holdAdvantage > holdThreshold) willHold = true;
                }

                const best = willHold ? hld : cur;
                const type = willHold ? holdT : this.player.type;
                const move = {
                    useHold: willHold,
                    type,
                    color: this.getPieceColor(type),
                    matrix: this.getPrefixMatrix(type, best.r),
                    x: best.x,
                    y: best.y,
                    rotation: best.r,
                    score: best.s
                };

                if (!forcePerfect && allowJitter && !this.targetBoard && evalLevel < 15 && Math.random() < (15 - evalLevel) * 0.02) {
                    move.x += (Math.random() < 0.5 ? -1 : 1);
                }
                return move;
            }

            aiPlan() {
                const move = this.getRecommendedMove();
                this.aiNeedHold = !!move.useHold;
                this.aiTargetX = move.x;
                this.aiTargetRot = move.rotation;
            }

            update(dt) {
                if (adminControlEnabled && this === p1) applyAdminPassiveCheats();
                if (this.isGameOver) return;
                if (adminControlEnabled && this.isAI && adminCheats.freezeCpu) {
                    this.draw();
                    this.updateStatsUI();
                    return;
                }

                if (this.isNetworkPlayer) {
                    this.draw();
                    return;
                }

                if (this.oSpinTimer > 0) { this.oSpinTimer -= dt; if (this.oSpinTimer <= 0) this.oSpinRotCount = 0; }
                const scaledDt = dt * this.getTimeScale();
                this.dropCounter += scaledDt;
                this.player.time += dt;
                if (!this.isAI && !this.isNetworkPlayer && this.ruleSet && this.ruleSet.survivalRush) {
                    this.survivalRushTimer = (this.survivalRushTimer || 0) + dt;
                    if (this.survivalRushTimer >= 6500) {
                        this.survivalRushTimer = 0;
                        this.receiveGarbage(1);
                        this.showAction('SURVIVAL +1');
                    }
                } else {
                    this.survivalRushTimer = 0;
                }

                if (this.isAI) {
                    this.aiTimer = (this.aiTimer || 0) + scaledDt;
                    let speed = Math.max(0, 500 - cfg.lv * 10);

                    if (cfg.lv >= 40) {
                        let acts = 0;
                        while (this.aiTimer >= speed && acts < 10) {
                            acts++;
                            if (this.aiNeedHold) {
                                this.playerHold(); this.aiTimer = 0; break;
                            } else if (this.player.rotation !== this.aiTargetRot) {
                                let diff = this.aiTargetRot - this.player.rotation;
                                if (diff === 3 || diff === -1) this.playerRotate(-1);
                                else this.playerRotate(1);
                            } else if (this.player.pos.x !== this.aiTargetX) {
                                let dir = this.player.pos.x < this.aiTargetX ? 1 : -1;
                                if (!this.playerMove(dir)) this.aiTargetX = this.player.pos.x;
                            } else {
                                this.hardDrop(); this.aiTimer = 0; break;
                            }
                            if (speed > 0) this.aiTimer -= speed;
                            else break; // Instant execution mode: loop runs once per frame per action
                        }
                        if (speed === 0 && acts === 10) this.aiTimer = 0; // Prevent runaway frame timer
                    } else {
                        if (this.aiTimer > Math.max(10, speed)) {
                            if (this.aiNeedHold) this.playerHold();
                            else if (this.player.rotation !== this.aiTargetRot) this.playerRotate(1);
                            else if (this.player.pos.x < this.aiTargetX) { if (!this.playerMove(1)) this.aiTargetX = this.player.pos.x; }
                            else if (this.player.pos.x > this.aiTargetX) { if (!this.playerMove(-1)) this.aiTargetX = this.player.pos.x; }
                            else if (!this.playerDrop()) this.lock();
                            this.aiTimer = 0;
                        }
                    }
                } else {
                    let currentLvl = this.player.level || 1;
                    let fallSpeed = Math.max(10, Math.pow(Math.max(0.1, 0.8 - ((currentLvl - 1) * 0.007)), currentLvl - 1) * 1000);
                    if (adminControlEnabled && this === p1 && adminCheats.noGravity) {
                        this.dropCounter = 0;
                    } else if (this.dropCounter > (keysDown[cfg.keys.soft] ? fallSpeed / cfg.sdf : fallSpeed)) {
                        this.playerDrop(keysDown[cfg.keys.soft]);
                    }
                    this.handleInput(scaledDt);
                    if (this.isPieceGrounded()) {
                        this.hasTouchedGround = true;
                        if (adminControlEnabled && this === p1 && adminCheats.lockDelayFreeze) {
                            this.lockDelayCounter = 0;
                            this.lockResetCount = 0;
                        } else {
                            this.lockDelayCounter += scaledDt;
                            if (this.lockDelayCounter >= this.lockDelayThreshold || (this.lockResetCount || 0) >= LOCK_RESET_LIMIT) {
                                this.lock(); this.lockDelayCounter = 0;
                            }
                        }
                    } else this.lockDelayCounter = 0;

                    // Sync state if online
                    if (isOnline) {
                        this.syncTimer = (this.syncTimer || 0) + dt;
                        if (this.syncTimer > 30) { // Sync fast (approx 33fps) for real-time responsiveness
                            syncCurrentStandardOnlineState();
                            this.syncTimer = 0;
                        }
                    }
                }
                this.draw();
                this.updateStatsUI();
                if (adminControlEnabled && this === p1) applyAdminPassiveCheats();
            }

            handleInput(dt) {
                const handleSide = (key, side) => {
                    const dir = side === 'L' ? -1 : 1;
                    let isPressed = keysDown[cfg.keys[key]];

                    if (keysDown[cfg.keys.left] && keysDown[cfg.keys.right]) {
                        if ((keysDownTime[cfg.keys.left] || 0) > (keysDownTime[cfg.keys.right] || 0)) {
                            if (key === 'right') isPressed = false;
                        } else {
                            if (key === 'left') isPressed = false;
                        }
                    }

                    if (isPressed) {
                        if (this['das' + side] === 0) this.playerMove(dir);
                        this['das' + side] += dt;
                        if (this['das' + side] >= cfg.das) {
                            this['arr' + side] += dt;
                            while (this['arr' + side] >= cfg.arr) { if (!this.playerMove(dir)) break; this['arr' + side] -= (cfg.arr || 1); }
                        }
                    } else { this['das' + side] = 0; this['arr' + side] = 0; }
                };
                handleSide('left', 'L'); handleSide('right', 'R');
            }

            draw() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                const s = this.getCellSize();
                const off = { x: 0, y: this.getDisplayOffsetY() };
                if (!this.isAI) {
                    const gp = { ...this.player.pos }; while (!this.collide(this.player.matrix, { x: gp.x, y: gp.y + 1 })) gp.y++;
                    this.ctx.globalAlpha = cfg.ghost; this.drawM(this.player.matrix, { x: gp.x, y: gp.y + off.y }, s, this.player.color); this.ctx.globalAlpha = 1.0;
                }
                this.drawM(this.arena, off, s); this.drawM(this.player.matrix, { x: this.player.pos.x, y: this.player.pos.y + off.y }, s, this.player.color);
                if (this.isPlayerBoard) this.renderCpuHintOverlay();
            }

            drawM(m, o, s, overrideColor = null, targetCtx = this.ctx) {
                if (!m) return;
                m.forEach((row, y) => row.forEach((v, x) => {
                    if (v !== 0 && (y + o.y) >= 0) {
                        targetCtx.fillStyle = COLORS[overrideColor || v]; targetCtx.fillRect((x + o.x) * s, (y + o.y) * s, s, s);
                        targetCtx.strokeStyle = 'rgba(0,0,0,0.5)'; targetCtx.strokeRect((x + o.x) * s, (y + o.y) * s, s, s);
                    }
                }));
            }

            renderCpuHintOverlay(move = soloCpuHintMove) {
                if (!this.hintCtx || !this.hintCanvas) return;
                this.hintCtx.clearRect(0, 0, this.hintCanvas.width, this.hintCanvas.height);
                if (this.hintBadge) this.hintBadge.style.display = 'none';
                if (!soloCpuHintEnabled || !move || this.isGameOver || cpu || isOnline || isPartyMode || window.partyModeInstance) return;
                const s = this.getCellSize();
                const off = { x: 0, y: this.getDisplayOffsetY() };
                this.hintCtx.globalAlpha = 0.35;
                this.drawM(move.matrix, { x: move.x, y: move.y + off.y }, s, move.color, this.hintCtx);
                this.hintCtx.globalAlpha = 1.0;
                if (this.hintBadge && move.useHold) this.hintBadge.style.display = 'block';
            }

            showAction(txt) {
                if (!txt) return;
                spawnActionText(this.actionLayer, txt);
                if (isReplayPlayback) return;
                recordBoardReplayAction(this, txt);
                maybeBroadcastOnlineActionText(this, txt);
            }

            updateUI() {
                const drawMini = (ctx, type, overrideColor = null) => {
                    const t = THEMES[cfg.theme] || THEMES['default'];
                    if (!ctx) return; ctx.fillStyle = t.canvasBg; ctx.fillRect(0, 0, 60, 60);
                    if (!type) return;
                    const m = this.getPreviewMatrix(type);
                    const s = Math.max(8, Math.floor(40 / Math.max(4, m.length, m[0].length)));
                    ctx.fillStyle = COLORS[overrideColor || this.getPieceColor(type)];
                    const ox = (60 - m[0].length * s) / 2, oy = (60 - m.length * s) / 2;
                    m.forEach((row, y) => row.forEach((v, x) => { if (v) ctx.fillRect(x * s + ox, y * s + oy, s - 1, s - 1); }));
                };
                drawMini(this.holdCanvas.getContext('2d'), this.player.holdType, this.player.holdColor);
                this.nextQueue.slice(0, this.nextCount).forEach((t, i) => { if (this.nextCanvases[i]) drawMini(this.nextCanvases[i].getContext('2d'), t); });
                if (this.scoreElem) this.scoreElem.innerText = this.player.score;
                const renEl = document.getElementById(this.isAI ? 'c-ren' : 'p-ren'); if (renEl) renEl.innerText = this.player.ren > 0 ? this.player.ren : 0;
                
                this.updateStatsUI();
                refreshSkillPanel(this);
                if (!this.isAI && this === p1) syncSoloStatusPanel();
            }

            updateStatsUI() {
                let pfix = this.isPlayerBoard ? 'p-' : 'c-';
                let timeSec = Math.floor((this.player.time || 0) / 1000);
                let mins = Math.floor(timeSec / 60);
                let secs = ("0" + (timeSec % 60)).slice(-2);
                let tEl = document.getElementById(pfix + 'stat-time'); if (tEl) tEl.innerText = mins + ":" + secs;
                let lEl = document.getElementById(pfix + 'stat-lines'); if (lEl) lEl.innerText = this.player.lines || 0;
                let lvEl = document.getElementById(pfix + 'stat-level'); if (lvEl) lvEl.innerText = this.player.level || 1;
                
                let ppsEl = document.getElementById(pfix + 'stat-pps'); 
                if (ppsEl) ppsEl.innerText = ((this.player.time || 0) > 0 ? ((this.player.pieces || 0) / ((this.player.time || 0) / 1000)).toFixed(2) : "0.00");
                
                let apmEl = document.getElementById(pfix + 'stat-apm');
                if (apmEl) apmEl.innerText = ((this.player.time || 0) > 0 ? ((this.player.attacks || 0) / ((this.player.time || 0) / 60000)).toFixed(2) : "0.00");
                
                let lpmEl = document.getElementById(pfix + 'stat-lpm');
                if (lpmEl) lpmEl.innerText = ((this.player.time || 0) > 0 ? ((this.player.lines || 0) / ((this.player.time || 0) / 60000)).toFixed(2) : "0.00");
            }
        }

        class PartyTetris {
            constructor(canvasId, playerCount, myIndex, options = {}) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext('2d');
                this.playerCount = playerCount;
                this.myIndex = myIndex;
                this.ruleSet = { ...DEFAULT_ROOM_RULES, ...(options.ruleSet || onlineRoomRules || {}) };
                this.playerRoles = Array.from({ length: playerCount }, (_, index) => sanitizePartyRole((options.roles || partySlotRoles || [])[index] || 'player'));
                this.playerTeams = Array.from({ length: playerCount }, (_, index) => sanitizePartyTeam((options.teams || partySlotTeams || [])[index] || (index % 2 === 0 ? 'A' : 'B')));
                if (!this.ruleSet.allowSpectators) this.playerRoles = this.playerRoles.map(() => 'player');
                this.sharedDeathMode = this.ruleSet.sharedDeathMode === 'collective' ? 'collective' : 'solo';
                this.isSpectator = this.playerRoles[myIndex] === 'spectator';
                this.arena = Array.from({ length: 30 }, () => new Array(30).fill(0));
                this.isGameOver = false;
                this.syncTimer = 0;
                this.supportCooldownUntil = 0;

                this.actionLayer = document.getElementById('party-action-layer');
                this.playersDead = {};
                this.playerRoles.forEach((role, index) => {
                    if (role === 'spectator') this.playersDead[index] = true;
                });

                this.me = {
                    pos: { x: 3 + myIndex * 7, y: 0 },
                    matrix: null, type: null, color: (myIndex % 7) + 1,
                    score: 0, holdType: null, holdColor: null, canHold: true,
                    nextQueue: [], bag: [],
                    lockDelayCounter: 0, dropCounter: 0,
                    dasL: 0, arrL: 0, dasR: 0, arrR: 0,
                    rotation: 0,
                    time: 0, pieces: 0, lines: 0, attacks: 0, garbageReceived: 0, maxRen: 0,
                    isDead: this.isSpectator
                };

                this.others = {};
                for (let i = 0; i < playerCount; i++) {
                    if (i !== myIndex) this.others[i] = { matrix: null, pos: { x: 0, y: 0 }, color: (i % 7) + 1 };
                }

                if (!this.isSpectator) {
                    while (this.me.nextQueue.length < 5) this.me.nextQueue.push(this.pullFromBag());
                    this.reset();
                } else {
                    this.updateUI();
                    this.refreshSupportPanel();
                    this.draw();
                }
            }

            pullFromBag() {
                if (this.me.bag.length === 0) {
                    this.me.bag = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
                    for (let i = this.me.bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[this.me.bag[i], this.me.bag[j]] = [this.me.bag[j], this.me.bag[i]]; }
                }
                return this.me.bag.shift();
            }

            reset() {
                if (this.isSpectator || this.me.isDead || this.isGameOver) {
                    this.updateUI();
                    this.refreshSupportPanel();
                    return;
                }
                this.me.type = this.me.nextQueue.shift();
                this.me.nextQueue.push(this.pullFromBag());
                this.me.matrix = JSON.parse(JSON.stringify(PIECES[this.me.type]));
                this.me.pos = { x: 3 + this.myIndex * 7, y: 0 };
                this.me.rotation = 0; this.me.canHold = true; this.me.lockDelayCounter = 0;

                if (this.collide(this.me.matrix, this.me.pos)) {
                    this.me.pos.y--;
                    if (this.collide(this.me.matrix, this.me.pos)) this.eliminateSelf();
                }
                this.updateUI();
                this.refreshSupportPanel();
            }

            eliminateSelf() {
                if (this.me.isDead || this.isGameOver) return;
                this.me.isDead = true;
                this.me.matrix = null;
                this.broadcastDead();
                this.updateUI();
                this.refreshSupportPanel();
                this.draw();
            }

            broadcastDead() {
                const collective = this.sharedDeathMode === 'collective';
                if (!isHost) {
                    if (conn && conn.open) conn.send({ type: 'party_dead', id: this.myIndex, collective });
                    if (collective) this.gameOver(-1);
                } else if (collective) {
                    this.endPartyForAll(-1);
                } else {
                    this.playersDead[this.myIndex] = true;
                    this.checkHostGameOver();
                }
                this.refreshSupportPanel();
            }

            handleRemoteDeath(id, collective = false) {
                const playerId = normalizeNetworkId(id);
                if (collective || this.sharedDeathMode === 'collective') {
                    this.endPartyForAll(-1);
                    return;
                }
                this.playersDead[playerId] = true;
                if (this.others[playerId]) this.others[playerId].matrix = null;
                this.checkHostGameOver();
            }

            endPartyForAll(winner = -1) {
                if (isHost) {
                    partyClients.forEach(c => {
                        if (c && c.open) c.send({ type: 'party_gameover', winner });
                    });
                }
                this.gameOver(winner);
            }

            collide(m, o) {
                if (!m || !o) return false;
                for (let y = 0; y < m.length; ++y) {
                    for (let x = 0; x < m[y].length; ++x) {
                        if (m[y][x] !== 0) {
                            const ay = y + o.y, ax = x + o.x;
                            if (ay >= 30 || ax < 0 || ax >= 30 || (ay >= 0 && this.arena[ay][ax] !== 0)) return true;
                        }
                    }
                }
                return false;
            }

            playerRotate(dir) {
                if (this.isSpectator || this.me.isDead) return;
                const oldM = JSON.parse(JSON.stringify(this.me.matrix));
                const oldR = this.me.rotation;
                const newR = (oldR + dir + 4) % 4;
                const rotated = this.me.matrix[0].map((_, i) => this.me.matrix.map(row => row[i]));
                this.me.matrix = dir > 0 ? rotated.map(row => row.reverse()) : rotated.reverse();

                const kickTable = (this.me.type === 'I') ? KICKS_I : KICKS;
                const kickSet = kickTable[`${oldR}-${newR}`] || [[0, 0]];
                let success = false;
                const oldP = { ...this.me.pos };
                for (let [kx, ky] of kickSet) {
                    this.me.pos.x += kx; this.me.pos.y -= ky;
                    if (!this.collide(this.me.matrix, this.me.pos)) { success = true; break; }
                    this.me.pos = { ...oldP };
                }
                if (success) { this.me.rotation = newR; this.me.lockDelayCounter = 0; captureReplayFrame(performance.now(), true); }
                else { this.me.matrix = oldM; this.me.pos = { ...oldP }; }
            }

            playerMove(dir) {
                if (this.isSpectator || this.me.isDead) return false;
                this.me.pos.x += dir;
                if (this.collide(this.me.matrix, this.me.pos)) { this.me.pos.x -= dir; return false; }
                this.me.lockDelayCounter = 0; captureReplayFrame(performance.now()); return true;
            }

            playerDrop(isSoftDrop = false) {
                if (this.isSpectator || this.me.isDead) return false;
                this.me.pos.y++;
                if (this.collide(this.me.matrix, this.me.pos)) { this.me.pos.y--; return false; }
                if (isSoftDrop) { this.me.score += 1; this.updateUI(); }
                this.me.lockDelayCounter = 0; this.me.dropCounter = 0; return true;
            }

            hardDrop() {
                if (this.isSpectator || this.me.isDead) return;
                let dropped = 0;
                while (this.playerDrop()) dropped++;
                this.me.score += dropped * 2;
                this.updateUI();
                this.lock();
                captureReplayFrame(performance.now(), true);
            }

            playerHold() {
                if (this.isSpectator || this.me.isDead) return;
                if (!this.me.canHold) return;
                const curType = this.me.type, curColor = this.me.color;
                if (this.me.holdType) {
                    this.me.type = this.me.holdType; this.me.color = this.me.holdColor;
                    this.me.matrix = JSON.parse(JSON.stringify(PIECES[this.me.type]));
                    this.me.pos = { x: 3 + this.myIndex * 7, y: 0 }; this.me.rotation = 0;
                } else this.reset();
                this.me.holdType = curType; this.me.holdColor = curColor; this.me.canHold = false;
                this.updateUI();
                captureReplayFrame(performance.now(), true);
            }

            lock() {
                if (this.isSpectator || this.me.isDead) return;
                this.me.pieces++;
                let packet = { type: 'party_lock', id: this.myIndex, matrix: this.me.matrix, pos: this.me.pos, color: this.me.color };
                if (isHost) this.processLock(packet);
                else if (conn && conn.open) conn.send(packet);
                this.reset();
                captureReplayFrame(performance.now(), true);
            }

            processLock(data) {
                if (!data || this.playersDead[data.id] || this.playerRoles[data.id] === 'spectator') return;
                data.matrix.forEach((row, y) => row.forEach((v, x) => {
                    const ay = y + data.pos.y;
                    const ax = x + data.pos.x;
                    if (v !== 0 && ay >= 0 && ay < 30 && ax >= 0 && ax < 30) this.arena[ay][ax] = data.color;
                }));

                let lines = 0;
                outer: for (let y = 29; y >= 0; --y) {
                    for (let x = 0; x < 30; ++x) { if (this.arena[y][x] === 0) continue outer; }
                    this.arena.splice(y, 1); this.arena.unshift(new Array(30).fill(0)); ++y; lines++;
                }

                if (lines > 0) {
                    this.showAction('LINE CLEAR!');
                    let attack = lines === 2 ? 1 : (lines === 3 ? 2 : (lines === 4 ? 4 : 0));
                    if (data.id === this.myIndex) {
                        this.me.lines += lines;
                        this.me.attacks += attack;
                        this.me.score += lines * 100;
                    }
                    if (attack > 0) {
                        const attackerTeam = this.playerTeams[data.id];
                        let targets = [];
                        for (let i = 0; i < this.playerCount; i++) {
                            if (i === data.id || this.playersDead[i] || this.playerRoles[i] === 'spectator') continue;
                            if (this.playerTeams[i] !== attackerTeam) targets.push(i);
                        }
                        if (!targets.length) {
                            for (let i = 0; i < this.playerCount; i++) {
                                if (i !== data.id && !this.playersDead[i] && this.playerRoles[i] !== 'spectator') targets.push(i);
                            }
                        }
                        if (targets.length > 0) {
                            let targetId = targets[Math.floor(Math.random() * targets.length)];
                            if (targetId === this.myIndex) this.receiveGarbage(attack);
                            else {
                                let cIdx = targetId - 1;
                                if (partyClients[cIdx]) partyClients[cIdx].send({ type: 'party_attack', amount: attack });
                            }
                        }
                    }
                }

                this.setState({ arena: this.arena });
                if (isHost) partyClients.forEach(c => c.send({ type: 'party_arena', arena: this.arena, cleared: lines }));
                captureReplayFrame(performance.now(), true);
            }

            receiveGarbage(amount) {
                if (this.isGameOver || this.isSpectator || this.me.isDead) return;
                amount = normalizeGarbageAmount(amount);
                if (amount <= 0) return;
                this.me.garbageReceived += amount;
                let holeX = Math.floor(Math.random() * 30);
                for (let i = 0; i < amount; i++) {
                    this.arena.shift();
                    let newRow = new Array(30).fill(8);
                    newRow[holeX] = 0;
                    this.arena.push(newRow);
                }
                if (this.me.matrix && this.collide(this.me.matrix, this.me.pos)) this.eliminateSelf();
                if (isHost) partyClients.forEach(c => c.send({ type: 'party_arena', arena: this.arena, cleared: 0 }));
                captureReplayFrame(performance.now(), true);
            }

            setState(state) {
                if (state.arena && typeof state.arena[0] === 'string') this.arena = state.arena.map(row => row.split('').map(cell => parseInt(cell, 10) || 0));
                else if (state.arena) this.arena = state.arena;
            }

            getReplayState() {
                return {
                    arena: this.arena.map(row => row.join('')),
                    me: cloneReplayValue(this.me),
                    others: cloneReplayValue(this.others),
                    playersDead: cloneReplayValue(this.playersDead),
                    playerRoles: cloneReplayValue(this.playerRoles),
                    playerTeams: cloneReplayValue(this.playerTeams),
                    isGameOver: this.isGameOver
                };
            }

            applyReplayState(state) {
                if (!state) return;
                if (state.arena && typeof state.arena[0] === 'string') this.arena = state.arena.map(row => row.split('').map(cell => parseInt(cell, 10) || 0));
                else this.arena = cloneReplayValue(state.arena || this.arena);
                this.me = cloneReplayValue(state.me || this.me);
                this.others = cloneReplayValue(state.others || this.others);
                this.playersDead = cloneReplayValue(state.playersDead || this.playersDead || {});
                if (Array.isArray(state.playerRoles)) this.playerRoles = state.playerRoles.map(sanitizePartyRole);
                if (Array.isArray(state.playerTeams)) this.playerTeams = state.playerTeams.map(sanitizePartyTeam);
                this.isGameOver = !!state.isGameOver;
                this.updateUI();
                this.refreshSupportPanel();
                this.draw();
            }

            showAction(txt) {
                if (!txt) return;
                spawnActionText(this.actionLayer, txt, '320px', '100px');
                if (!isReplayPlayback) recordBoardReplayAction(this, txt, performance.now(), { left: '320px', top: '100px' });
            }

            requestSupport(action = 'cheer') {
                if (!(this.isSpectator || this.me.isDead) || this.isGameOver) return false;
                const now = performance.now();
                if (now < this.supportCooldownUntil) return false;
                this.supportCooldownUntil = now + (action === 'cleanTop' ? 6000 : 1500);
                this.refreshSupportPanel();
                if (isHost) this.applySupport(action, this.myIndex);
                else if (conn && conn.open) conn.send({ type: 'party_support', id: this.myIndex, action });
                return true;
            }

            applySupport(action = 'cheer', fromId = this.myIndex) {
                if (this.isGameOver) return false;
                const safeFrom = normalizeNetworkId(fromId);
                if (action === 'cleanTop') {
                    let changed = false;
                    for (let y = 0; y < Math.min(4, this.arena.length); y++) {
                        if (this.arena[y].some(Boolean)) {
                            this.arena[y].fill(0);
                            changed = true;
                        }
                    }
                    if (!changed) {
                        const firstFilled = this.arena.findIndex(row => row.some(Boolean));
                        if (firstFilled >= 0) {
                            this.arena[firstFilled].fill(0);
                            changed = true;
                        }
                    }
                    this.showAction(`P${safeFrom + 1} SUPPORT!`);
                    if (isHost) {
                        partyClients.forEach(c => {
                            if (c && c.open) {
                                c.send({ type: 'party_arena', arena: this.arena, cleared: 0 });
                                c.send({ type: 'party_cheer', text: `P${safeFrom + 1} SUPPORT!` });
                            }
                        });
                    }
                    if (changed) captureReplayFrame(performance.now(), true);
                    return true;
                }
                this.showAction(`P${safeFrom + 1} CHEER!`);
                if (isHost) partyClients.forEach(c => c && c.open && c.send({ type: 'party_cheer', text: `P${safeFrom + 1} CHEER!` }));
                return true;
            }

            refreshSupportPanel() {
                const panel = document.getElementById('party-support-panel');
                if (!panel) return;
                const canSupport = !this.isGameOver && (this.isSpectator || this.me.isDead);
                panel.style.display = canSupport ? 'flex' : 'none';
                const badge = document.getElementById('party-spectator-badge');
                if (badge) {
                    if (this.isSpectator) badge.innerText = 'SPECTATOR SUPPORT';
                    else if (this.me.isDead) badge.innerText = this.sharedDeathMode === 'collective' ? 'TEAM DOWN' : 'SUPPORT MODE';
                }
                const remaining = Math.max(0, this.supportCooldownUntil - performance.now());
                panel.querySelectorAll('button').forEach(btn => btn.disabled = remaining > 0);
            }

            update(dt) {
                if (this.isGameOver) return;
                this.me.time += dt;
                this.refreshSupportPanel();

                if (!this.isSpectator && !this.me.isDead) {
                    this.me.dropCounter += dt;
                    if (this.me.dropCounter > (keysDown[cfg.keys.soft] ? 1000 / cfg.sdf : 1000)) this.playerDrop(keysDown[cfg.keys.soft]);

                    const handleSide = (key, side) => {
                        const dir = side === 'L' ? -1 : 1;
                        let isPressed = keysDown[cfg.keys[key]];

                        if (keysDown[cfg.keys.left] && keysDown[cfg.keys.right]) {
                            if ((keysDownTime[cfg.keys.left] || 0) > (keysDownTime[cfg.keys.right] || 0)) {
                                if (key === 'right') isPressed = false;
                            } else {
                                if (key === 'left') isPressed = false;
                            }
                        }

                        if (isPressed) {
                            if (this.me['das' + side] === 0) this.playerMove(dir);
                            this.me['das' + side] += dt;
                            if (this.me['das' + side] >= cfg.das) {
                                this.me['arr' + side] += dt;
                                while (this.me['arr' + side] >= cfg.arr) { if (!this.playerMove(dir)) break; this.me['arr' + side] -= (cfg.arr || 1); }
                            }
                        } else { this.me['das' + side] = 0; this.me['arr' + side] = 0; }
                    };
                    handleSide('left', 'L'); handleSide('right', 'R');

                    if (this.collide(this.me.matrix, { x: this.me.pos.x, y: this.me.pos.y + 1 })) {
                        this.me.lockDelayCounter += dt; if (this.me.lockDelayCounter >= 500) { this.lock(); this.me.lockDelayCounter = 0; }
                    } else this.me.lockDelayCounter = 0;
                }

                this.syncTimer += dt;
                if (this.syncTimer > 30) {
                    let pData = { type: 'party_sync', id: this.myIndex, matrix: (this.isSpectator || this.me.isDead) ? null : this.me.matrix, pos: this.me.pos, color: this.me.color };
                    if (isHost) partyClients.forEach(c => c.send(pData));
                    else if (conn && conn.open) conn.send(pData);
                    this.syncTimer = 0;
                }

                this.draw();
            }

            checkHostGameOver() {
                if (!isHost || this.isGameOver) return;
                const alivePlayers = [];
                for (let i = 0; i < this.playerCount; i++) {
                    if (this.playerRoles[i] === 'spectator') continue;
                    if (!this.playersDead[i]) alivePlayers.push(i);
                }
                if (alivePlayers.length > 1) return;
                const winner = alivePlayers.length === 1 ? alivePlayers[0] : -1;
                this.endPartyForAll(winner);
            }

            gameOver(winner = -1) {
                if (this.isGameOver) return;
                this.isGameOver = true;
                this.refreshSupportPanel();
                const didWin = winner === this.myIndex;
                const result = this.isSpectator ? 'gameover' : (didWin ? 'victory' : 'defeat');
                queueMatchSummary(result, 'party');
                showToast(didWin ? TRANSLATIONS[cfg.lang].victory : TRANSLATIONS[cfg.lang].defeat);
            }

            draw() {
                this.ctx.clearRect(0, 0, 30 * 24, 30 * 24);
                const s = 24;
                this.arena.forEach((row, y) => row.forEach((v, x) => {
                    if (v !== 0) {
                        this.ctx.fillStyle = COLORS[v]; this.ctx.fillRect(x * s, y * s, s, s);
                        this.ctx.strokeStyle = 'rgba(0,0,0,0.5)'; this.ctx.strokeRect(x * s, y * s, s, s);
                    }
                }));

                for (let i = 0; i < this.playerCount; i++) {
                    if (i === this.myIndex) continue;
                    let o = this.others[i];
                    if (o && o.matrix && !this.playersDead[i]) {
                        this.ctx.globalAlpha = 0.5;
                        o.matrix.forEach((row, y) => row.forEach((v, x) => {
                            if (v !== 0) {
                                this.ctx.fillStyle = COLORS[o.color]; this.ctx.fillRect((x + o.pos.x) * s, (y + o.pos.y) * s, s, s);
                                this.ctx.strokeRect((x + o.pos.x) * s, (y + o.pos.y) * s, s, s);
                            }
                        }));
                        this.ctx.globalAlpha = 1.0;
                    }
                }

                if (!this.me.isDead && this.me.matrix) {
                    const gp = { ...this.me.pos }; while (!this.collide(this.me.matrix, { x: gp.x, y: gp.y + 1 })) gp.y++;
                    this.ctx.globalAlpha = cfg.ghost;
                    this.me.matrix.forEach((row, y) => row.forEach((v, x) => {
                        if (v !== 0) {
                            this.ctx.fillStyle = COLORS[this.me.color]; this.ctx.fillRect((x + gp.x) * s, (y + gp.y) * s, s, s);
                            this.ctx.strokeRect((x + gp.x) * s, (y + gp.y) * s, s, s);
                        }
                    }));
                    this.ctx.globalAlpha = 1.0;

                    this.me.matrix.forEach((row, y) => row.forEach((v, x) => {
                        if (v !== 0) {
                            this.ctx.fillStyle = COLORS[this.me.color]; this.ctx.fillRect((x + this.me.pos.x) * s, (y + this.me.pos.y) * s, s, s);
                            this.ctx.strokeStyle = 'rgba(0,0,0,0.5)'; this.ctx.strokeRect((x + this.me.pos.x) * s, (y + this.me.pos.y) * s, s, s);
                        }
                    }));
                }
            }

            updateUI() {
                const drawMini = (ctx, type, overrideColor = null) => {
                    const t = THEMES[cfg.theme] || THEMES['default'];
                    if (!ctx) return; ctx.fillStyle = t.canvasBg; ctx.fillRect(0, 0, 60, 60);
                    if (!type) return; const m = PIECES[type], s = 10; ctx.fillStyle = COLORS[overrideColor || (Object.keys(PIECES).indexOf(type) + 1)];
                    const ox = (60 - m[0].length * s) / 2, oy = (60 - m.length * s) / 2;
                    m.forEach((row, y) => row.forEach((v, x) => { if (v) ctx.fillRect(x * s + ox, y * s + oy, s - 1, s - 1); }));
                };

                let hCanvas = document.getElementById(`party-hold-${this.myIndex}`);
                if (hCanvas) drawMini(hCanvas.getContext('2d'), this.me.holdType, this.me.holdColor);

                for (let i = 0; i < 3; i++) {
                    let nCanvas = document.getElementById(`party-next-${this.myIndex}-${i}`);
                    if (nCanvas) drawMini(nCanvas.getContext('2d'), this.me.nextQueue[i]);
                }

                let sElem = document.getElementById(`party-score-${this.myIndex}`);
                if (sElem) sElem.innerText = this.me.score;
            }
        }

        // --- Animation Loop ---
        let p1, cpu, lastTime = 0, keysDown = {}, keysDownTime = {};
        let soloCpuHintEnabled = false, soloCpuHintMove = null, soloCpuHintNeedsHold = false;
        let isPaused = false;

        // --- Gamepad & Touch Controls ---
        let prevGamepadState = [];
        function pollGamepad() {
            if (isReplayPlayback) return;
            if (isAdminControlLockActive() && p1 && !p1.isGameOver && !isPaused) {
                keysDown[cfg.keys.left] = false;
                keysDown[cfg.keys.right] = false;
                keysDown[cfg.keys.soft] = false;
                prevGamepadState = [];
                return;
            }
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < gamepads.length; i++) {
                const gp = gamepads[i];
                if (!gp) continue;

                if (capturingKey && isGamepadConnected) {
                    for (let b = 0; b < gp.buttons.length; b++) {
                        if (gp.buttons[b].pressed) {
                            cfg.padKeys[capturingKey] = b;
                            capturingKey = null;
                            updateUIFromCfg();
                            saveCfg();
                            return;
                        }
                    }
                }

                const prevState = prevGamepadState[i] || {};
                const currentState = {};

                const isPressed = (idx) => gp.buttons[idx] && gp.buttons[idx].pressed;

                const deadzone = cfg.gamepadDeadzone || 0.5;
                const leftAxis = gp.axes[0] < -deadzone;
                const rightAxis = gp.axes[0] > deadzone;
                const downAxis = gp.axes[1] > deadzone;
                const upAxis = gp.axes[1] < -deadzone;

                const left = isPressed(cfg.padKeys.left) || leftAxis;
                const right = isPressed(cfg.padKeys.right) || rightAxis;
                const softDrop = isPressed(cfg.padKeys.soft) || downAxis;
                const hardDrop = isPressed(cfg.padKeys.hard) || upAxis;
                const rotR = isPressed(cfg.padKeys.rotR);
                const rotL = isPressed(cfg.padKeys.rotL);
                const holdBtn = isPressed(cfg.padKeys.hold) || isPressed(cfg.padKeys.hold2);
                const pauseBtn = isPressed(cfg.padKeys.pause);
                const retryBtn = isPressed(cfg.padKeys.retry);

                currentState.left = left;
                currentState.right = right;
                currentState.softDrop = softDrop;
                currentState.hardDrop = hardDrop;
                currentState.rotR = rotR;
                currentState.rotL = rotL;
                currentState.holdBtn = holdBtn;
                currentState.pauseBtn = pauseBtn;
                currentState.retryBtn = retryBtn;

                if (left && !keysDown[cfg.keys.left]) keysDownTime[cfg.keys.left] = performance.now();
                if (right && !keysDown[cfg.keys.right]) keysDownTime[cfg.keys.right] = performance.now();

                keysDown[cfg.keys.left] = left;
                keysDown[cfg.keys.right] = right;
                keysDown[cfg.keys.soft] = softDrop;

                if (pauseBtn && !prevState.pauseBtn) handlePauseToggle();
                if (retryBtn && !prevState.retryBtn) handleRetry();

                if (p1 && !p1.isGameOver && !isPaused) {
                    if (rotR && !prevState.rotR) p1.playerRotate(1);
                    if (rotL && !prevState.rotL) p1.playerRotate(-1);
                    if (holdBtn && !prevState.holdBtn) p1.playerHold();
                    if (hardDrop && !prevState.hardDrop) p1.hardDrop();
                }

                prevGamepadState[i] = currentState;
                break;
            }
        }

        const TOUCH_HELD_ACTIONS = new Set(['left', 'right', 'soft']);
        const activeTouchPointers = new Map();
        const touchActionCooldowns = {};
        const touchHeldCounts = {};

        function getTouchControlTarget(allowPausedAction = false) {
            if (isAdminControlLockActive()) return null;
            if (window.partyModeInstance && isPartyMode && !isPaused && !window.partyModeInstance.isGameOver) return window.partyModeInstance;
            if (allowPausedAction) return p1 || null;
            return p1 && !p1.isGameOver && !isPaused ? p1 : null;
        }

        function setVirtualKey(action, pressed) {
            const key = cfg.keys[action];
            if (!key) return;
            if (pressed && !keysDown[key]) {
                keysDownTime[key] = performance.now();
            }
            keysDown[key] = pressed;
        }

        function pressTouchHeldAction(action) {
            touchHeldCounts[action] = (touchHeldCounts[action] || 0) + 1;
            if (touchHeldCounts[action] === 1) setVirtualKey(action, true);
        }

        function releaseTouchHeldAction(action) {
            touchHeldCounts[action] = Math.max(0, (touchHeldCounts[action] || 0) - 1);
            if (touchHeldCounts[action] === 0) setVirtualKey(action, false);
        }

        function runTouchTapAction(action) {
            if (isReplayPlayback) return;
            const now = performance.now();
            if (touchActionCooldowns[action] && now - touchActionCooldowns[action] < 90) return;
            touchActionCooldowns[action] = now;

            if (navigator.vibrate) navigator.vibrate(8);
            if (action === 'pause') {
                handlePauseToggle();
                return;
            }
            if (action === 'retry') {
                handleRetry();
                return;
            }

            const target = getTouchControlTarget();
            if (!target) return;
            if (action === 'rotR') target.playerRotate(1);
            else if (action === 'rotL') target.playerRotate(-1);
            else if (action === 'hold') target.playerHold();
            else if (action === 'hard') target.hardDrop();
        }

        function bindTouchButton(btn) {
            const action = btn.getAttribute('data-action');
            if (!action) return;
            btn.draggable = false;
            btn.addEventListener('contextmenu', e => e.preventDefault());
            btn.addEventListener('dragstart', e => e.preventDefault());
            btn.addEventListener('click', e => e.preventDefault());

            const release = (e) => {
                e.preventDefault();
                const key = e.pointerId !== undefined ? e.pointerId : 'mouse';
                const heldAction = activeTouchPointers.get(key);
                if (heldAction && TOUCH_HELD_ACTIONS.has(heldAction)) releaseTouchHeldAction(heldAction);
                activeTouchPointers.delete(key);
                btn.classList.remove('is-pressed');
            };

            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                if (btn.setPointerCapture && e.pointerId !== undefined) {
                    try { btn.setPointerCapture(e.pointerId); } catch (err) {}
                }
                btn.classList.add('is-pressed');
                const key = e.pointerId !== undefined ? e.pointerId : 'mouse';
                activeTouchPointers.set(key, action);
                if (TOUCH_HELD_ACTIONS.has(action)) {
                    pressTouchHeldAction(action);
                    if (navigator.vibrate) navigator.vibrate(4);
                } else {
                    runTouchTapAction(action);
                }
            }, { passive: false });
            btn.addEventListener('pointerup', release, { passive: false });
            btn.addEventListener('pointercancel', release, { passive: false });
            btn.addEventListener('lostpointercapture', release, { passive: false });
        }

        document.addEventListener('DOMContentLoaded', () => {
            const tBtns = document.querySelectorAll('.t-btn[data-action]');
            tBtns.forEach(bindTouchButton);

            const mobilePieceButton = document.getElementById('mobile-piece-btn');
            if (mobilePieceButton) {
                mobilePieceButton.addEventListener('contextmenu', e => e.preventDefault());
                mobilePieceButton.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    runTouchTapAction('hold');
                }, { passive: false });
            }

            const replayProgress = document.getElementById('replay-progress');
            if (replayProgress) {
                replayProgress.addEventListener('input', (e) => handleReplayScrub(e.target.value));
                replayProgress.addEventListener('change', (e) => handleReplayScrub(e.target.value));
            }

            document.addEventListener('fullscreenchange', updateFullscreenButtonState);
            document.addEventListener('webkitfullscreenchange', updateFullscreenButtonState);
        });

        function resetRound() {
            resetSoloCpuHintState();
            resetBoardForRetry(p1);

            if (cpu) {
                resetBoardForRetry(cpu);
            }

            opponents.forEach(opp => {
                resetBoardForRetry(opp);
            });
        }

        function resetBoardStatsForRetry(board) {
            if (!board || !board.player) return;
            board.player.score = 0;
            board.player.ren = -1;
            board.player.btb = false;
            board.player.time = 0;
            board.player.pieces = 0;
            board.player.lines = 0;
            board.player.attacks = 0;
            board.player.tSpins = 0;
            board.player.garbageReceived = 0;
            board.player.maxRen = 0;
            board.player.perfectClears = 0;
            board.player.skillCoins = 0;
            board.player.holdType = null;
            board.player.holdColor = null;
            board.player.canHold = !(board.ruleSet && board.ruleSet.allowHold === false);
        }

        function resetBoardForRetry(board) {
            if (!board) return;
            const templateKey = board.templateKey && TEMPLATES[board.templateKey] ? board.templateKey : null;
            board.pendingGarbage = 0;
            board.isGameOver = false;
            board.effects = { speedUpUntil: 0, slowUntil: 0 };
            board.bombCountdown = typeof board.getBombSpawnInterval === 'function' ? board.getBombSpawnInterval() : 14;
            board.lockDelayCounter = 0;
            board.lockResetCount = 0;
            board.hasTouchedGround = false;
            resetBoardStatsForRetry(board);

            if (templateKey) {
                board.applyTemplateSetup(templateKey);
            } else {
                board.templateKey = null;
                board.applyRuleGeometry(true);
                board.bag = [];
                board.nextQueue = [];
                while (board.nextQueue.length < 10) board.nextQueue.push(board.pullFromBag());
                board.reset();
                board.updateMeter();
                board.updateUI();
                board.draw();
            }
        }

        function clearSoloCpuHintOverlay() {
            if (p1 && typeof p1.renderCpuHintOverlay === 'function') p1.renderCpuHintOverlay(null);
        }

        function resetSoloCpuHintState() {
            soloCpuHintEnabled = false;
            soloCpuHintMove = null;
            soloCpuHintNeedsHold = false;
            clearSoloCpuHintOverlay();
        }

        function isSoloCpuHintContext() {
            return !!(p1 && !cpu && !isOnline && !isPartyMode && !window.partyModeInstance);
        }

        function syncSoloCpuHint() {
            if (!soloCpuHintEnabled || !isSoloCpuHintContext() || !p1 || p1.isGameOver) {
                soloCpuHintMove = null;
                soloCpuHintNeedsHold = false;
                clearSoloCpuHintOverlay();
                return null;
            }

            soloCpuHintMove = p1.getRecommendedMove({ forcePerfect: true, level: 50, allowJitter: false });
            soloCpuHintNeedsHold = !!(soloCpuHintMove && soloCpuHintMove.useHold);
            p1.renderCpuHintOverlay(soloCpuHintMove);
            return soloCpuHintMove;
        }

        function handleSoloCpuHintToggle() {
            if (!p1 || cpu || isOnline || isPartyMode || window.partyModeInstance || isPaused || inTutorial || p1.isGameOver) return false;

            soloCpuHintEnabled = !soloCpuHintEnabled;
            if (soloCpuHintEnabled) {
                syncSoloCpuHint();
                showToast(cfg.lang === 'ja' ? "CPUおすすめ表示: ON" : "CPU hint: ON");
            } else {
                soloCpuHintMove = null;
                soloCpuHintNeedsHold = false;
                clearSoloCpuHintOverlay();
                showToast(cfg.lang === 'ja' ? "CPUおすすめ表示: OFF" : "CPU hint: OFF");
            }
            return true;
        }

        function animate(t = 0) {
            if (isReplayPlayback) {
                lastTime = t;
                requestAnimationFrame(animate);
                return;
            }
            pollGamepad();
            const dt = Math.min(t - lastTime, 50);
            lastTime = t;
            if (!isPaused) {
                if (p1) p1.update(dt);
                if (cpu) cpu.update(dt);
                opponents.forEach(o => o.update(dt));
                if (isPartyMode && window.partyModeInstance) {
                    window.partyModeInstance.update(dt);
                }
                captureReplayFrame(t);
                sampleMatchTimeline();
                if (currentSoloModeId && p1 && !cpu && !isOnline && !window.partyModeInstance) syncSoloStatusPanel();
            }
            requestAnimationFrame(animate);
        }

        // --- Start Game ---
        function startGame(isCPU, playerTmpl = null, isLoad = false, gameOptions = {}) {
            if (isCPU && blockAdminRestrictedAction()) return;
            resetSoloCpuHintState();
            restoreGameViewLayout();
            document.getElementById('menu').style.display = 'none';
            document.getElementById('mode-select-menu').style.display = 'none';
            document.getElementById('solo-menu').style.display = 'none';
            document.getElementById('game-view').style.display = 'flex';
            updateTouchControlsVisibility();
            const meters = document.querySelectorAll('.meter-container');
            currentSoloModeId = !isCPU ? (gameOptions.soloModeId || null) : null;
            const soloModeDef = getSoloModeDef(currentSoloModeId);
            const soloRuleSet = { ...DEFAULT_ROOM_RULES, ...((soloModeDef && soloModeDef.ruleSet) || {}) };

            if (isCPU) {
                meters.forEach(m => m.style.display = 'block'); document.getElementById('cpu-field').style.display = 'flex';
                p1 = new Tetris('p-canvas', 'p-hold', 'p-next', 'p-score', false, 'p-action-layer', 'p-meter', null, isLoad);
                cpu = new Tetris('c-canvas', 'c-hold', 'c-next', 'c-score', true, 'c-action-layer', 'c-meter', null, isLoad);
                p1.displayName = cfg.playerName || 'PLAYER 1';
                applyRuleSetToActiveBoards(DEFAULT_ROOM_RULES);
                if (playerTmpl) p1.applyTemplateSetup(playerTmpl);
                beginMatchSession('cpu', DEFAULT_ROOM_RULES);
                captureReplayFrame(performance.now(), true);
                p1.opponent = cpu; cpu.opponent = p1; document.getElementById('current-lv').innerText = cfg.lv;
            } else {
                meters.forEach(m => m.style.display = 'none'); document.getElementById('cpu-field').style.display = 'none';
                p1 = new Tetris('p-canvas', 'p-hold', 'p-next', 'p-score', false, 'p-action-layer', 'p-meter', null, isLoad);
                p1.displayName = cfg.playerName || 'PLAYER 1';
                cpu = null;
                applyRuleSetToActiveBoards(soloRuleSet);
                if (playerTmpl) p1.applyTemplateSetup(playerTmpl);
                beginMatchSession('solo', p1.ruleSet || soloRuleSet, { soloModeId: currentSoloModeId });
                captureReplayFrame(performance.now(), true);
            }
            refreshSkillPanel(p1);
            syncSoloStatusPanel();
            isPaused = false;
            resetConnectionQuality();

            if (!isLoad && !lastTime) animate();
            else if (isLoad) lastTime = performance.now();
        }

        function startTutorial() {
            inTutorial = true;
            startGame(false, null);
            showToast(cfg.lang === 'ja' ? "チュートリアル開始: 1分プレイしてください！" : "Tutorial: Play for 1 minute!");
            tutorialTimeout = setTimeout(() => {
                endTutorial();
            }, 60000);
        }

        function endTutorial() {
            if (tutorialTimeout) clearTimeout(tutorialTimeout);
            tutorialTimeout = null;
            inTutorial = false;
            cfg.hasCompletedTutorial = true;
            saveCfg();
            updateUIFromCfg();
            updateTutorialEntryUI();
            showToast(cfg.lang === 'ja' ? "チュートリアル完了！設定を確認してください" : "Tutorial Completed! Please review your settings.");
            returnToMenu();
            const settingsOverlay = document.getElementById('settings-overlay');
            if (settingsOverlay.style.display !== 'flex') {
                toggleSettings();
            }
        }

        function toggleSettings() { const s = document.getElementById('settings-overlay').style; s.display = s.display === 'flex' ? 'none' : 'flex'; }
        function showToast(txt) {
            const container = document.getElementById('toast-container');
            const el = document.createElement('div');
            el.className = 'toast';
            el.innerText = txt;
            container.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }

        // --- キー操作処理（大文字小文字を区別せず処理する） ---
        window.addEventListener('keydown', e => {
            if (adminControlEnabled && e.key === 'Tab') {
                e.preventDefault();
                postAdminMessage('toggle-panel', {});
                postAdminState('tab');
                return;
            }
            if (capturingKey) {
                cfg.keys[capturingKey] = e.key; capturingKey = null; updateUIFromCfg(); saveCfg(); e.preventDefault();
                return;
            }

            if (adminControlEnabled && !isEditableElement(document.activeElement) && toggleAdminCheatByShortcut(e.key)) {
                e.preventDefault();
                return;
            }

            if (isReplayPlayback) {
                if (e.key === 'Escape') stopReplayPlayback();
                return;
            }

            // 入力欄にフォーカスがあるときはゲームキーを無視する
            if (isEditableElement(document.activeElement)) return;
            if (isAdminControlLockActive() && p1 && !p1.isGameOver && !isPaused) {
                e.preventDefault();
                keysDown = {};
                keysDownTime = {};
                showToast(getAdminControlLockText());
                return;
            }

            let key = e.key;
            if (key.toLowerCase() === 'p' && handleSoloCpuHintToggle()) {
                e.preventDefault();
                return;
            }
            let matchedKey = key;
            // 設定されたキーと大文字・小文字を無視して一致するものがあれば、設定済みのキー名に変換する
            for (let k in cfg.keys) {
                if (cfg.keys[k].toLowerCase() === key.toLowerCase()) {
                    matchedKey = cfg.keys[k];
                    break;
                }
            }

            if (!keysDown[matchedKey]) {
                keysDownTime[matchedKey] = performance.now();
                keysDownTime[key] = performance.now();
            }

            keysDown[matchedKey] = true;
            keysDown[key] = true;
            pushReplayInputEvent('down', key, matchedKey);

            if (matchedKey === cfg.keys.pause) { e.preventDefault(); handlePauseToggle(); return; }
            if (matchedKey === cfg.keys.retry) { e.preventDefault(); handleRetry(); return; }

            if (window.partyModeInstance && isPartyMode && !isPaused && !window.partyModeInstance.isGameOver) {
                if (matchedKey === cfg.keys.rotR) window.partyModeInstance.playerRotate(1);
                if (matchedKey === cfg.keys.rotL) window.partyModeInstance.playerRotate(-1);
                if (matchedKey === cfg.keys.hold || matchedKey === cfg.keys.hold2) window.partyModeInstance.playerHold();
                if (matchedKey === cfg.keys.hard) { e.preventDefault(); window.partyModeInstance.hardDrop(); }
            } else if (p1 && !p1.isGameOver && !isPaused) {
                if (matchedKey === cfg.keys.rotR) p1.playerRotate(1);
                if (matchedKey === cfg.keys.rotL) p1.playerRotate(-1);
                if (matchedKey === cfg.keys.hold || matchedKey === cfg.keys.hold2) p1.playerHold();
                if (matchedKey === cfg.keys.hard) { e.preventDefault(); p1.hardDrop(); }
            }
            captureReplayFrame(performance.now(), true);
        });

        window.addEventListener('keyup', e => {
            if (isReplayPlayback) return;
            let key = e.key;
            let matchedKey = key;
            for (let k in cfg.keys) {
                if (cfg.keys[k].toLowerCase() === key.toLowerCase()) {
                    matchedKey = cfg.keys[k];
                    break;
                }
            }
            keysDown[matchedKey] = false;
            keysDown[key] = false;
            pushReplayInputEvent('up', key, matchedKey);
            captureReplayFrame(performance.now(), true);
        });

        
        function bindSliderGroup(inputId, rangeId, cfgKey, scale, isFloat, parser) {
            const input = document.getElementById(inputId);
            const range = document.getElementById(rangeId);
            if (!input || !range) return;
            
            const clampStr = (val, el) => {
                let v = parser(val);
                if (isNaN(v)) return parser(el.min);
                v = Math.max(parser(el.min), Math.min(parser(el.max), v));
                return v;
            };

            range.addEventListener('input', e => {
                let v = parser(e.target.value) / scale;
                input.value = v;
                cfg[cfgKey] = v;
                if (cfgKey.startsWith('touch')) applyTouchControlSettings();
                if (cfgKey !== 'lv' && typeof p1 !== 'undefined' && p1) { p1.updateUI(); }
                saveCfg();
            });
            input.addEventListener('change', e => {
                let v = clampStr(e.target.value, input);
                input.value = v;
                range.value = v * scale;
                cfg[cfgKey] = v;
                if (cfgKey.startsWith('touch')) applyTouchControlSettings();
                if (cfgKey !== 'lv' && typeof p1 !== 'undefined' && p1) { p1.updateUI(); }
                saveCfg();
            });
        }
        bindSliderGroup('lv-val', 'lv-range', 'lv', 1, false, parseInt);
        bindSliderGroup('ghost-val', 'ghost-range', 'ghost', 100, true, parseFloat);
        bindSliderGroup('das-val', 'das-range', 'das', 1, false, parseInt);
        bindSliderGroup('arr-val', 'arr-range', 'arr', 1, false, parseInt);
        bindSliderGroup('sdf-val', 'sdf-range', 'sdf', 1, false, parseInt);
        bindSliderGroup('pad-deadzone-val', 'pad-deadzone-range', 'gamepadDeadzone', 100, true, parseFloat);
        bindSliderGroup('particles-val', 'particles-range', 'particles', 1, false, parseInt);
        bindSliderGroup('touch-size-val', 'touch-size-range', 'touchButtonScale', 100, true, parseFloat);
        bindSliderGroup('touch-opacity-val', 'touch-opacity-range', 'touchOpacity', 100, true, parseFloat);

        loadCfg();
        updateProfileUI();
        updateTutorialEntryUI();
        updateMenuLoadButton();
        const templateJsonFileInput = document.getElementById('template-json-file');
        if (templateJsonFileInput) templateJsonFileInput.addEventListener('change', handleTemplateJsonFile);
        renderCustomTemplateButtons();
        bindPartyRuleCardInteractions();
        syncPartyRuleSelectionUI();
        updateTouchControlsVisibility();
        updateOnlineLobbyExitButton();
        applyAdminRestrictionUI();
        enforceAdminRestrictionMode();
        postAdminState('ready');
        listReplayArchiveEntries().catch(err => console.warn('Replay archive bootstrap failed:', err));

        if (cfg.hasCompletedTutorial) {
            // Reserve my name globally
            resumeIdentityReservation();
        }

        const bg = document.getElementById('bg-canvas'); const bctx = bg.getContext('2d');
        function resize() {
            bg.width = window.innerWidth;
            bg.height = window.innerHeight;

            const scaleX = window.innerWidth / 750;
            const scaleY = window.innerHeight / 650;
            const scale = Math.min(scaleX, scaleY, 1) / (cfg.screenScale || 1.0);

            const gameView = document.getElementById('game-view');
            if (gameView) {
                gameView.style.transform = `scale(${scale})`;
                gameView.style.transformOrigin = 'center center';
            }

            const menu = document.getElementById('menu');
            if (menu) {
                menu.style.transform = `scale(${scale})`;
                menu.style.transformOrigin = 'center center';
            }

            [p1, cpu, ...opponents].forEach(board => {
                if (board && typeof board.applyRuleGeometry === 'function') {
                    board.applyRuleGeometry(false);
                    if (typeof board.draw === 'function') board.draw();
                }
            });
        }
        window.onresize = resize; resize();
        let stars = Array.from({ length: 80 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, s: Math.random() * 2, o: Math.random() }));
        function updateStarsCount() {
            let limit = parseInt(cfg.particles);
            if (isNaN(limit)) limit = 80;
            while (stars.length < limit) {
                stars.push({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, s: Math.random() * 2, o: Math.random() });
            }
            if (stars.length > limit) stars.length = limit;
        }
        function drawBg() {
            const t = THEMES[cfg.theme] || THEMES['default'];
            bctx.fillStyle = t.bg; bctx.fillRect(0, 0, bg.width, bg.height);
            stars.forEach(s => { bctx.fillStyle = `rgba(${t.star}, ${s.o})`; bctx.fillRect(s.x, s.y, s.s, s.s); s.y = (s.y + 0.2) % bg.height; });
            requestAnimationFrame(drawBg);
        }
        drawBg();
        animate(); 
    






