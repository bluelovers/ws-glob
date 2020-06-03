"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTree = void 0;
/**
 * Created by user on 2018/3/29/029.
 */
// @ts-ignore
const glob_tree_list_1 = require("glob-tree-list");
const util_1 = require("glob-tree-list/lib/util");
const sort_1 = require("./sort");
const helper_1 = require("./helper");
function sortTree(ls, sortFn = sort_1.defaultSortCallback, options = {}) {
    let padNum = options.padNum || 5;
    if (sortFn == null) {
        sortFn = sort_1.defaultSortCallback;
    }
    // @ts-ignore
    let t = glob_tree_list_1.globToTree(ls);
    let _cache = {};
    let t2 = util_1.sort(t, function (a, b, cache) {
        return sortFn(_c(a, cache), _c(b, cache));
    });
    function _c(k, cache) {
        cache = _cache;
        if (k in cache) {
            return cache[k];
        }
        cache[k] = helper_1.normalize_val(k, padNum, options);
        _cache = cache;
        return cache[k];
    }
    return glob_tree_list_1.treeToGlob(t2);
}
exports.sortTree = sortTree;
/*
let data = `00020_1章.txt
00020_2章/
00020_3章/
00020_3章/3章 8話.txt
00020_3章/3章 10話.txt
00020_3章/3章 11話.txt
00020_3章/3章 12話.txt
00020_3章/3章 13話.txt
00020_3章/3章 9話/3章 9話file.txt
00020_3章/3章 14話.txt
00020_3章/3章 15.5話 特別閑話.txt
00020_3章/3章 16話.txt
00020_3章/3章 15話.txt
00020_3章/3章 17話.txt`.split("\n");

console.log(sortTree(data));
*/
//# sourceMappingURL=glob-sort.js.map