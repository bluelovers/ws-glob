"use strict";
/**
 * Created by user on 2018/3/30/030.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const naturalCompare = require("string-natural-compare");
exports.naturalCompare = naturalCompare;
function entries_sort(entries, fn = naturalCompare, cache = {}) {
    entries = entries.reduce(function (a, b) {
        if (b[1] === null || typeof b[1] == 'string') {
            a.push(b);
        }
        else {
            let d = Object.entries(b[1]);
            a.push([b[0], entries_sort(d, fn)]);
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
        .reduce(function (a, b) {
        if (b[1] === null || typeof b[1] == 'string') {
            a[b[0]] = b[1];
        }
        else {
            a[b[0]] = entries_reduce(b[1]);
        }
        return a;
    }, {});
}
exports.entries_reduce = entries_reduce;
function sort(a, fn = naturalCompare) {
    let r = Object.entries(a);
    return entries_reduce(entries_sort(r, fn));
}
exports.sort = sort;
exports.default = exports;
//# sourceMappingURL=util.js.map