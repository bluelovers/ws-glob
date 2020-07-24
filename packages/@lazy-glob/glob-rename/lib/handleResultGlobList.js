"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResultGlobList = void 0;
function handleResultGlobList(resultGlobList) {
    if (!resultGlobList.length || !Array.isArray(resultGlobList)) {
        throw new TypeError(`invalid resultGlobList`);
    }
    if (resultGlobList.length === 2 && typeof resultGlobList[0] === 'string' && typeof resultGlobList[1] === 'string') {
        resultGlobList = [resultGlobList];
    }
    return resultGlobList;
}
exports.handleResultGlobList = handleResultGlobList;
//# sourceMappingURL=handleResultGlobList.js.map