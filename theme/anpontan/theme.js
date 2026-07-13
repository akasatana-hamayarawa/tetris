'use strict';
/* =====================================================================
 * あんぽんたんテーマ 追加バリエーション選択(v2)
 * 既存の THEMES オブジェクトや updateUIFromCfg() は一切変更していません。
 * このファイルは「あんぽんたん」テーマが選ばれている時だけ、
 * 背景の雰囲気(7種類)を選べるアイコンピッカーを追加で描画します。
 * ===================================================================== */

const ANPONTAN_VARIANTS = [
    { id: 'fluffy-purple', label: '紫のふわふわ', file: 'theme/anpontan/assets/anpontan-fluffy-purple.png' },
    { id: 'circle', label: '紫の丸型', file: 'theme/anpontan/assets/anpontan-circle.png' },
    { id: 'square', label: '紫の四角型', file: 'theme/anpontan/assets/anpontan-square.png' },
    { id: 'star', label: '紫の星形', file: 'theme/anpontan/assets/anpontan-star.png' },
    { id: 'fluffy-yellow', label: '黄色', file: 'theme/anpontan/assets/anpontan-fluffy-yellow.png' },
    { id: 'rainbow', label: 'レインボー', file: 'theme/anpontan/assets/anpontan-rainbow.png' },
    { id: 'blue', label: '青色', file: 'theme/anpontan/assets/anpontan-blue.png' }
];

const ANPONTAN_VARIANT_STORAGE_KEY = 'anpontanVariant';

function getAnpontanVariant() {
    try {
        const saved = localStorage.getItem(ANPONTAN_VARIANT_STORAGE_KEY);
        return ANPONTAN_VARIANTS.find(v => v.id === saved) || ANPONTAN_VARIANTS[0];
    } catch (e) {
        return ANPONTAN_VARIANTS[0];
    }
}

function setAnpontanVariant(id) {
    try { localStorage.setItem(ANPONTAN_VARIANT_STORAGE_KEY, id); } catch (e) { /* noop */ }
    applyAnpontanBackground();
    renderAnpontanPicker();
}

function applyAnpontanBackground() {
    const variant = getAnpontanVariant();
    document.documentElement.style.setProperty('--anpontan-bg-image', `url('${variant.file}')`);
}

function ensureAnpontanMascot() {
    let mascot = document.getElementById('anpontan-mascot');
    if (!mascot) {
        mascot = document.createElement('div');
        mascot.id = 'anpontan-mascot';
        mascot.className = 'anpontan-mascot';
        mascot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(mascot);
    }
    return mascot;
}

// あんぽんたんテーマ選択中、7種類全ての画像を画面の縁にふわふわ漂わせて「かわいい」雰囲気を作ります。
function ensureAnpontanFloaters() {
    let field = document.getElementById('anpontan-floater-field');
    if (field) return field;
    field = document.createElement('div');
    field.id = 'anpontan-floater-field';
    field.className = 'anpontan-floater-field';
    field.setAttribute('aria-hidden', 'true');
    ANPONTAN_VARIANTS.forEach((variant, i) => {
        const el = document.createElement('div');
        el.className = 'anpontan-floater';
        el.style.backgroundImage = `url('${variant.file}')`;
        // 位置・速度・遅延をバリエーションごとにずらして、群れがふわふわ揺れているように見せます
        const left = (i / ANPONTAN_VARIANTS.length) * 92 + (i % 2 === 0 ? 0 : 4);
        el.style.left = `${left}%`;
        el.style.top = `${8 + (i * 11) % 78}%`;
        el.style.animationDuration = `${5 + (i % 4)}s`;
        el.style.animationDelay = `${(i * 0.6).toFixed(1)}s`;
        el.style.setProperty('--float-scale', (0.55 + (i % 3) * 0.12).toFixed(2));
        field.appendChild(el);
    });
    document.body.appendChild(field);
    return field;
}

function updateAnpontanMascotVisibility() {
    const mascot = ensureAnpontanMascot();
    const floaterField = ensureAnpontanFloaters();
    const isAnpontan = document.documentElement.dataset.theme === 'anpontan';
    mascot.style.display = isAnpontan ? 'block' : 'none';
    floaterField.style.display = isAnpontan ? 'block' : 'none';
}

function renderAnpontanPicker() {
    let container = document.getElementById('anpontan-variant-picker');
    const themeSelect = document.getElementById('theme-select');
    const isAnpontan = themeSelect && themeSelect.value === 'anpontan';

    if (!container) {
        if (!themeSelect || !themeSelect.parentElement) return;
        container = document.createElement('div');
        container.id = 'anpontan-variant-picker';
        container.className = 'anpontan-variant-picker';
        themeSelect.parentElement.insertAdjacentElement('afterend', container);
    }

    container.style.display = isAnpontan ? 'grid' : 'none';
    updateAnpontanMascotVisibility();
    if (!isAnpontan) return;

    const current = getAnpontanVariant();
    container.innerHTML = '';
    ANPONTAN_VARIANTS.forEach(variant => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'anpontan-variant-btn' + (variant.id === current.id ? ' selected' : '');
        btn.setAttribute('aria-label', variant.label);
        btn.title = variant.label;
        btn.style.backgroundImage = `url('${variant.file}')`;
        btn.addEventListener('click', () => setAnpontanVariant(variant.id));
        container.appendChild(btn);
    });
}

function initAnpontanTheme() {
    applyAnpontanBackground();
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.addEventListener('change', () => setTimeout(renderAnpontanPicker, 0));
    }
    renderAnpontanPicker();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnpontanTheme);
} else {
    initAnpontanTheme();
}
