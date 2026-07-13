import { AdminCommand } from './AdminCommand.js';
import { buildGarbageRows, pushGarbageRows } from '../../game/systems/GarbageSystem.js';

/**
 * 具体的なAdminCommand実装のサンプル集。
 * ARCHITECTURE.md 17章で例示された `AddGarbageCommand` / `PerfectClearCommand` /
 * `KillOpponentCommand` / `PauseOpponentCommand` / `LockInputCommand` / `GiveScoreCommand`
 * に対応するものを含みます。
 *
 * `execute(context)` の `context` には `{ board, payload }` を渡す想定です
 * (`board`は対象の盤面インスタンス、`payload`はコマンド固有の引数)。
 *
 * @module admin/commands/coreCommands
 */

export class AddGarbageCommand extends AdminCommand {
    static id = 'addGarbage';
    static category = 'board';
    static label = { en: 'Add Garbage', ja: 'お邪魔追加' };
    static searchTerms = ['garbage', 'お邪魔', 'attack', '攻撃'];
    static dangerous = true;
    static kind = 'action';

    execute({ board, payload = {} }) {
        const amount = Math.max(1, Math.min(200, Math.floor(Number(payload.amount) || 1)));
        const rows = buildGarbageRows(amount, board.getBoardWidth());
        board.arena = pushGarbageRows(board.arena, rows);
        if (typeof board.draw === 'function') board.draw();
        return { amount };
    }
}

export class InstantWinCommand extends AdminCommand {
    static id = 'instantWin';
    static category = 'game';
    static label = { en: 'Instant Win', ja: '即勝利' };
    static searchTerms = ['win', '勝利', 'kill opponent', '相手を倒す'];
    static dangerous = true;
    static kind = 'action';

    execute({ board }) {
        if (board.opponent && typeof board.opponent.receiveGarbage === 'function') {
            board.opponent.receiveGarbage(40);
        }
        return { targeted: !!board.opponent };
    }
}

export class InstantLoseCommand extends AdminCommand {
    static id = 'instantLose';
    static category = 'game';
    static label = { en: 'Instant Lose', ja: '即敗北' };
    static searchTerms = ['lose', '敗北', 'gameover'];
    static dangerous = true;
    static kind = 'action';

    execute({ board }) {
        if (Array.isArray(board.arena)) {
            board.arena.forEach(row => { if (Array.isArray(row)) row.fill(8); });
        }
        return { triggered: true };
    }
}

export class PauseOpponentCommand extends AdminCommand {
    static id = 'pauseOpponent';
    static category = 'network';
    static label = { en: 'Pause Opponent', ja: '相手を一時停止' };
    static searchTerms = ['pause', '停止', 'freeze'];
    static kind = 'toggle';

    execute({ board, payload = {} }) {
        if (board.opponent) board.opponent.frozenByAdmin = !!payload.value;
        return { value: !!payload.value };
    }
}

export class LockInputCommand extends AdminCommand {
    static id = 'lockInput';
    static category = 'network';
    static label = { en: 'Lock Input', ja: '操作ロック' };
    static searchTerms = ['lock', 'ロック', 'input', '操作'];
    static dangerous = true;
    static kind = 'toggle';

    execute({ board, payload = {} }) {
        if (board) board.inputLockedByAdmin = !!payload.value;
        return { value: !!payload.value };
    }
}

export class GiveScoreCommand extends AdminCommand {
    static id = 'giveScore';
    static category = 'score';
    static label = { en: 'Give Score', ja: 'スコア付与' };
    static searchTerms = ['score', 'スコア', 'points'];
    static kind = 'action';

    execute({ board, payload = {} }) {
        const amount = Math.floor(Number(payload.amount) || 0);
        if (board && board.player) board.player.score = (board.player.score || 0) + amount;
        return { amount };
    }
}

export class ToggleInvincibleCommand extends AdminCommand {
    static id = 'invincible';
    static category = 'player';
    static label = { en: 'Invincible', ja: '無敵' };
    static searchTerms = ['invincible', '無敵', 'god mode'];
    static kind = 'toggle';

    execute({ board, payload = {} }) {
        if (board) board.invincibleByAdmin = !!payload.value;
        return { value: !!payload.value };
    }
}
