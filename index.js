"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const path = require("path");
const globby = require("globby");
const StrUtil = require("str-util");
const zh2cht_1 = require("zh2cht");
exports.defaultPatternsExclude = [
    '!**/*.raw.*',
    '!**/*.new.*',
    '!**/out/**/*',
    '!**/raw/**/*',
    '!**/*_out/**/*',
    '!**/待修正屏蔽字.txt',
    '!**/英語.txt',
    '!**/node_modules/**/*',
    '!**/.*/**/*',
    '!**/~*/**/*',
    '!**/~*',
    '!**/.*',
];
exports.defaultPatterns = [
    '**/*.txt',
    ...exports.defaultPatternsExclude,
];
exports.defaultOptions = {
    useDefaultPatternsExclude: true,
    disableAutoHandle: false,
};
function getOptions(patterns, options = {}) {
    if (!Array.isArray(patterns) && typeof patterns == 'object') {
        [patterns, options] = [undefined, patterns];
    }
    if (patterns === null || typeof patterns == 'undefined') {
        patterns = exports.defaultPatterns;
    }
    let ret = {
        patterns: patterns.slice(),
        options: Object.assign({}, exports.defaultOptions, options),
    };
    if (ret.options.useDefaultPatternsExclude) {
        ret.patterns = ret.patterns.concat(exports.defaultPatternsExclude);
    }
    return ret;
}
exports.getOptions = getOptions;
function globbySync(patterns, options = {}) {
    {
        let ret = getOptions(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
    }
    let ls = globby.sync(patterns, options);
    return globToList(ls, options);
}
exports.globbySync = globbySync;
function globbyASync(patterns, options = {}) {
    {
        let ret = getOptions(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
    }
    let ls = globby(patterns, options);
    let p = options.libPromise ? options.libPromise : Promise;
    return p.resolve(ls)
        .then(function (ls) {
        return globToList(ls, options);
    });
}
exports.globbyASync = globbyASync;
function globToList(glob_ls, options = {}) {
    return p_sort_list(glob_to_list(glob_ls, options), options);
}
exports.globToList = globToList;
function returnGlobList(ls, options = {}) {
    return Object.keys(ls)
        .reduce(function (a, b) {
        ls[b].forEach(function (value, index, array) {
            a.push(options.useSourcePath ? value.source_path : value.path);
        });
        return a;
    }, []);
}
exports.returnGlobList = returnGlobList;
function glob_to_list(glob_ls, options = {}) {
    if (!Array.isArray(glob_ls) || !glob_ls.length) {
        throw new Error('glob_to_list');
    }
    return glob_ls.reduce(function (a, b, source_idx) {
        let dir = path.dirname(b);
        let ext = path.extname(b);
        let file = path.basename(b, ext);
        let row = {
            source_path: b,
            source_idx,
            path: options.cwd && !path.isAbsolute(b) ? path.join(options.cwd, b) : b,
            path_dir: options.cwd && !path.isAbsolute(dir) ? path.join(options.cwd, dir) : dir,
            dir: dir,
            file: file,
            ext: ext,
            volume_title: dir.trim(),
            chapter_title: file.trim(),
            val_file: file.trim(),
            val_dir: dir.trim(),
        };
        if (!options.disableAutoHandle) {
            row.val_file = StrUtil.toHalfWidth(row.val_file);
            row.val_dir = StrUtil.toHalfWidth(row.val_dir);
            let r;
            if (/^\d+[\s_](.+)(_\(\d+\))$/.exec(row.volume_title)) {
                row.volume_title = RegExp.$1;
            }
            else if (/^\d+[\s_](.+)(_\(\d+\))?$/.exec(row.volume_title)) {
                row.volume_title = RegExp.$1;
            }
            if (/^\d+_(.+)\.\d+$/.exec(row.chapter_title)) {
                row.chapter_title = RegExp.$1;
            }
            else if (/^\d{4,}_(.+)$/.exec(row.chapter_title)) {
                row.chapter_title = RegExp.$1;
            }
            else if (/^(?:序|プロローグ)/.test(row.chapter_title)) {
                row.chapter_title = '0_' + row.chapter_title;
            }
            let s2 = StrUtil.zh2num(row.val_file);
            r = /^第?(\d+)[話话]/;
            if (r.test(s2)) {
                row.val_file = s2.replace(r, '$1')
                    .replace(/\d+/g, function ($0) {
                    return $0.padStart(4, '0');
                });
            }
            else if (/^[^\d]*\d+/.test(s2)) {
                row.val_file = s2.replace(/\d+/g, function ($0) {
                    return $0.padStart(4, '0');
                });
            }
            r = /^(web)版(\d+)/;
            if (r.test(row.val_file)) {
                row.val_file = row.val_file.replace(r, '$1$2');
            }
            row.volume_title = row.volume_title.trim();
            row.chapter_title = row.chapter_title.trim();
            row.val_dir = normalize_val(row.val_dir);
            row.val_file = normalize_val(row.val_file);
        }
        if (options.onListRow) {
            row = options.onListRow(a, row, options);
            if (!row) {
                throw new Error('onListRow');
            }
        }
        a[row.val_dir] = a[row.val_dir] || {};
        a[row.val_dir][row.val_file] = row;
        return a;
    }, {});
}
exports.glob_to_list = glob_to_list;
function normalize_val(str) {
    str = StrUtil.toHalfWidth(str);
    str = StrUtil.trim(str, '　');
    str = StrUtil.zh2num(str).toString();
    str = str.replace(/\d+/g, function ($0) {
        return $0.padStart(4, '0');
    });
    str = str
        .replace(/\./g, '_')
        .replace(/[―—一－──\-]/g, '_')
        .replace(/\s/g, '_');
    str = StrUtil.zh2jp(zh2cht_1.toCht(str), {
        safe: false,
    });
    return str;
}
exports.normalize_val = normalize_val;
function _p_sort_list1(ls, options = {}) {
    let ks = Object.keys(ls)
        .reduce(function (a, b) {
        a[StrUtil.zh2num(b)] = b;
        return a;
    }, {});
    let ks2 = Object.keys(ks);
    if (!options || !options.disableSort) {
        ks2.sort();
    }
    let ks3 = ks2.reduce(function (a, b) {
        let key = ks[b];
        a[key] = ls[key];
        return a;
    }, {});
    return ks3;
}
exports._p_sort_list1 = _p_sort_list1;
function _p_sort_list2(ls, options = {}) {
    for (let dir in ls) {
        let a = Object.keys(ls[dir]);
        if (!options || !options.disableSort) {
            a.sort();
        }
        ls[dir] = Object.values(a.reduce(function (a, b) {
            a[b] = ls[dir][b];
            return a;
        }, {}));
    }
    return ls;
}
exports._p_sort_list2 = _p_sort_list2;
function p_sort_list(ls, options = {}) {
    let ret = _p_sort_list1(ls, options);
    return _p_sort_list2(ret, options);
}
exports.p_sort_list = p_sort_list;
exports.default = globbyASync;
