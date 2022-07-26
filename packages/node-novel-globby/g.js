"use strict";
/**
 * Created by user on 2018/2/12/012.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = exports.async = exports.globbySync = exports.globbyASync = exports.globby = void 0;
const tslib_1 = require("tslib");
const index_1 = tslib_1.__importDefault(require("./index"));
const globby_1 = tslib_1.__importDefault(require("globby"));
exports.globby = globby_1.default;
tslib_1.__exportStar(require("./index"), exports);
tslib_1.__exportStar(require("./lib"), exports);
const index_2 = require("./lib/index");
const types_1 = require("./lib/types");
function globbyASync(patterns, options = {}) {
    [patterns, options] = (0, index_2.getOptions)(patterns, options);
    return index_1.default.globbyASync(patterns, options)
        .then(function (ls) {
        return (0, types_1.returnGlobList)(ls, options);
    });
}
exports.globbyASync = globbyASync;
(function (globbyASync) {
    function sync(patterns, options = {}) {
        [patterns, options] = (0, index_2.getOptions)(patterns, options);
        return (0, types_1.returnGlobList)(index_1.default.globbySync(patterns, options), options);
    }
    globbyASync.sync = sync;
})(globbyASync = exports.globbyASync || (exports.globbyASync = {}));
exports.globbySync = globbyASync.sync;
globbyASync.async = globbyASync;
exports.async = globbyASync;
exports.sync = globbyASync.sync;
exports.default = globbyASync;
//# sourceMappingURL=g.js.map