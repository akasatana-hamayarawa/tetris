/**
 * template/definitions/index.js - テンプレート定義の登録レジストリ。
 *
 * ブラウザは(サーバーやビルドツール無しでは)フォルダの中身を自動列挙できないため、
 * 完全な「ファイルを置くだけ」は実現できません。その代わり、
 * **新しいテンプレートを追加する時にやることはこの2つだけ**にしてあります:
 *   1. `template/definitions/<新しいid>.js` を、他のファイルと同じ形式で作成する
 *   2. このファイルの import 一覧へ1行追加する
 *
 * これ以外(メニューへの表示、カテゴリ分け、検索)は全て自動で反映されます。
 *
 * @module template/definitions/index
 */

import dt from './dt.js';
import tst from './tst.js';
import trsn from './trsn.js';
import nren from './nren.js';
import hren from './hren.js';
import iev from './iev.js';
import jev from './jev.js';
import lev from './lev.js';
import hachi from './hachi.js';
import meisou from './meisou.js';
import sgk2 from './sgk2.js';
import gmsr from './gmsr.js';
import pc from './pc.js';
import hpc from './hpc.js';
import gspc from './gspc.js';
import sren from './sren.js';

/**
 * 全テンプレート定義の一覧。
 * @type {Array<{id: string, category: string, name: {en: string, ja: string}, board: string[], hold: string|null, queue: string[]}>}
 */
export const ALL_TEMPLATES = [
    dt, tst, trsn, nren, hren, iev, jev, lev,
    hachi, meisou, sgk2, gmsr, pc, hpc, gspc, sren
];

/**
 * カテゴリの表示順・表示名(既存のindex.htmlのメニュー構成と同一)。
 * @type {Array<{id: string, name: {en: string, ja: string}}>}
 */
export const TEMPLATE_CATEGORIES = [
    { id: 'tspin', name: { en: 'T-spin series', ja: 'T-spin系' } },
    { id: 'ren', name: { en: 'REN series', ja: 'REN系' } },
    { id: 'elevator', name: { en: 'Elevator series', ja: 'エレベーター系' } },
    { id: 'td', name: { en: 'TD series', ja: 'TD系テンプレ' } },
    { id: 'pc', name: { en: 'PC series', ja: 'パフェ系' } },
    { id: 'other', name: { en: 'Other', ja: 'その他' } }
];
