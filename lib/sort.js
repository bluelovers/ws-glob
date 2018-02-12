"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function defaultSortCallback(a, b) {
    let r = /^(\d+)/;
    let ta;
    let tb;
    if ((ta = r.exec(a)) && (tb = r.exec(b))) {
        let r = parseInt(ta[0]) - parseInt(tb[0]);
        if (r !== 0) {
            return r;
        }
    }
    return (a > b) ? 1 : 0;
}
exports.defaultSortCallback = defaultSortCallback;
const self = require("./sort");
exports.default = self;
