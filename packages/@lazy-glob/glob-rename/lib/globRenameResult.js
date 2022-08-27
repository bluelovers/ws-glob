"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globRenameResult = void 0;
const handleResultGlobList_1 = require("./handleResultGlobList");
const handleOptions_1 = require("./handleOptions");
const fast_glob_1 = require("@bluelovers/fast-glob");
const globRenameResultCore_1 = require("./globRenameResultCore");
function globRenameResult(searchGlobPattern, resultGlobList, options = {}) {
    if (!searchGlobPattern.length) {
        throw new TypeError(`invalid options`);
    }
    resultGlobList = (0, handleResultGlobList_1.handleResultGlobList)(resultGlobList);
    options = (0, handleOptions_1.handleOptions)(options);
    const fileList = (0, fast_glob_1.sync)(searchGlobPattern, options.globOptions);
    return (0, globRenameResultCore_1.globRenameResultCore)(fileList, resultGlobList, options);
}
exports.globRenameResult = globRenameResult;
//# sourceMappingURL=globRenameResult.js.map