'use strict';
/* =====================================================================
 * Tetris Ultimate - Admin Cheat Panel v2
 * 既存の postMessage プロトコル(PANEL_SOURCE / GAME_SOURCE / トークン)は
 * script.js 側と完全互換です。UIのみカテゴリ折りたたみ・検索対応の
 * データ駆動レンダリングに刷新しています。
 * ===================================================================== */

const PANEL_SOURCE = 'tetris-admin-panel-v1';
const GAME_SOURCE = 'tetris-admin-game-v1';

// --- 常時チート(ON/OFF) 一覧。script.js の ADMIN_CHEAT_BOOLEAN_KEYS と同じキーです ---
const CHEAT_LABELS = {
    invincible: '無敵', shield: '攻撃無効', infiniteHold: '無限ホールド', autoHoldReady: 'ホールド常時可',
    garbageCleaner: 'お邪魔自動掃除', noGravity: '重力停止', lockDelayFreeze: 'ロック停止', autoClearBoard: '盤面自動消去',
    autoTetrisReady: '4段テトリス維持', hardDropOnlyI: 'ハードドロップI固定', alwaysB2B: 'BTB維持', comboKeeper: 'REN維持',
    freezeCpu: 'CPU停止', autoPerfectClearReady: 'パフェ待ち維持', autoSkillCoins: 'コイン自動補充', scoreBooster: 'スコア自動加算',
    slowMotion: '自分だけスロー', topOutRescue: '詰み救済',
    holdLock: 'ホールド禁止', ghostOff: 'ゴースト非表示', ghostFull: 'ゴースト常時濃く', invisibleMode: '自機透明化',
    speedUp: '高速化', autoPlay: 'オートプレイ(AI)', timeFreeze: '時間停止(ロック延長)',
    fxShake: '画面シェイク', fxFlash: 'フラッシュ演出', fxRainbow: 'レインボー演出', fxMatrix: 'マトリックス演出',
    devFps: 'FPS表示', devDebug: 'デバッグ情報表示', devHitbox: 'ヒットボックス/衝突表示', devEventLog: 'イベントログ表示', devMemory: 'メモリ使用量表示',
    netFakePing: '疑似Ping表示', netSimulateLag: '疑似ラグ表示'
};

const CHEAT_CATEGORIES = [
    { id: 'game', label: 'ゲーム/システム', icon: '⏱️', keys: ['noGravity', 'lockDelayFreeze', 'timeFreeze', 'freezeCpu'] },
    { id: 'player', label: 'プレイヤー', icon: '🧍', keys: ['invincible', 'shield', 'infiniteHold', 'autoHoldReady', 'holdLock', 'ghostOff', 'ghostFull', 'invisibleMode', 'topOutRescue'] },
    { id: 'board-auto', label: 'ボード自動化', icon: '🧱', keys: ['garbageCleaner', 'autoClearBoard', 'autoTetrisReady', 'autoPerfectClearReady', 'hardDropOnlyI', 'alwaysB2B', 'comboKeeper'] },
    { id: 'economy', label: 'スコア/経済', icon: '💰', keys: ['autoSkillCoins', 'scoreBooster'] },
    { id: 'fx', label: 'エフェクト/速度', icon: '✨', keys: ['slowMotion', 'speedUp', 'fxShake', 'fxFlash', 'fxRainbow', 'fxMatrix'] },
    { id: 'ai', label: 'AI', icon: '🤖', keys: ['autoPlay'] },
    { id: 'dev', label: '開発者向け', icon: '🛠️', keys: ['devFps', 'devDebug', 'devHitbox', 'devEventLog', 'devMemory'] },
    { id: 'network', label: 'ネットワーク(表示のみ)', icon: '📶', keys: ['netFakePing', 'netSimulateLag'] }
];

