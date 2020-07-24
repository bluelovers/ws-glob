"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globRenameResult = void 0;
const handleResultGlobList_1 = require("./handleResultGlobList");
const handleOptions_1 = require("./handleOptions");
const fast_glob_1 = __importDefault(require("@bluelovers/fast-glob"));
const globRenameResultCore_1 = require("./globRenameResultCore");
function globRenameResult(searchGlobPattern, resultGlobList, options = {}) {
    if (!searchGlobPattern.length) {
        throw new TypeError(`invalid options`);
    }
    resultGlobList = handleResultGlobList_1.handleResultGlobList(resultGlobList);
    options = handleOptions_1.handleOptions(options);
    const fileList = fast_glob_1.default.sync(searchGlobPattern, options.globOptions);
    return globRenameResultCore_1.globRenameResultCore(fileList, resultGlobList, options);
}
exports.globRenameResult = globRenameResult;
//# sourceMappingURL=globRenameResult.js.map