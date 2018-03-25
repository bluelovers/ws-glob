"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naturalCompare = require("string-natural-compare");
exports.naturalCompare = naturalCompare;
function defaultSortCallback(a, b, cache = {}) {
    let r = /^(\d+(?:\.\d+)?)/;
    let ta;
    let tb;
    if ((ta = r.exec(_trim(a))) && (tb = r.exec(_trim(b)))) {
        let r = parseInt(ta[0]) - parseInt(tb[0]);
        if (r !== 0) {
            return r;
        }
        let a1 = ta.input.slice(ta[0].length);
        let b1 = tb.input.slice(tb[0].length);
        while (a1[0] && a1[0] == b1[0] && (!/^\d$/.test(b1[0]))) {
            a1 = a1.slice(1);
            b1 = b1.slice(1);
        }
        return defaultSortCallback(a1, b1, cache);
    }
    return naturalCompare(a, b);
}
exports.defaultSortCallback = defaultSortCallback;
function _trim(input) {
    return input
        .replace(/^[_\s]+(\d+)/, '$1')
        .replace(/^\D(\d+)/, '$1')
        .trim();
}
const self = require("./sort");
exports.default = self;