const CHEAT_SETTINGS_DEFAULTS = {
    invincibleRescueMode: 'center4', indicatorPosition: 'top-left', comboMinRen: 10,
    autoSkillCoinsAmount: 1, scoreBoostAmount: 1000, slowMotionFactor: 0.35,
    speedUpFactor: 2, fakePingMs: 120, simulatedLagMs: 200
};
const CHEAT_SETTINGS_FIELDS = [
    { key: 'invincibleRescueMode', label: '無敵救済モード', type: 'select', options: [['center4', '中央4列'], ['fullClear', '全消し']] },
    { key: 'indicatorPosition', label: 'チート表示位置', type: 'select', options: [['top-left', '左上'], ['top-right', '右上'], ['bottom-left', '左下'], ['bottom-right', '右下']] },
    { key: 'comboMinRen', label: 'REN維持の最低値', type: 'number', min: 0, max: 99 },
    { key: 'autoSkillCoinsAmount', label: 'コイン自動補充量', type: 'number', min: 1, max: 999 },
    { key: 'scoreBoostAmount', label: 'スコア自動加算量', type: 'number', min: 1, max: 999999 },
    { key: 'slowMotionFactor', label: 'スロー倍率', type: 'number', min: 0.05, max: 1, step: 0.05 },
    { key: 'speedUpFactor', label: '高速化倍率', type: 'number', min: 1, max: 10, step: 0.5 },
    { key: 'fakePingMs', label: '疑似Ping(ms)', type: 'number', min: 0, max: 9999 },
    { key: 'simulatedLagMs', label: '疑似ラグ(ms)', type: 'number', min: 0, max: 9999 }
];

const SHORTCUT_KEYS = ['invincible', 'infiniteHold', 'noGravity', 'garbageCleaner', 'slowMotion', 'autoPlay', 'ghostOff', 'invisibleMode'];

const PIECE_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

let adminSessionToken = '';
let gameReady = false;
let cheatState = null; // 最新の adminCheats (ゲーム側から state で受信)
let latestPlayers = [];
let latestControlLock = null;
let latestRestriction = null;

const $ = sel => document.querySelector(sel);
const gameFrame = $('#game-frame');
const panelEl = $('#admin-panel');

