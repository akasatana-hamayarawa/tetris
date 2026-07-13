const path = require('path');
const { runLocalCheatChecks } = require('./checks/local-cheats');
const { runScriptSyntaxCheck } = require('./checks/script-syntax');
const { runSoloModeChecks } = require('./checks/solo-modes');

const rootDir = path.resolve(__dirname, '..');

const checks = [
    ['script syntax', () => runScriptSyntaxCheck(rootDir)],
    ['local cheats', () => runLocalCheatChecks(rootDir)],
    ['solo modes', () => runSoloModeChecks(rootDir)]
];

const failures = [];

for (const [name, run] of checks) {
    try {
        const result = run();
        if (result.length) {
            failures.push(`[${name}] ${result.join('\n')}`);
        }
    } catch (err) {
        failures.push(`[${name}] ${err && err.stack ? err.stack : err}`);
    }
}

if (failures.length) {
    console.error(failures.join('\n\n'));
    process.exit(1);
}

console.log('All project checks passed.');
