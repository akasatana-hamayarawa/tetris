const fs = require('fs');
const path = require('path');
const vm = require('vm');

function collectJavaScriptFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectJavaScriptFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
            files.push(fullPath);
        }
    }

    return files;
}

function runScriptSyntaxCheck(rootDir) {
    const scriptPaths = [
        path.join(rootDir, 'script.js'),
        ...collectJavaScriptFiles(path.join(rootDir, 'tools')),
        ...collectJavaScriptFiles(path.join(rootDir, 'チート'))
    ];
    const failures = [];

    for (const scriptPath of scriptPaths) {
        const code = fs.readFileSync(scriptPath, 'utf8');
        try {
            new vm.Script(code, { filename: scriptPath });
        } catch (err) {
            failures.push([
                `${path.relative(rootDir, scriptPath)} failed JavaScript syntax validation.`,
                err && err.stack ? err.stack : String(err)
            ].join('\n'));
        }
    }

    return failures;
}

module.exports = {
    runScriptSyntaxCheck
};
