"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sort_1 = require("./sort");
exports.defaultPatternsExclude = [
    '!*.raw.*',
    '!*.new.*',
    '!*.out.*',
    '!out',
    '!raw',
    '!*_out',
    '!待修正屏蔽字.txt',
    '!英語.txt',
    '!node_modules',
    '!*.raw',
    '!~*',
    '!.*',
];
exports.defaultPatterns = [
    '**/*.txt',
    ...exports.defaultPatternsExclude,
];
exports.defaultOptions = {
    useDefaultPatternsExclude: true,
    disableAutoHandle: false,
    disableSort: false,
    throwEmpty: true,
    sortCallback: sort_1.default.defaultSortCallback,
};
function getOptions(patterns, options = {}) {
    if (!Array.isArray(patterns) && typeof patterns == 'object') {
        [patterns, options] = [undefined, patterns];
    }
    if (patterns === null || typeof patterns == 'undefined') {
        patterns = exports.defaultPatterns;
    }
    let ret = {
        patterns: patterns.slice(),
        options: Object.assign({}, exports.defaultOptions, options),
    };
    ret[Symbol.iterator] = function* () {
        yield this.patterns;
        yield this.options;
    };
    if (ret.options.useDefaultPatternsExclude) {
        ret.patterns = ret.patterns.concat(exports.defaultPatternsExclude);
    }
    ret.options.sortCallback = ret.options.sortCallback || exports.defaultOptions.sortCallback;
    return ret;
}
exports.getOptions = getOptions;
const self = require("./options");
exports.default = self;
