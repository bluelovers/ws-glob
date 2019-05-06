"use strict";
/**
 * Created by user on 2018/1/26/026.
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const globby = require("globby");
exports.globby = globby;
__export(require("./lib"));
const lib_1 = require("./lib");
function globbySync(patterns, options = {}) {
    {
        let ret = lib_1.getOptions(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
    }
    let ls = globby.sync(patterns, options);
    return lib_1.globToList(ls, options);
}
exports.globbySync = globbySync;
function globbyASync(patterns, options = {}) {
    {
        /*
        let ret = getOptions(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
        */
        [patterns, options] = lib_1.getOptions(patterns, options);
    }
    let ls = globby(patterns, options);
    // @ts-ignore
    let p = options.libPromise ? options.libPromise : Bluebird;
    return p.resolve(ls)
        .then(function (ls) {
        if ((!ls || !ls.length) && options.throwEmpty) {
            return Bluebird.reject(new Error(`glob matched list is empty`));
        }
        return lib_1.globToList(ls, options);
    });
}
exports.globbyASync = globbyASync;
exports.default = exports;
//# sourceMappingURL=index.js.map