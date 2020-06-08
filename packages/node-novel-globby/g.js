"use strict";
/**
 * Created by user on 2018/2/12/012.
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
exports.sync = exports.async = exports.globbySync = exports.globbyASync = exports.globby = void 0;
const index_1 = __importDefault(require("./index"));
const globby_1 = __importDefault(require("globby"));
exports.globby = globby_1.default;
__exportStar(require("./index"), exports);
__exportStar(require("./lib"), exports);
const index_2 = require("./lib/index");
const types_1 = require("./lib/types");
function globbyASync(patterns, options = {}) {
    [patterns, options] = index_2.getOptions(patterns, options);
    return index_1.default.globbyASync(patterns, options)
        .then(function (ls) {
        return types_1.returnGlobList(ls, options);
    });
}
exports.globbyASync = globbyASync;
(function (globbyASync) {
    function sync(patterns, options = {}) {
        [patterns, options] = index_2.getOptions(patterns, options);
        return types_1.returnGlobList(index_1.default.globbySync(patterns, options), options);
    }
    globbyASync.sync = sync;
})(globbyASync = exports.globbyASync || (exports.globbyASync = {}));
exports.globbySync = globbyASync.sync;
globbyASync.async = globbyASync;
exports.async = globbyASync;
exports.sync = globbyASync.sync;
exports.default = globbyASync;
//# sourceMappingURL=g.js.map