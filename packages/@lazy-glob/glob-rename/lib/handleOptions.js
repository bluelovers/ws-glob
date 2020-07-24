"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = void 0;
function handleOptions(options = {}) {
    var _a, _b, _c;
    (_a = options.globOptions) !== null && _a !== void 0 ? _a : (options.globOptions = {});
    const cwd = (_c = (_b = options.cwd) !== null && _b !== void 0 ? _b : options.globOptions.cwd) !== null && _c !== void 0 ? _c : process.cwd();
    options.globOptions.cwd = options.cwd = cwd;
    options.pipeResult = !!options.pipeResult;
    return options;
}
exports.handleOptions = handleOptions;
//# sourceMappingURL=handleOptions.js.map