"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globRenameAsync = exports.globRenameSync = exports.globRenameResult = void 0;
const tslib_1 = require("tslib");
const globRenameResult_1 = require("./lib/globRenameResult");
Object.defineProperty(exports, "globRenameResult", { enumerable: true, get: function () { return globRenameResult_1.globRenameResult; } });
const defaultRenameHandler_1 = require("./lib/defaultRenameHandler");
tslib_1.__exportStar(require("./lib/types"), exports);
function globRenameSync(searchGlobPattern, resultGlobList, options) {
    const { handler = defaultRenameHandler_1.defaultRenameHandler } = options;
    const resultList = (0, globRenameResult_1.globRenameResult)(searchGlobPattern, resultGlobList, options);
    for (const result of resultList) {
        handler(result, options);
    }
}
exports.globRenameSync = globRenameSync;
async function globRenameAsync(searchGlobPattern, resultGlobList, options) {
    const { handler = defaultRenameHandler_1.defaultRenameHandler } = options;
    const resultList = (0, globRenameResult_1.globRenameResult)(searchGlobPattern, resultGlobList, options);
    for await (const result of resultList) {
        await handler(result, options);
    }
}
exports.globRenameAsync = globRenameAsync;
exports.default = globRenameSync;
//# sourceMappingURL=index.js.map