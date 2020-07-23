import { IQuestionMark, IAsterisk, IPartsAst, IPartsPattern } from '../types';
export declare class globGroupsCollectionInterface {
    /**
     * array of 'match' objects (see method buildGroups) for all groups of the glob
     */
    _groups: (Error | IPartsAst)[];
    /**
     * array of 'match' objects for groups representing * wildcard in the glob
     */
    _asterisk: IAsterisk[];
    /**
     * array of 'match' objects for groups representing ? wildcard in the glob
     */
    _questionMark: IQuestionMark[];
    /**
     * Produce an array of all parts of the glob pattern
     */
    _regexWithCapture: RegExp;
    _globPartsArray: IPartsPattern[];
    /**
     * Initializes the globGroupsCollection.
     * @method initGroups
     * @param glob {String} Glob pattern
     * @param [text] {String} The text to attempt to match with the glob pattern.
     * @return {Boolean} true: init completed; false: init aborted
     */
    initGroups(glob: string, text?: string): boolean;
    /**
     * @method getGroups
     * @return {Object[] | null} Array of match object for each part of the glob pattern; empty if no match; null if collection not built.
     *                           Example of match object: {type: 'literal', pattern: 'h', match: 'h'}
     */
    getGroups(): (IAsterisk | IQuestionMark | import("../types").ILiteral | Error)[];
    /**
     * Builds an array of objects for each group (or parts) of the glob pattern.
     * @method buildGroups
     * @param text {String} The text to attempt to match with the glob pattern.
     * @param [glob] {String} Glob pattern
     * @return {Object[]} - If the glob matches the given text, then each element of the array is a 'match' object
     *                      corresponding to each part of the glob pattern.
     *                      Example with glob 'h*':
     *                              match object #1: {type: 'literal', pattern: 'h', match: 'h'}
     *                              match object #2: {type: 'wildcard', pattern: '*', match: 'omer.js'}
     *                 - If there is no match, then array is empty;
     *                 - If there's an error, array contains an Error object.
     */
    buildGroups(text: string, glob?: string): (IAsterisk | IQuestionMark | import("../types").ILiteral | Error)[];
    /**
     * Whether the glob matches the text
     * @method hasMatch
     * @return {boolean}
     */
    hasMatch(): boolean;
    /**
     * @method getAsterisk
     * @return {Object[] | null} Array of match object for each wildcard '*' of the glob; empty if no match; null if collection not built.
     *                           Example of match object: {type: 'wildcard', pattern: '*', match: 'txt'}
     */
    getAsterisk(): IAsterisk[];
    /**
     * @method getQuestionMark
     * @return {Object[] | null} Array of match object for each wildcard '?' of the glob; empty if no match; null if collection not built.
     *                           Example of match object: {type: 'wildcard', pattern: '?', match: 'd'}
     */
    getQuestionMark(): IQuestionMark[];
}
/**
 * Returns a globGroupsCollection object.
 * @method _globGroupsCollectionFactory
 * @private
 * @return {globGroupsCollection} Object implementing the globGroupsCollection interface.
 */
export declare function globGroupsCollectionFactory(): globGroupsCollectionInterface;
