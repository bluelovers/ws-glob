"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("upath2");
exports.path = path;
const libSort = require("./sort");
const helper_1 = require("./helper");
exports.normalize_val = helper_1.normalize_val;
exports.defaultPatternsExclude = [
    '!*.raw.*',
    '!*.new.*',
    '!*.out.*',
    '!out',
    '!raw',
    '!*_out',
    '!待修正屏蔽字.txt',
    '!英語.txt',
    '!node_modules',
    '!*.raw',
    '!~*',
    '!.*',
];
exports.defaultPatterns = [
    '**/*.txt',
    ...exports.defaultPatternsExclude,
];
exports.defaultOptions = {
    useDefaultPatternsExclude: true,
    disableAutoHandle: false,
    disableSort: false,
    throwEmpty: true,
    sortCallback: libSort.defaultSortCallback,
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
    ret[Symbol.iterator] = function* () {
        yield this.patterns;
        yield this.options;
    };
    if (ret.options.useDefaultPatternsExclude) {
        ret.patterns = ret.patterns.concat(exports.defaultPatternsExclude);
    }
    ret.options.sortCallback = ret.options.sortCallback || exports.defaultOptions.sortCallback;
    return ret;
}
exports.getOptions = getOptions;
function globToList(glob_ls, options = {}) {
    if (!Array.isArray(glob_ls) || !glob_ls.length) {
        if (options.throwEmpty) {
            throw new Error(`glob matched list is empty`);
        }
        return null;
    }
    return sortList2(glob_to_list(glob_ls, options), options);
}
exports.globToList = globToList;
function returnGlobList(ls, options = {}) {
    let useSourcePath = (options.useSourcePath === true || options.useSourcePath === false)
        ? options.useSourcePath
        : !options.absolute;
    if (!ls) {
        return [];
    }
    return Object.values(ls)
        .reduce(function (a, b) {
        Object.values(b)
            .forEach(function (value, index, array) {
            a.push(useSourcePath ? value.source_path : value.path);
        });
        return a;
    }, []);
}
exports.returnGlobList = returnGlobList;
function glob_to_list(glob_ls, options = {}) {
    if (!Array.isArray(glob_ls) || !glob_ls.length) {
        throw new Error(`glob matched list is empty`);
    }
    let padNum = options.padNum || 5;
    let CWD = options.cwd || process.cwd();
    return glob_ls.reduce(function (a, b, source_idx) {
        let dir = path.dirname(b);
        let ext = path.extname(b);
        let file = path.basename(b, ext);
        if (options.absolute) {
            dir = path.relative(CWD, dir);
        }
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
            row.volume_title = helper_1.normalize_strip(row.volume_title, true);
            row.chapter_title = helper_1.normalize_strip(row.chapter_title);
            row.val_dir = helper_1.normalize_val(row.val_dir, padNum, options);
            row.val_file = helper_1.normalize_val(row.val_file, padNum, options);
        }
        if (options.onListRow) {
            row = options.onListRow(a, row, options);
            if (!row) {
                throw new Error('onListRow');
            }
        }
        let key = row.val_dir + '.dir';
        a[key] = a[key] || [];
        a[key].push(row);
        return a;
    }, {});
}
exports.glob_to_list = glob_to_list;
function p_sort_list(ls, options = {}) {
    return sortList2(ls, options);
}
exports.p_sort_list = p_sort_list;
function sortList2(ls, options = {}) {
    let comp = options.sortCallback || libSort.defaultSortCallback;
    let ls2 = Object.entries(ls);
    if (options && options.sortFn) {
        ls2 = options.sortFn(ls2);
    }
    else if (!options || !options.disableSort) {
        ls2.sort(function (a, b) {
            return comp(a[0], b[0]);
        });
    }
    return ls2
        .reduce(function (a, entries) {
        let dir;
        let ls2 = Object.values(entries[1])
            .sort(function (a, b) {
            return comp(a.val_file, b.val_file);
        });
        let ls = ls2
            .reduce(function (a, row) {
            dir = row.dir;
            a.push(row);
            return a;
        }, []);
        a[dir + '.dir'] = ls;
        return a;
    }, {});
}
exports.sortList2 = sortList2;
const self = require("./index");
exports.default = self;
