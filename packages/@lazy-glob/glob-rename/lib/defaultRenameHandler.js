"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRenameHandler = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
function defaultRenameHandler(result, options) {
    if (result.changed === true) {
        fs_extra_1.moveSync(path_1.resolve(options.cwd, result.source), path_1.resolve(options.cwd, result.target));
    }
    else if (options.disallowResultNotChanged === true && result.changed === false) {
        throw new Error(`source filename should not same as dest filename: ${result.source}`);
    }
}
exports.defaultRenameHandler = defaultRenameHandler;
//# sourceMappingURL=defaultRenameHandler.js.map