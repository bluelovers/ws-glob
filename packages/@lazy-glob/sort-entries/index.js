"use strict";
/**
 * Created by user on 2020/6/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = exports.entries_reduce = exports.entries_sort = void 0;
const string_natural_compare_1 = require("@bluelovers/string-natural-compare");
const util_1 = require("@lazy-glob/util");
function entries_sort(entries, fn = string_natural_compare_1.naturalCompare, cache = {}) {
    entries = entries.reduce(function (a, b) {
        let v = b[1];
        if (v === null || typeof v == 'string') {
            a.push(b);
        }
        else {
            let d = Object.entries(v);
            a.push([b[0], entries_sort(d, fn), v[util_1.SymGlobTree]]);
        }
        return a;
    }, []);
    entries.sort(function (a, b) {
        let r = fn(a[0], b[0], cache);
        return r;
    });
    return entries;
}
exports.entries_sort = entries_sort;
function entries_reduce(entries) {
    return entries
        .reduce(function (a, [k, v, bool]) {
        if (v === null || typeof v == 'string') {
            a[k] = v;
        }
        else {
            a[k] = entries_reduce(v);
        }
        if (bool) {
            a[k][util_1.SymGlobTree] = bool;
        }
        return a;
    }, {});
}
exports.entries_reduce = entries_reduce;
function sort(a, fn = string_natural_compare_1.naturalCompare) {
    let r = Object.entries(a);
    let a1 = entries_sort(r, fn);
    let a2 = entries_reduce(a1);
    return a2;
}
exports.sort = sort;
exports.default = sort;
//# sourceMappingURL=index.js.map