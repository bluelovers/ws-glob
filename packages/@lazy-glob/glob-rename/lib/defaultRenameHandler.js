"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRenameHandler = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function defaultRenameHandler(result, options) {
    if (result.changed === true) {
        (0, fs_extra_1.moveSync)((0, path_1.resolve)(options.cwd, result.source), (0, path_1.resolve)(options.cwd, result.target));
    }
    else if (options.disallowResultNotChanged === true && result.changed === false) {
        throw new Error(`source filename should not same as dest filename: ${result.source}`);
    }
}
exports.defaultRenameHandler = defaultRenameHandler;
//# sourceMappingURL=defaultRenameHandler.js.map