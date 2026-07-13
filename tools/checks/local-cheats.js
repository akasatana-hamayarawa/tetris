const fs = require('fs');
const path = require('path');

function fileExists(rootDir, relativePath) {
    return fs.existsSync(path.join(rootDir, relativePath));
}

function runLocalCheatChecks(rootDir) {
    const failures = [];
    const requiredFiles = [
        'チート/admin.html',
        'チート/admin.css',
        'チート/admin.js'
    ];

    requiredFiles.forEach((relativePath) => {
        if (!fileExists(rootDir, relativePath)) failures.push(`${relativePath} is missing.`);
    });

    if (failures.length) return failures;

    const html = fs.readFileSync(path.join(rootDir, 'チート/admin.html'), 'utf8');
    const adminJs = fs.readFileSync(path.join(rootDir, 'チート/admin.js'), 'utf8');
    const scriptJs = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf8');

    if (!html.includes('src="../index.html?admin=1"')) {
        failures.push('チート/admin.html must load index.html with admin mode enabled.');
    }
    if (!html.includes('admin.css') || !html.includes('admin.js')) {
        failures.push('チート/admin.html must reference admin.css and admin.js.');
    }
    if (!adminJs.includes('Tab') || !scriptJs.includes("e.key === 'Tab'")) {
        failures.push('Admin panel must be toggled by the Tab key.');
    }
    ['invincible', 'shield', 'attackMultiplier', 'infiniteHold', 'garbageCleaner', 'nextPieceType'].forEach((key) => {
        if (!adminJs.includes(key) || !scriptJs.includes(key)) failures.push(`Admin runtime is missing "${key}".`);
    });
    ['admin_ban', 'admin_unban', 'ADMIN_RESTRICTION_STORAGE_KEY'].forEach((key) => {
        if (!scriptJs.includes(key)) failures.push(`script.js is missing admin restriction support: "${key}".`);
    });

    return failures;
}

module.exports = {
    runLocalCheatChecks
};
