"use strict";
/**
 * Created by user on 2020/6/9.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = exports.entries_reduce = exports.entries_sort = void 0;
const string_natural_compare_1 = __importDefault(require("@bluelovers/string-natural-compare"));
function entries_sort(entries, fn = string_natural_compare_1.default, cache = {}) {
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
function sort(a, fn = string_natural_compare_1.default) {
    let r = Object.entries(a);
    return entries_reduce(entries_sort(r, fn));
}
exports.sort = sort;
exports.default = sort;
//# sourceMappingURL=index.js.map