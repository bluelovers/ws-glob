"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const path = require("path");
const globby = require("globby");
const StrUtil = require("str-util");
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
    absolute: false,
    useDefaultPatternsExclude: true,
    useAutoHandle: true,
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
    return p_sort_list(glob_to_list(ls, options), options);
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
        return glob_to_list(ls, options);
    })
        .then(function (ls) {
        return p_sort_list(ls, options);
    });
}
exports.globbyASync = globbyASync;
function glob_to_list(glob_ls, options = {}) {
    if (!Array.isArray(glob_ls) || !glob_ls.length) {
        throw new Error('glob_to_list');
    }
    return glob_ls.reduce(function (a, b) {
        let dir = path.dirname(b);
        let ext = path.extname(b);
        let file = path.basename(b, ext);
        let row = {
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
        if (options.useAutoHandle) {
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
            else if (/^\d{4,5}_(.+)$/.exec(row.chapter_title)) {
                row.chapter_title = RegExp.$1;
            }
            else if (/^(?:序|プロローグ)/.test(row.chapter_title)) {
                row.chapter_title = '0_' + row.chapter_title;
            }
            r = /^第?(\d+)[話话]/;
            let s2 = StrUtil.zh2num(row.val_file);
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
            row.val_dir = StrUtil.toHalfNumber(StrUtil.zh2num(row.val_dir).toString());
            row.val_dir = row.val_dir.replace(/\d+/g, function ($0) {
                return $0.padStart(4, '0');
            });
            r = /^(web)版(\d+)/;
            if (r.test(row.val_file)) {
                row.val_file = row.val_file.replace(r, '$1$2');
            }
            row.val_file = row.val_file
                .replace(/\-/g, '_');
            row.val_dir = row.val_dir
                .replace(/\-/g, '_');
            row.volume_title = row.volume_title.trim();
            row.chapter_title = row.chapter_title.trim();
            row.val_dir = row.val_dir.trim();
            row.val_file = row.val_file.trim();
            row.val_dir = StrUtil.zh2jp(StrUtil.toHalfWidth(row.val_dir), {
                safe: false,
            });
            row.val_file = StrUtil.zh2jp(StrUtil.toHalfWidth(row.val_file), {
                safe: false,
            });
        }
        a[row.val_dir] = a[row.val_dir] || {};
        a[row.val_dir][row.val_file] = row;
        return a;
    }, {});
}
exports.glob_to_list = glob_to_list;
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
