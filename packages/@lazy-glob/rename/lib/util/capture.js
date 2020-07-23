"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * For each string in names array, return a globGroupsCollection (an object implementing globGroupsCollectionInterface) containing the substring matched by each part of the glob pattern.
 * Example of parts of a glob: "?omer.*" => Parts: ["?"] ["omer."] ["*"]
 * @method capture
 * @param names {String[]} List of names
 * @param glob {String} The glob pattern to be applied to names
 * @return {globGroupsCollection[] | null} An array of globGroupsCollection objects. Returns null if invalid parameters or names list is empty.
 */
const globGroupsCollection_1 = require("./globGroupsCollection");
function capture(names, glob) {
    if (!Array.isArray(names) || !names.length) {
        return null;
    }
    if ((typeof glob !== 'string') || !glob.length) {
        return null;
    }
    // For each name received, create an object of type 'globGroupsCollection' containing the match for each part of the glob
    return names.map(function buildGlobGroupsCollection(name) {
        let groupsObj = globGroupsCollection_1.globGroupsCollectionFactory();
        groupsObj.initGroups(glob);
        groupsObj.buildGroups(name);
        return groupsObj;
    });
}
//# sourceMappingURL=capture.js.map