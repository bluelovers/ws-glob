"use strict";
/**
 * Created by user on 2020/6/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTree = void 0;
const sort_1 = require("@node-novel/sort");
const core_1 = require("glob-tree-list/core");
const sort_entries_1 = require("@lazy-glob/sort-entries");
const normalize_1 = require("@node-novel/normalize");
function sortTree(ls, sortFn = sort_1.defaultSortCallback, options = {}) {
    let padNum = options.padNum || 5;
    if (sortFn == null) {
        sortFn = sort_1.defaultSortCallback;
    }
    let t = core_1.globToTree(ls);
    let _cache = {};
    let t2 = sort_entries_1.sort(t, function (a, b, cache) {
        return sortFn(_c(a, cache), _c(b, cache));
    });
    function _c(k, cache) {
        cache = _cache;
        if (k in cache) {
            return cache[k];
        }
        cache[k] = normalize_1.normalize_val(k, padNum, options);
        _cache = cache;
        return cache[k];
    }
    return core_1.treeToGlob(t2);
}
exports.sortTree = sortTree;
exports.default = sortTree;
//# sourceMappingURL=index.js.map