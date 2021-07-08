"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeName = void 0;
const deconstruct_1 = require("./deconstruct");
const capture_1 = require("./capture");
const countWildcards_1 = require("./countWildcards");
const types_1 = require("../types");
/**
 * Builds new names based on provided glob patterns.
 * @param filenames {String[] | string} List of original names, or a single name (string), to compute new names for
 * @param srcGlob {String} Glob pattern used to match the original names
 * @param dstGlob {String} Glob pattern used to contruct new names
 * @return {String[]} List of new names. String is empty if new name could not be computed.
 * @throws {Error} An Error object
 */
function computeName(filenames, srcGlob, dstGlob) {
    if ((typeof srcGlob !== 'string' || !srcGlob) || (typeof dstGlob !== 'string' || !dstGlob)) {
        throw new TypeError('Invalid type for glob pattern! Must be a non-empty string.');
    }
    if (typeof filenames === 'string') {
        filenames = [filenames];
    }
    else {
        if (Array.isArray(filenames)) {
            if (!filenames.length) {
                throw new TypeError('Invalid names list. Array must be non-empty.');
            }
        } // names is not an array, nor a string
        else {
            throw new TypeError('Invalid type for names! Must be a string or an Array of string.');
        }
    }
    // Deconstruct the source glob into literal and wildcard parts
    let srcGlobParts = (0, deconstruct_1.deconstruct)(srcGlob, { collapse: true });
    if (!srcGlobParts.length) {
        throw new Error('Unexpected error while parsing glob.');
    }
    // Deconstruct the destination glob into literal and wildcard parts
    let dstGlobParts = (0, deconstruct_1.deconstruct)(dstGlob, { collapse: false });
    if (!dstGlobParts.length) {
        throw new Error('Unexpected error while parsing glob.');
    }
    let srcWildcardsCount = (0, countWildcards_1.countWildcards)(srcGlobParts);
    let dstWildcardsCount = (0, countWildcards_1.countWildcards)(dstGlobParts);
    // Check if destination glob has more * and/or ? wildcards than source glob does...
    if ((dstWildcardsCount.stars > srcWildcardsCount.stars) || (dstWildcardsCount.questions > srcWildcardsCount.questions)) {
        throw new Error('Invalid glob pattern. Destination glob contains incorrect number or type of wildcard. (** is treated as * in source glob.)');
    }
    // extract matches for each wildcard (and literal) parts of the source glob
    let srcCaptureGroupsArray = (0, capture_1.capture)(filenames, srcGlob);
    if (!srcCaptureGroupsArray) {
        throw new Error('Unexpected error while extracting glob matches.');
    }
    let computedNames = filenames.map(function buildNewName(name, nameIdx) {
        // The source glob is required to match the original name in order to proceed building the new name
        if (!srcCaptureGroupsArray[nameIdx].hasMatch()) {
            return '';
        }
        let newName = '';
        let srcAsteriskList = srcCaptureGroupsArray[nameIdx].getAsterisk();
        let srcAsteriskIterator = (srcAsteriskList === null || srcAsteriskList === void 0 ? void 0 : srcAsteriskList.length) ? srcAsteriskList.entries() : null;
        let srcQuestionMarkList = srcCaptureGroupsArray[nameIdx].getQuestionMark();
        let srcQuestionMarkIterator = (srcQuestionMarkList === null || srcQuestionMarkList === void 0 ? void 0 : srcQuestionMarkList.length)
            ? srcQuestionMarkList.entries()
            : null;
        // Cycle through the parts of the destination glob to build the new name
        for (const destPart of dstGlobParts) {
            let srcGroup;
            switch (destPart) {
                case types_1.EnumWildcard.Asterisk:
                    srcGroup = srcAsteriskIterator.next();
                    // value[0] is the key, value[1] is the value, e.g. the actual captureGroup object.
                    // Append the * match to the new name construction
                    newName = newName + srcGroup.value[1].match;
                    break;
                case types_1.EnumWildcard.QuestionMark:
                    srcGroup = srcQuestionMarkIterator.next();
                    // value[0] is the key, value[1] is the value, e.g. the actual captureGroup object.
                    // Appends the ? match to the new name construction
                    newName = newName + srcGroup.value[1].match;
                    break;
                default: // For literal parts, simply append them to new name construction
                    newName = newName + destPart;
            }
        }
        return newName;
    });
    return computedNames;
}
exports.computeName = computeName;
//# sourceMappingURL=computeName.js.map