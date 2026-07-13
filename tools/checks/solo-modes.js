const fs = require('fs');
const path = require('path');

function extractSoloMenuModeIds(indexHtml) {
    const ids = new Set();
    const modeCallPattern = /startSoloMode\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = modeCallPattern.exec(indexHtml))) {
        ids.add(match[1]);
    }
    return ids;
}

function extractSoloModeDefBlock(scriptJs) {
    const startToken = 'const SOLO_MODE_DEFS = {';
    const start = scriptJs.indexOf(startToken);
    if (start === -1) {
        throw new Error('SOLO_MODE_DEFS was not found in script.js');
    }

    let depth = 0;
    for (let i = start + 'const SOLO_MODE_DEFS = '.length; i < scriptJs.length; i++) {
        const char = scriptJs[i];
        if (char === '{') depth++;
        if (char === '}') depth--;
        if (depth === 0) {
            return scriptJs.slice(start, i + 1);
        }
    }

    throw new Error('SOLO_MODE_DEFS block did not close correctly');
}

function extractSoloModeDefIds(scriptJs) {
    const block = extractSoloModeDefBlock(scriptJs);
    const ids = new Set();
    const defPattern = /^\s{12}([a-zA-Z0-9_]+):\s*\{/gm;
    let match;
    while ((match = defPattern.exec(block))) {
        ids.add(match[1]);
    }
    return ids;
}

function runSoloModeChecks(rootDir) {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    const scriptJs = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf8');

    const menuIds = extractSoloMenuModeIds(indexHtml);
    const defIds = extractSoloModeDefIds(scriptJs);
    const failures = [];

    for (const menuId of menuIds) {
        if (!defIds.has(menuId)) {
            failures.push(`Solo menu mode "${menuId}" has no matching SOLO_MODE_DEFS entry.`);
        }
    }

    for (const removedId of ['risebuild']) {
        if (menuIds.has(removedId)) failures.push(`Removed mode "${removedId}" is still visible in the solo menu.`);
        if (defIds.has(removedId)) failures.push(`Removed mode "${removedId}" is still present in SOLO_MODE_DEFS.`);
    }

    if (/RISE BUILD/i.test(indexHtml)) {
        failures.push('The label "RISE BUILD" is still present in index.html.');
    }

    return failures;
}

module.exports = {
    runSoloModeChecks
};
