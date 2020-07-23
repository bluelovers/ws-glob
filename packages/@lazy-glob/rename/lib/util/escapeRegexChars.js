"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegexChars = void 0;
/**
 * Perform regex character escaping on provided string.
 * @private
 * @param glob {String} String to escape
 * @return {String} String with characters properly escaped for regex.
 */
function escapeRegexChars(glob) {
    // Note: '\' must not be escaped because it's already escaped within the glob pattern.
    return glob.replace(/[-[\]{}()+.\/^$|]/g, '\\$&');
}
exports.escapeRegexChars = escapeRegexChars;
//# sourceMappingURL=escapeRegexChars.js.map