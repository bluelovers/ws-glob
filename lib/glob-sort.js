"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob_tree_list_1 = require("glob-tree-list");
const util_1 = require("glob-tree-list/lib/util");
const sort_1 = require("./sort");
const helper_1 = require("./helper");
function sortTree(ls, sortFn = sort_1.defaultSortCallback, options = {}) {
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
        cache[k] = helper_1.normalize_val(k, options.padNum, options);
        _cache = cache;
        return cache[k];
    }
    return glob_tree_list_1.treeToGlob(t2);
}
exports.sortTree = sortTree;
