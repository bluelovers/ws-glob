"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naturalCompare = require("string-natural-compare");
exports.naturalCompare = naturalCompare;
function defaultSortCallback(a, b, cache = {}) {
    let r = /^(\d+)/;
    let ta;
    let tb;
    if ((ta = r.exec(_trim(a))) && (tb = r.exec(_trim(b)))) {
        let r = parseInt(ta[0]) - parseInt(tb[0]);
        if (r !== 0) {
            return r;
        }
        return defaultSortCallback(ta.input.slice(ta[0].length), tb.input.slice(tb[0].length), cache);
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
