"use strict";
/**
 * Created by user on 2018/2/14/014.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortList2 = exports.p_sort_list = exports.glob_to_list = exports.globToListArrayDeep = exports.globToListArray = exports.globToList = exports.createGlobToType = exports.pathToListRow = exports.foreachArrayDeep = exports.eachVolumeTitle = exports.foreachArrayDeepAsync = exports.normalize_val = exports.getOptions2 = exports.getOptionsRuntime = exports.getOptions = exports.defaultPatternsExclude = exports.path = void 0;
// @ts-ignore
const upath2_1 = __importDefault(require("upath2"));
exports.path = upath2_1.default;
const options_1 = require("./options");
Object.defineProperty(exports, "defaultPatternsExclude", { enumerable: true, get: function () { return options_1.defaultPatternsExclude; } });
Object.defineProperty(exports, "getOptions", { enumerable: true, get: function () { return options_1.getOptions; } });
Object.defineProperty(exports, "getOptionsRuntime", { enumerable: true, get: function () { return options_1.getOptionsRuntime; } });
Object.defineProperty(exports, "getOptions2", { enumerable: true, get: function () { return options_1.getOptions2; } });
const sort_1 = require("@node-novel/sort");
const normalize_1 = require("@node-novel/normalize");
Object.defineProperty(exports, "normalize_val", { enumerable: true, get: function () { return normalize_1.normalize_val; } });
const list_1 = require("./list");
Object.defineProperty(exports, "pathToListRow", { enumerable: true, get: function () { return list_1.pathToListRow; } });
const util_1 = require("./util");
Object.defineProperty(exports, "foreachArrayDeepAsync", { enumerable: true, get: function () { return util_1.foreachArrayDeepAsync; } });
Object.defineProperty(exports, "eachVolumeTitle", { enumerable: true, get: function () { return util_1.eachVolumeTitle; } });
Object.defineProperty(exports, "foreachArrayDeep", { enumerable: true, get: function () { return util_1.foreachArrayDeep; } });
const sort_tree_1 = __importDefault(require("@lazy-glob/sort-tree"));
__exportStar(require("./types"), exports);
__exportStar(require("@lazy-glob/util/lib/types/glob"), exports);
function createGlobToType(fn) {
    return function (glob_ls, options = {}) {
        if (!Array.isArray(glob_ls) || !glob_ls.length) {
            if (options.throwEmpty) {
                throw new Error(`glob matched list is empty`);
            }
            return null;
        }
        let comp = options.sortCallback || sort_1.defaultSortCallback;
        let ls = sort_tree_1.default(glob_ls, comp, options);
        return fn(ls, options);
    };
}
exports.createGlobToType = createGlobToType;
/**
 * @deprecated
 */
exports.globToList = createGlobToType(glob_to_list);
exports.globToListArray = createGlobToType(list_1.glob_to_list_array);
exports.globToListArrayDeep = createGlobToType(list_1.glob_to_list_array_deep);
function glob_to_list(glob_ls, options = {}) {
    if (!Array.isArray(glob_ls) || !glob_ls.length) {
        throw new Error(`glob matched list is empty`);
    }
    options = options_1.getOptionsRuntime({
        ...options,
    });
    //console.log(glob_ls);
    return glob_ls.reduce(function (a, b, source_idx) {
        let row = list_1.pathToListRow(b, source_idx, options);
        if (options.onListRow) {
            row = options.onListRow(a, row, options);
            if (!row) {
                throw new Error('onListRow');
            }
        }
        // 防止純數字的資料夾名稱導致排序失敗
        let key = row.val_dir + '.dir';
        a[key] = a[key] || [];
        a[key].push(row);
        return a;
    }, {});
}
exports.glob_to_list = glob_to_list;
/*
export function _p_sort_list1(ls: IReturnList2, options: IOptions = {})
{
    let ks = Object.keys(ls)
        .reduce(function (a, b)
        {
            a[StrUtil.zh2num(b)] = b;

            return a;
        }, {})
    ;

    let ks2 = Object.keys(ks);

    if (options && options.sortFn)
    {
        ks2 = options.sortFn(ks2);
    }
    else if (!options || !options.disableSort)
    {
        ks2.sort(options && options.sortCallback);
    }

    let ks3 = ks2.reduce(function (a, b)
    {
        let key = ks[b];

        a[key] = ls[key];

        return a;
    }, {});

    return ks3;
}

export function _p_sort_list2(ls, options: IOptions = {}): IReturnList
{
    for (let dir in ls)
    {
        let a = Object.keys(ls[dir]);

        if (options && options.sortFn)
        {
            a = options.sortFn(a);
        }
        else if (!options || !options.disableSort)
        {
            a.sort(options && options.sortCallback);
        }

        ls[dir] = Object.values(a.reduce(function (a, b)
        {
            a[b] = ls[dir][b];

            return a;
        }, {}));
    }

    return ls;
}
*/
function p_sort_list(ls, options = {}) {
    /*
    let ret = _p_sort_list1(ls, options);

    return _p_sort_list2(ret, options);
    */
    return sortList2(ls, options);
}
exports.p_sort_list = p_sort_list;
function sortList2(ls, options = {}) {
    let comp = options.sortCallback || sort_1.defaultSortCallback;
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
        /*
        .sort(function (a, b)
        {
            return comp(a[0], b[0]);
        })
        */
        .reduce(function (a, entries) {
        let dir;
        let ls2 = Object.values(entries[1])
            .sort(function (a, b) {
            //console.log(a.val_file, b.val_file);
            return comp(a.val_file, b.val_file);
        });
        //console.log(ls2);
        let ls = ls2
            .reduce(function (a, row) {
            dir = row.dir;
            //a[row.file.toString()] = row;
            a.push(row);
            return a;
        }, []);
        // 防止純數字的資料夾名稱導致排序失敗
        a[dir + '.dir'] = ls;
        return a;
    }, {});
}
exports.sortList2 = sortList2;
__exportStar(require("./options"), exports);
exports.default = exports;
//# sourceMappingURL=index.js.map