function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function createAdminSessionToken() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return `admin-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setStatus(text) {
    $('#status-line').textContent = text;
}

function send(command, payload = {}) {
    if (!gameFrame || !gameFrame.contentWindow) return;
    gameFrame.contentWindow.postMessage({
        source: PANEL_SOURCE,
        type: 'admin-command',
        token: adminSessionToken,
        command,
        payload
    }, '*');
}

function numberValue(input, fallback = 0) {
    const v = Number(input.value);
    return Number.isFinite(v) ? v : fallback;
}

function getTargetName() {
    return ($('#target-name').value || '').trim();
}

// -----------------------------------------------------------------------
// 常時チート カテゴリ描画
// -----------------------------------------------------------------------
function renderCheatCategories() {
    const root = $('#cheat-category-root');
    root.innerHTML = '';
    CHEAT_CATEGORIES.forEach(cat => {
        const details = document.createElement('details');
        details.className = 'panel-card cheat-category compact';
        details.dataset.categoryId = cat.id;
        details.open = true;

        const summary = document.createElement('summary');
        summary.className = 'section-title';
        summary.innerHTML = `<h2>${cat.icon} ${escapeHtml(cat.label)}</h2><span class="cat-count">${cat.keys.length}</span>`;
        details.appendChild(summary);

        const grid = document.createElement('div');
        grid.className = 'toggle-grid compact-grid';
        cat.keys.forEach(key => {
            const label = CHEAT_LABELS[key] || key;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hack-row admin-toggle compact-toggle';
            btn.dataset.cheat = key;
            btn.title = label;
            btn.dataset.searchText = label.toLowerCase() + ' ' + key.toLowerCase();
            btn.innerHTML = `<span class="toggle-label">${escapeHtml(label)}</span><strong>OFF</strong>`;
            btn.addEventListener('click', () => {
                const next = !(cheatState && cheatState[key]);
                pushCheats({ [key]: next });
            });
            grid.appendChild(btn);
        });
        details.appendChild(grid);
        root.appendChild(details);
    });
}

function refreshCheatToggleVisuals() {
    document.querySelectorAll('.admin-toggle').forEach(btn => {
        const key = btn.dataset.cheat;
        const on = !!(cheatState && cheatState[key]);
        btn.classList.toggle('on', on);
        btn.querySelector('strong').textContent = on ? 'ON' : 'OFF';
    });
}

function pushCheats(partial) {
    const merged = Object.assign({}, cheatState || {}, partial);
    send('setCheats', { cheats: merged });
    // 楽観的に即時反映(ゲーム側からの state 応答で正式に上書きされます)
    cheatState = merged;
    refreshCheatToggleVisuals();
}

// -----------------------------------------------------------------------
// ワンショット操作 カテゴリ描画
// -----------------------------------------------------------------------
function makeActionButton(label, { danger = false, onClick, confirmText = null } = {}) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `hack-row ${danger ? 'danger' : 'action'}`;
    btn.dataset.searchText = label.toLowerCase();
    btn.textContent = label;
    btn.addEventListener('click', () => {
        if (confirmText && !window.confirm(confirmText)) return;
        onClick();
    });
    return btn;
}

function makePieceSelect() {
    const select = document.createElement('select');
    select.className = 'hack-input piece-select';
    PIECE_TYPES.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        select.appendChild(opt);
    });
    return select;
}

function makeInputButtonRow(label, { placeholder = '', value = '', danger = false, buttonLabel, onSubmit }) {
    const wrap = document.createElement('div');
    wrap.className = 'input-actions';
    wrap.dataset.searchText = label.toLowerCase();
    const input = document.createElement('input');
    input.className = 'hack-input';
    input.type = 'number';
    input.placeholder = placeholder;
    input.value = value;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `hack-row ${danger ? 'danger' : 'action'}`;
    btn.textContent = buttonLabel || label;
    btn.addEventListener('click', () => onSubmit(numberValue(input, 0)));
    wrap.appendChild(input);
    wrap.appendChild(btn);
    return wrap;
}

function buildActionCategories() {
    return [
        {
            id: 'board-self', label: '🧱 自分の盤面', items: [
                { render: () => makeActionButton('盤面を空にする', { onClick: () => send('clearOwnBoard') }) },
                { render: () => makeActionButton('お邪魔を消す', { onClick: () => send('clearGarbage') }) },
                { render: () => makeActionButton('4段テトリス待ち', { onClick: () => send('tetrisReady') }) },
                { render: () => makeActionButton('パーフェクトクリア待ち', { onClick: () => send('perfectClearReady') }) },
                { render: () => makeActionButton('危険な山を積む', { danger: true, onClick: () => send('fillBoardSelf') }) },
                { render: () => makeActionButton('ランダム盤面', { danger: true, onClick: () => send('randomBoardSelf') }) },
                { render: () => makeActionButton('左右反転 (Mirror)', { onClick: () => send('mirrorBoard') }) },
                { render: () => makeActionButton('上下反転 (Flip)', { onClick: () => send('flipBoard') }) },
                { render: () => makeActionButton('回転 (Rotate)', { onClick: () => send('rotateBoard') }) },
                {
                    render: () => {
                        const wrap = document.createElement('div');
                        wrap.className = 'input-actions';
                        wrap.dataset.searchText = 'カスタムお邪魔 custom garbage';
                        const amount = document.createElement('input');
                        amount.className = 'hack-input'; amount.type = 'number'; amount.min = 1; amount.max = 200; amount.value = 5;
                        amount.placeholder = '段数';
                        const hole = document.createElement('input');
                        hole.className = 'hack-input'; hole.type = 'number'; hole.min = 0; hole.max = 9; hole.value = 4;
                        hole.placeholder = '穴の列(0-9)';
                        const btn = document.createElement('button');
                        btn.type = 'button'; btn.className = 'hack-row danger'; btn.textContent = 'カスタムお邪魔を追加';
                        btn.addEventListener('click', () => send('addCustomGarbage', { amount: numberValue(amount, 5), holeColumn: numberValue(hole, 4) }));
                        wrap.append(amount, hole, btn);
                        return wrap;
                    }
                }
            ]
        },
        {
            id: 'mino', label: '🧩 ミノ操作', items: [
                {
                    render: () => {
                        const wrap = document.createElement('div');
                        wrap.className = 'field-grid';
                        wrap.dataset.searchText = 'spawn any piece 好きなミノ ネクスト 現在 ホールド';
                        const select = makePieceSelect();
                        const btnNext = document.createElement('button');
                        btnNext.type = 'button'; btnNext.className = 'hack-row action'; btnNext.textContent = 'NEXT';
                        btnNext.addEventListener('click', () => send('setNextPiece', { piece: select.value }));
                        const btnCur = document.createElement('button');
                        btnCur.type = 'button'; btnCur.className = 'hack-row action'; btnCur.textContent = '現在ミノ';
                        btnCur.addEventListener('click', () => send('setCurrentPiece', { piece: select.value }));
                        const btnHold = document.createElement('button');
                        btnHold.type = 'button'; btnHold.className = 'hack-row action'; btnHold.textContent = 'ホールド';
                        btnHold.addEventListener('click', () => send('setHoldPiece', { piece: select.value }));
                        wrap.append(select, btnNext, document.createElement('span'), document.createElement('span'), btnCur, document.createElement('span'), document.createElement('span'), btnHold);
                        return wrap;
                    }
                },
                { render: () => makeActionButton('常時 I固定', { onClick: () => pushCheats({ nextPieceType: 'I' }) }) },
                { render: () => makeActionButton('常時 T固定', { onClick: () => pushCheats({ nextPieceType: 'T' }) }) },
                { render: () => makeActionButton('固定NEXT解除', { onClick: () => pushCheats({ nextPieceType: '' }) }) },
                { render: () => makeActionButton('NEXTをランダム化', { onClick: () => send('randomQueue') }) },
                {
                    render: () => {
                        const wrap = document.createElement('div');
                        wrap.className = 'field-grid';
                        wrap.dataset.searchText = 'repeat queue 繰り返しキュー';
                        const select = makePieceSelect();
                        const btn = document.createElement('button');
                        btn.type = 'button'; btn.className = 'hack-row action'; btn.textContent = 'このミノで埋める';
                        btn.addEventListener('click', () => send('repeatQueue', { piece: select.value }));
                        wrap.append(select, btn, document.createElement('span'));
                        return wrap;
                    }
                },
                {
                    render: () => {
                        const wrap = document.createElement('div');
                        wrap.className = 'input-actions';
                        wrap.dataset.searchText = 'spawn queue キューを指定';
                        const text = document.createElement('input');
                        text.className = 'hack-input'; text.type = 'text'; text.placeholder = '例: I,J,L,O,S,T,Z';
                        const btn = document.createElement('button');
                        btn.type = 'button'; btn.className = 'hack-row action'; btn.textContent = 'キュー設定';
                        btn.addEventListener('click', () => {
                            const list = text.value.split(',').map(s => s.trim().toUpperCase()).filter(s => PIECE_TYPES.includes(s));
                            if (list.length) send('setSpawnQueue', { queue: list });
                        });
                        wrap.append(text, btn);
                        return wrap;
                    }
                }
            ]
        },
        {
            id: 'score', label: '💰 スコア/統計', items: [
                { render: () => makeInputButtonRow('スコア加算', { value: 10000, buttonLabel: 'スコア加算', onSubmit: v => send('addStatSelf', { stat: 'score', value: v }) }) },
                { render: () => makeInputButtonRow('スコア減算', { value: 10000, danger: true, buttonLabel: 'スコア減算', onSubmit: v => send('removeScoreSelf', { value: v }) }) },
                { render: () => makeInputButtonRow('ライン加算', { value: 40, buttonLabel: 'ライン加算', onSubmit: v => send('addStatSelf', { stat: 'lines', value: v }) }) },
                { render: () => makeInputButtonRow('ライン設定', { value: 100, buttonLabel: 'ライン設定', onSubmit: v => send('setLinesSelf', { value: v }) }) },
                { render: () => makeInputButtonRow('レベル設定', { value: 15, buttonLabel: 'レベル設定', onSubmit: v => send('setStatSelf', { stat: 'level', value: v }) }) },
                { render: () => makeInputButtonRow('コンボ(REN)設定', { value: 12, buttonLabel: 'REN設定', onSubmit: v => send('setComboSelf', { value: v }) }) },
                { render: () => makeInputButtonRow('スキルコイン加算', { value: 5, buttonLabel: 'コイン加算', onSubmit: v => send('addStatSelf', { stat: 'skillCoins', value: v }) }) },
                { render: () => makeActionButton('B2B ON', { onClick: () => send('setB2B', { value: true }) }) },
                { render: () => makeActionButton('B2B OFF', { onClick: () => send('setB2B', { value: false }) }) }
            ]
        },
        {
            id: 'game-actions', label: '⏯️ ゲーム操作', items: [
                { render: () => makeActionButton('Instant Win (相手を敗北)', { danger: true, confirmText: '相手を即座に敗北させます。よろしいですか?', onClick: () => send('instantWin') }) },
                { render: () => makeActionButton('Instant Lose (自分敗北)', { danger: true, confirmText: '自分を即座に敗北させます。よろしいですか?', onClick: () => send('instantLose') }) },
                { render: () => makeActionButton('Pause Toggle', { onClick: () => send('togglePause') }) },
                { render: () => makeActionButton('Suggest Move (おすすめ表示)', { onClick: () => send('suggestMove') }) }
            ]
        },
        {
            id: 'test', label: '🧪 テスト', items: [
                { render: () => makeActionButton('Test T-Spin 盤面', { onClick: () => send('testTSpin') }) },
                { render: () => makeActionButton('Test Perfect Clear', { onClick: () => send('perfectClearReady') }) },
                { render: () => makeActionButton('Test Combo', { onClick: () => send('testCombo') }) },
                { render: () => makeActionButton('Test Garbage', { onClick: () => send('testGarbage') }) }
            ]
        }
    ];
}

function renderActionCategories() {
    const root = $('#action-category-root');
    root.innerHTML = '';
    buildActionCategories().forEach(cat => {
        const details = document.createElement('details');
        details.className = 'panel-card action-category';
        details.dataset.categoryId = cat.id;
        details.open = true;

        const summary = document.createElement('summary');
        summary.className = 'section-title';
        summary.innerHTML = `<h2>${escapeHtml(cat.label)}</h2><span class="cat-count">${cat.items.length}</span>`;
        details.appendChild(summary);

        const grid = document.createElement('div');
        grid.className = 'button-grid';
        cat.items.forEach(item => grid.appendChild(item.render()));
        details.appendChild(grid);
        root.appendChild(details);
    });
}

// -----------------------------------------------------------------------
// チート設定値 / ショートカット
// -----------------------------------------------------------------------
function renderCheatSettings() {
    const grid = $('#cheat-settings-grid');
    grid.innerHTML = '';

    // attackMultiplier は adminCheats 直下の数値チート(既存機能)。settings オブジェクトとは別管理です。
    const amLabel = document.createElement('label');
    amLabel.className = 'hack-label';
    amLabel.textContent = '攻撃倍率 (attackMultiplier)';
    const amInput = document.createElement('input');
    amInput.className = 'hack-input';
    amInput.type = 'number'; amInput.min = 1; amInput.max = 100;
    amInput.value = (cheatState && cheatState.attackMultiplier) || 1;
    amInput.addEventListener('change', () => pushCheats({ attackMultiplier: Number(amInput.value) || 1 }));
    grid.appendChild(amLabel);
    grid.appendChild(amInput);

    const settings = (cheatState && cheatState.settings) || CHEAT_SETTINGS_DEFAULTS;
    CHEAT_SETTINGS_FIELDS.forEach(field => {
        const label = document.createElement('label');
        label.className = 'hack-label';
        label.textContent = field.label;
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            input.className = 'hack-input';
            field.options.forEach(([val, text]) => {
                const opt = document.createElement('option');
                opt.value = val; opt.textContent = text;
                input.appendChild(opt);
            });
            input.value = settings[field.key] != null ? settings[field.key] : CHEAT_SETTINGS_DEFAULTS[field.key];
        } else {
            input = document.createElement('input');
            input.className = 'hack-input';
            input.type = 'number';
            if (field.min != null) input.min = field.min;
            if (field.max != null) input.max = field.max;
            if (field.step != null) input.step = field.step;
            input.value = settings[field.key] != null ? settings[field.key] : CHEAT_SETTINGS_DEFAULTS[field.key];
        }
        input.addEventListener('change', () => {
            const nextSettings = Object.assign({}, (cheatState && cheatState.settings) || CHEAT_SETTINGS_DEFAULTS, {
                [field.key]: field.type === 'select' ? input.value : Number(input.value)
            });
            pushCheats({ settings: nextSettings });
        });
        grid.appendChild(label);
        grid.appendChild(input);
    });
}

function renderShortcuts() {
    const grid = $('#cheat-shortcut-grid');
    grid.innerHTML = '';
    const shortcuts = (cheatState && cheatState.shortcuts) || {};
    SHORTCUT_KEYS.forEach(key => {
        const row = document.createElement('div');
        row.className = 'shortcut-row';
        const label = document.createElement('span');
        label.textContent = CHEAT_LABELS[key] || key;
        const input = document.createElement('input');
        input.className = 'hack-input';
        input.readOnly = true;
        input.value = shortcuts[key] || '未設定';
        input.addEventListener('click', () => {
            input.value = 'キー入力待ち...';
            const handler = e => {
                e.preventDefault();
                const nextShortcuts = Object.assign({}, (cheatState && cheatState.shortcuts) || {}, { [key]: e.key });
                pushCheats({ shortcuts: nextShortcuts });
                window.removeEventListener('keydown', handler, true);
            };
            window.addEventListener('keydown', handler, true);
        });
        row.append(label, input);
        grid.appendChild(row);
    });
}

// -----------------------------------------------------------------------
// 検索 / 全展開・全折畳
// -----------------------------------------------------------------------
function applySearchFilter(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll('#cheat-category-root details, #action-category-root details').forEach(details => {
        let visibleCount = 0;
        details.querySelectorAll('[data-search-text]').forEach(el => {
            const match = !q || el.dataset.searchText.includes(q);
            el.classList.toggle('hidden-by-search', !match);
            if (match) visibleCount++;
        });
        details.classList.toggle('hidden-by-search', q !== '' && visibleCount === 0);
        if (q && visibleCount > 0) details.open = true;
    });
}

// -----------------------------------------------------------------------
// 状態受信 / 反映
// -----------------------------------------------------------------------
function renderPlayers(players) {
    latestPlayers = players || [];
    const list = $('#player-list');
    list.innerHTML = latestPlayers.map(p => `<option value="${escapeHtml(p.name)}"></option>`).join('');
    $('#player-status').textContent = latestPlayers.length
        ? latestPlayers.map(p => `${p.name}${p.self ? ' (自分)' : ''}`).join('\n')
        : '接続プレイヤー: なし';
}

function renderRestriction(restriction) {
    latestRestriction = restriction;
    $('#restriction-status').textContent = restriction && restriction.active
        ? `BAN中: ${restriction.lockedName || '?'} / 理由: ${restriction.errorCode || '-'}\n${restriction.until ? `解除: ${new Date(restriction.until).toLocaleString()}` : '無期限'}`
        : 'BAN: なし';
}

function renderControlLock(lock) {
    latestControlLock = lock;
    $('#control-status').textContent = lock && lock.active
        ? `操作ロック中\n${lock.message || ''}\n${lock.until ? `解除: ${new Date(lock.until).toLocaleString()}` : '無期限'}`
        : '操作ロック: なし';
}

function handleGameMessage(event) {
    const data = event.data;
    if (!data || data.source !== GAME_SOURCE) return;
    if (data.type === 'toggle-panel') {
        // ゲーム側(iframe内)でTabが押された時に送られてくる。iframeにフォーカスがある間は
        // 親ウィンドウのkeydownイベントが発火しないため、この通知でパネルを開閉します。
        togglePanel();
        return;
    }
    if (data.type !== 'state') return;
    if (!gameReady) {
        gameReady = true;
        setStatus('接続しました。Tabキーでパネルの開閉ができます。');
    }
    const payload = data.payload || {};
    if (payload.cheats) {
        cheatState = payload.cheats;
        refreshCheatToggleVisuals();
        renderCheatSettings();
        renderShortcuts();
    }
    if (payload.players) renderPlayers(payload.players);
    if (payload.restriction !== undefined) renderRestriction(payload.restriction);
    if (payload.controlLock !== undefined) renderControlLock(payload.controlLock);
}

// -----------------------------------------------------------------------
// パネル開閉
// -----------------------------------------------------------------------
function openPanel() {
    panelEl.classList.add('open');
    panelEl.setAttribute('aria-hidden', 'false');
    send('getState');
}
function closePanel() {
    panelEl.classList.remove('open');
    panelEl.setAttribute('aria-hidden', 'true');
}
function togglePanel() {
    if (panelEl.classList.contains('open')) closePanel();
    else openPanel();
}

window.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
        event.preventDefault();
        togglePanel();
    }
});

window.addEventListener('message', handleGameMessage);

// -----------------------------------------------------------------------
// 静的セクションの配線(相手操作 / 操作ロック / BAN)
// -----------------------------------------------------------------------
function fillTargetPieceSelect() {
    const select = $('#target-piece');
    select.innerHTML = '';
    PIECE_TYPES.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        select.appendChild(opt);
    });
}

function bindStaticControls() {
    $('#close-panel').addEventListener('click', closePanel);
    $('#close-panel-bottom').addEventListener('click', closePanel);
    $('#refresh-state').addEventListener('click', () => send('getState'));
    $('#all-cheats-off').addEventListener('click', () => {
        if (!cheatState) return;
        const off = {};
        Object.keys(CHEAT_LABELS).forEach(k => { off[k] = false; });
        pushCheats(off);
    });

    $('#cheat-search').addEventListener('input', e => applySearchFilter(e.target.value));
    $('#expand-all').addEventListener('click', () => {
        document.querySelectorAll('#cheat-category-root details, #action-category-root details').forEach(d => { d.open = true; });
    });
    $('#collapse-all').addEventListener('click', () => {
        document.querySelectorAll('#cheat-category-root details, #action-category-root details').forEach(d => { d.open = false; });
    });

    $('#clear-cheat-shortcuts').addEventListener('click', () => pushCheats({ shortcuts: {} }));

    // 相手操作(全てゲーム側の汎用 targetCommand ディスパッチャ経由。packetType は script.js の ADMIN_PACKET_TYPES と一致させています)
    $('#send-attack').addEventListener('click', () => send('sendAttack', { amount: numberValue($('#attack-lines'), 100), targetName: getTargetName() }));
    $('#target-add-garbage').addEventListener('click', () => send('targetCommand', { packetType: 'admin_add_garbage', amount: numberValue($('#target-garbage'), 30), targetName: getTargetName() }));
    $('#target-clear-board').addEventListener('click', () => send('targetCommand', { packetType: 'admin_clear_board', targetName: getTargetName() }));
    $('#target-clear-garbage').addEventListener('click', () => send('targetCommand', { packetType: 'admin_clear_garbage', targetName: getTargetName() }));
    $('#target-perfect-clear').addEventListener('click', () => send('targetCommand', { packetType: 'admin_perfect_clear_ready', targetName: getTargetName() }));
    $('#target-fill-board').addEventListener('click', () => send('targetCommand', { packetType: 'admin_fill_board', targetName: getTargetName() }));
    $('#target-random-board').addEventListener('click', () => send('targetCommand', { packetType: 'admin_random_board', targetName: getTargetName() }));
    $('#target-knockout').addEventListener('click', () => {
        if (window.confirm('対象を即座に敗北させます。よろしいですか?')) send('targetCommand', { packetType: 'admin_knockout', targetName: getTargetName() });
    });
    $('#target-set-next').addEventListener('click', () => send('targetCommand', { packetType: 'admin_set_next_piece', piece: $('#target-piece').value, targetName: getTargetName() }));
    $('#target-set-current').addEventListener('click', () => send('targetCommand', { packetType: 'admin_set_current_piece', piece: $('#target-piece').value, targetName: getTargetName() }));
    $('#target-set-hold').addEventListener('click', () => send('targetCommand', { packetType: 'admin_set_hold_piece', piece: $('#target-piece').value, targetName: getTargetName() }));
    $('#target-add-score').addEventListener('click', () => send('targetCommand', { packetType: 'admin_add_stat', stat: 'score', value: numberValue($('#target-score-amount'), 100000), targetName: getTargetName() }));
    $('#target-add-lines').addEventListener('click', () => send('targetCommand', { packetType: 'admin_add_stat', stat: 'lines', value: numberValue($('#target-lines-amount'), 40), targetName: getTargetName() }));
    $('#target-set-level').addEventListener('click', () => send('targetCommand', { packetType: 'admin_set_stat', stat: 'level', value: numberValue($('#target-level-value'), 99), targetName: getTargetName() }));

    // 操作ロック(同じく targetCommand 経由)
    $('#lock-controls').addEventListener('click', () => send('targetCommand', {
        packetType: 'admin_lock_controls',
        targetName: getTargetName(),
        durationMinutes: numberValue($('#lock-minutes'), 0),
        message: $('#lock-message').value
    }));
    $('#unlock-controls').addEventListener('click', () => send('targetCommand', { packetType: 'admin_unlock_controls', targetName: getTargetName() }));

    // BAN管理(2段階確認、専用コマンド ban/unban)
    let banConfirmArmed = false;
    $('#ban-player').addEventListener('click', () => {
        const target = $('#ban-target').value.trim();
        if (!target) { window.alert('BAN対象名を入力してください。'); return; }
        if (!banConfirmArmed) {
            banConfirmArmed = true;
            setStatus(`本当に「${target}」をBANしますか? もう一度ボタンを押すと確定します。`);
            setTimeout(() => { banConfirmArmed = false; }, 5000);
            return;
        }
        banConfirmArmed = false;
        send('ban', {
            targetName: target,
            durationMinutes: numberValue($('#ban-minutes'), 0),
            errorCode: $('#ban-code').value || 'ADMIN-BAN',
            message: $('#ban-message').value
        });
    });
    $('#unban-player').addEventListener('click', () => send('unban', { targetName: $('#ban-target').value.trim() }));
    $('#clear-local-ban').addEventListener('click', () => send('clearLocalBan'));
}

// -----------------------------------------------------------------------
// 初期化
// -----------------------------------------------------------------------
function init() {
    adminSessionToken = createAdminSessionToken();
    const src = gameFrame.getAttribute('src');
    const sep = src.includes('?') ? '&' : '?';
    gameFrame.setAttribute('src', `${src}${sep}adminSession=${encodeURIComponent(adminSessionToken)}`);

    fillTargetPieceSelect();
    renderCheatCategories();
    renderActionCategories();
    renderCheatSettings();
    renderShortcuts();
    bindStaticControls();
    setStatus('ゲームを読み込み中です。Tabキーで開閉できます。');
}

document.addEventListener('DOMContentLoaded', init);
