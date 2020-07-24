"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToRegExWithCaptureGroups = void 0;
/**
 * Convert glob into regex with capture groups.
 * Example: abc?123.*DEF --> /(abc)(.)(123\.)(.*)(DEF)/
 * @private
 * @param glob {String} The glob pattern to convert
 * @return {RegExp} Regular expression with capture groups added to the various parts
 */
const deconstruct_1 = require("./deconstruct");
const escapeRegexChars_1 = require("./escapeRegexChars");
function convertToRegExWithCaptureGroups(glob) {
    let parts = deconstruct_1.deconstruct(glob, { collapse: true });
    let partsWithCaptureGroups = parts.map(function processPart(p) {
        if (typeof p === 'string') {
            switch (p) {
                case '*':
                    return '(.*)';
                    break;
                case '?':
                    return '(.)';
                    break;
                default:
                    p = escapeRegexChars_1.escapeRegexChars(p);
                    return `(${p})`;
            }
        }
        else {
            return '';
        }
    });
    // Add regex anchors
    partsWithCaptureGroups.unshift('^');
    partsWithCaptureGroups.push('$');
    return new RegExp(partsWithCaptureGroups.join(''));
}
exports.convertToRegExWithCaptureGroups = convertToRegExWithCaptureGroups;
//# sourceMappingURL=convertToRegExWithCaptureGroups.js.map