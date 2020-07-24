"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globRenameResultCore = void 0;
const rename_1 = require("@lazy-glob/rename");
function* globRenameResultCore(fileList, resultGlobList, options) {
    const { pipeResult } = options;
    for (const source of fileList) {
        let target = source;
        let changed = false;
        for (let [srcGlob, dstGlob] of resultGlobList) {
            target = rename_1.computeName(source, srcGlob, dstGlob)[0];
            if (pipeResult !== true) {
                break;
            }
        }
        changed = target !== source;
        yield {
            source,
            target,
            changed,
        };
    }
}
exports.globRenameResultCore = globRenameResultCore;
//# sourceMappingURL=globRenameResultCore.js.map