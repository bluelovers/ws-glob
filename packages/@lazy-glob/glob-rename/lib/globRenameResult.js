"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globRenameResult = void 0;
const tslib_1 = require("tslib");
const handleResultGlobList_1 = require("./handleResultGlobList");
const handleOptions_1 = require("./handleOptions");
const fast_glob_1 = tslib_1.__importDefault(require("@bluelovers/fast-glob"));
const globRenameResultCore_1 = require("./globRenameResultCore");
function globRenameResult(searchGlobPattern, resultGlobList, options = {}) {
    if (!searchGlobPattern.length) {
        throw new TypeError(`invalid options`);
    }
    resultGlobList = (0, handleResultGlobList_1.handleResultGlobList)(resultGlobList);
    options = (0, handleOptions_1.handleOptions)(options);
    const fileList = fast_glob_1.default.sync(searchGlobPattern, options.globOptions);
    return (0, globRenameResultCore_1.globRenameResultCore)(fileList, resultGlobList, options);
}
exports.globRenameResult = globRenameResult;
//# sourceMappingURL=globRenameResult.js.map