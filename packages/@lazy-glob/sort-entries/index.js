"use strict";
/**
 * Created by user on 2020/6/9.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sort = exports.entries_reduce = exports.entries_sort = void 0;
const core_1 = __importDefault(require("@bluelovers/string-natural-compare/core"));
const util_1 = require("@lazy-glob/util");
function entries_sort(entries, fn = core_1.default, cache = {}) {
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
function sort(a, fn = core_1.default) {
    let r = Object.entries(a);
    let a1 = entries_sort(r, fn);
    let a2 = entries_reduce(a1);
    return a2;
}
exports.sort = sort;
exports.default = sort;
//# sourceMappingURL=index.js.map