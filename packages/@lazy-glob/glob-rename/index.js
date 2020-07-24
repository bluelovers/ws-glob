"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globRenameAsync = exports.globRenameSync = exports.globRenameResult = void 0;
const globRenameResult_1 = require("./lib/globRenameResult");
Object.defineProperty(exports, "globRenameResult", { enumerable: true, get: function () { return globRenameResult_1.globRenameResult; } });
const defaultRenameHandler_1 = require("./lib/defaultRenameHandler");
__exportStar(require("./lib/types"), exports);
function globRenameSync(searchGlobPattern, resultGlobList, options) {
    const { handler = defaultRenameHandler_1.defaultRenameHandler } = options;
    const resultList = globRenameResult_1.globRenameResult(searchGlobPattern, resultGlobList, options);
    for (const result of resultList) {
        handler(result, options);
    }
}
exports.globRenameSync = globRenameSync;
async function globRenameAsync(searchGlobPattern, resultGlobList, options) {
    const { handler = defaultRenameHandler_1.defaultRenameHandler } = options;
    const resultList = globRenameResult_1.globRenameResult(searchGlobPattern, resultGlobList, options);
    for await (const result of resultList) {
        await handler(result, options);
    }
}
exports.globRenameAsync = globRenameAsync;
exports.default = globRenameSync;
//# sourceMappingURL=index.js.map