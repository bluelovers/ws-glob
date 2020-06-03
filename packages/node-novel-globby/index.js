"use strict";
/**
 * Created by user on 2018/1/26/026.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globbyASync = exports.globbySync = exports.globby = void 0;
const bluebird_1 = __importDefault(require("bluebird"));
const globby_1 = __importDefault(require("globby"));
exports.globby = globby_1.default;
__exportStar(require("./lib"), exports);
const index_1 = require("./lib/index");
const options_1 = require("./lib/options");
function globbySync(patterns, options = {}) {
    {
        let ret = options_1.getOptions(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
    }
    let ls = globby_1.default.sync(patterns, options);
    return index_1.globToList(ls, options);
}
exports.globbySync = globbySync;
function globbyASync(patterns, options = {}) {
    {
        /*
        let ret = getOptions(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
        */
        [patterns, options] = options_1.getOptions(patterns, options);
    }
    let ls = globby_1.default(patterns, options);
    // @ts-ignore
    let p = options.libPromise ? options.libPromise : bluebird_1.default;
    return p.resolve(ls)
        .then(function (ls) {
        if ((!ls || !ls.length) && options.throwEmpty) {
            return bluebird_1.default.reject(new Error(`glob matched list is empty`));
        }
        return index_1.globToList(ls, options);
    });
}
exports.globbyASync = globbyASync;
exports.default = exports;
//# sourceMappingURL=index.js.map