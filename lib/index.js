"use strict";
/**
 * Created by user on 2018/2/14/014.
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const path = require("upath2");
exports.path = path;
__export(require("./options"));
const options_1 = require("./options");
exports.defaultPatternsExclude = options_1.defaultPatternsExclude;
exports.getOptions = options_1.getOptions;
const libSort = require("./sort");
const helper_1 = require("./helper");
exports.normalize_val = helper_1.normalize_val;
const glob_sort_1 = require("./glob-sort");
const list_1 = require("./list");
exports.pathToListRow = list_1.pathToListRow;
const util_1 = require("./util");
exports.foreachArrayDeepAsync = util_1.foreachArrayDeepAsync;
exports.eachVolumeTitle = util_1.eachVolumeTitle;
exports.foreachArrayDeep = util_1.foreachArrayDeep;
function createGlobToType(fn) {
    return function (glob_ls, options = {}) {
        if (!Array.isArray(glob_ls) || !glob_ls.length) {
            if (options.throwEmpty) {
                throw new Error(`glob matched list is empty`);
            }
            return null;
        }
        let comp = options.sortCallback || libSort.defaultSortCallback;
        let ls = glob_sort_1.sortTree(glob_ls, comp, options);
        return fn(ls, options);
    };
}
exports.createGlobToType = createGlobToType;
exports.globToList = createGlobToType(glob_to_list);
exports.globToListArray = createGlobToType(list_1.glob_to_list_array);
exports.globToListArrayDeep = createGlobToType(list_1.glob_to_list_array_deep);
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
    /*
    return Object.keys(ls)
        .reduce(function (a: string[], b)
        {
            ls[b].forEach(function (value, index, array)
            {
                a.push(useSourcePath ? value.source_path : value.path);
            });

            return a;
        }, [])
        ;
    */
}
exports.returnGlobList = returnGlobList;
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
exports.default = exports;
//# sourceMappingURL=index.js.map