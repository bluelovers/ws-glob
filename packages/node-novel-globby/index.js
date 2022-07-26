"use strict";
/**
 * Created by user on 2018/1/26/026.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.globbyASync = exports.globbySync = exports.globby = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const globby_1 = tslib_1.__importDefault(require("globby"));
exports.globby = globby_1.default;
tslib_1.__exportStar(require("./lib"), exports);
const index_1 = require("./lib/index");
const options_1 = require("./lib/options");
function globbySync(patterns, options = {}) {
    {
        let ret = (0, options_1.getOptions)(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
    }
    let ls = globby_1.default.sync(patterns, options);
    return (0, index_1.globToList)(ls, options);
}
exports.globbySync = globbySync;
function globbyASync(patterns, options = {}) {
    {
        /*
        let ret = getOptions(patterns, options);
        [patterns, options] = [ret.patterns, ret.options];
        */
        [patterns, options] = (0, options_1.getOptions)(patterns, options);
    }
    let ls = (0, globby_1.default)(patterns, options);
    // @ts-ignore
    let p = options.libPromise ? options.libPromise : bluebird_1.default;
    return p.resolve(ls)
        .then(function (ls) {
        if ((!ls || !ls.length) && options.throwEmpty) {
            return bluebird_1.default.reject(new Error(`glob matched list is empty`));
        }
        return (0, index_1.globToList)(ls, options);
    });
}
exports.globbyASync = globbyASync;
exports.default = exports;
//# sourceMappingURL=index.js.map