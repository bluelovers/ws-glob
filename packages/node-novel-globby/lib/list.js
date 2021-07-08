"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathToListRow = exports.glob_to_list_array_deep = exports.glob_to_list_array = void 0;
const tslib_1 = require("tslib");
const options_1 = require("./options");
(0, tslib_1.__exportStar)(require("@lazy-glob/util/lib/types/glob"), exports);
const normalize_1 = require("@node-novel/normalize");
const util_1 = require("./util");
const upath2_1 = (0, tslib_1.__importDefault)(require("upath2"));
function glob_to_list_array(glob_ls, options = {}) {
    if (!Array.isArray(glob_ls) || !glob_ls.length) {
        throw new Error(`glob matched list is empty`);
    }
    options = (0, options_1.getOptionsRuntime)({
        ...options,
    });
    return glob_ls.reduce(function (a, b, source_idx, arr) {
        let row = pathToListRow(b, source_idx, options, arr.length);
        if (options.onListRow) {
            row = options.onListRow(a, row, options);
            if (!row) {
                throw new Error('onListRow');
            }
        }
        //let keys = row.val_dir.split('/');
        // 防止純數字的資料夾名稱導致排序失敗
        //let key = keys[0] + '.dir';
        a.push(row);
        return a;
    }, []);
}
exports.glob_to_list_array = glob_to_list_array;
function glob_to_list_array_deep(glob_ls, options = {}) {
    if (!Array.isArray(glob_ls) || !glob_ls.length) {
        throw new Error(`glob matched list is empty`);
    }
    options = (0, options_1.getOptionsRuntime)({
        ...options,
    });
    let cache = {};
    return glob_ls.reduce(function (a, b, source_idx, arr) {
        let row = pathToListRow(b, source_idx, options, arr.length);
        if (options.onListRow) {
            row = options.onListRow(a, row, options);
            if (!row) {
                throw new Error('onListRow');
            }
        }
        let keys = row.val_dir.split('/');
        if (keys.length) {
            let aa = (0, util_1.eachVolumeTitle)(keys, false).titles_full
                .reduce((aa, key) => {
                let ca = cache[key] = cache[key] || [];
                if (!aa.includes(ca)) {
                    aa.push(ca);
                }
                aa = ca;
                return aa;
            }, a);
            aa.push(row);
            /*
            let pkey: string;

            keys.forEach(function (bb, i)
            {
                let key: string;

                if (pkey == null)
                {
                    key = bb;
                }
                else
                {
                    key = pkey + bb;
                }

                key += '/';

                let ca = cache[key] = cache[key] || [];

                if (!i)
                {
                    aa = a;
                }

                if (!aa.includes(ca))
                {
                    aa.push(ca);
                }

                aa = ca;
                pkey = key;
            });

            aa.push(row);
             */
        }
        else {
            a.push(row);
        }
        return a;
    }, []);
}
exports.glob_to_list_array_deep = glob_to_list_array_deep;
function pathToListRow(b, source_idx, options = {}, source_totals) {
    options = (0, options_1.getOptionsRuntime)(options);
    const padNum = options.padNum;
    const CWD = options.cwd;
    let dir = upath2_1.default.dirname(b);
    let ext = upath2_1.default.extname(b);
    let file = upath2_1.default.basename(b, ext);
    if (options.absolute) {
        // fix bug when absolute: true
        dir = upath2_1.default.relative(CWD, dir);
    }
    //console.log(b);
    let row = {
        source_path: b,
        source_idx,
        source_totals,
        path: options.cwd && !upath2_1.default.isAbsolute(b) ? upath2_1.default.join(options.cwd, b) : b,
        path_dir: options.cwd && !upath2_1.default.isAbsolute(dir) ? upath2_1.default.join(options.cwd, dir) : dir,
        dir: dir,
        file: file,
        ext: ext,
        volume_title: dir.trim(),
        chapter_title: file.trim(),
        val_file: file.trim(),
        val_dir: dir.trim(),
    };
    if (!options.disableAutoHandle) {
        row.volume_title = (0, normalize_1.normalize_strip)(row.volume_title, true);
        row.chapter_title = (0, normalize_1.normalize_strip)(row.chapter_title);
        row.val_dir = (0, normalize_1.normalize_val)(row.val_dir, padNum, options);
        row.val_file = (0, normalize_1.normalize_val)(row.val_file, padNum, options);
    }
    return row;
}
exports.pathToListRow = pathToListRow;
exports.default = exports;
//# sourceMappingURL=list.js.map