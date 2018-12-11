"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./index"));
__export(require("./lib"));
const index_1 = require("./index");
exports.globby = index_1.globby;
const lib_1 = require("./lib");
function globbyASync(patterns, options = {}) {
    [patterns, options] = lib_1.getOptions(patterns, options);
    return index_1.default.globbyASync(patterns, options)
        .then(function (ls) {
        return lib_1.returnGlobList(ls, options);
    });
}
exports.globbyASync = globbyASync;
(function (globbyASync) {
    function sync(patterns, options = {}) {
        [patterns, options] = lib_1.getOptions(patterns, options);
        return lib_1.returnGlobList(index_1.default.globbySync(patterns, options), options);
    }
    globbyASync.sync = sync;
})(globbyASync = exports.globbyASync || (exports.globbyASync = {}));
exports.globbySync = globbyASync.sync;
globbyASync.async = globbyASync;
exports.async = globbyASync;
exports.sync = globbyASync.sync;
exports.default = globbyASync;
