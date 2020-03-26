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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) __createBinding(exports, m, p);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = exports.async = exports.globbySync = exports.globbyASync = exports.globby = void 0;
const index_1 = __importStar(require("./index"));
Object.defineProperty(exports, "globby", { enumerable: true, get: function () { return index_1.globby; } });
const index_2 = require("./lib/index");
function globbyASync(patterns, options = {}) {
    [patterns, options] = index_2.getOptions(patterns, options);
    return index_1.default.globbyASync(patterns, options)
        .then(function (ls) {
        return index_2.returnGlobList(ls, options);
    });
}
exports.globbyASync = globbyASync;
(function (globbyASync) {
    function sync(patterns, options = {}) {
        [patterns, options] = index_2.getOptions(patterns, options);
        return index_2.returnGlobList(index_1.default.globbySync(patterns, options), options);
    }
    globbyASync.sync = sync;
})(globbyASync = exports.globbyASync || (exports.globbyASync = {}));
exports.globbySync = globbyASync.sync;
globbyASync.async = globbyASync;
exports.async = globbyASync;
exports.sync = globbyASync.sync;
exports.default = globbyASync;
__exportStar(require("./index"), exports);
__exportStar(require("./lib"), exports);
//# sourceMappingURL=g.js.map