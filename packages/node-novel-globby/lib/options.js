"use strict";
/**
 * Created by user on 2018/3/30/030.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptionsRuntime = exports.getOptions2 = exports.getOptions = exports.defaultOptions = exports.defaultPatterns = exports.defaultPatternsExclude = void 0;
const sort_1 = require("@node-novel/sort");
__exportStar(require("@lazy-glob/util/lib/types/glob"), exports);
exports.defaultPatternsExclude = [
    '!*.new.*',
    '!*.out.*',
    '!*.raw',
    '!*.raw.*',
    '!*.raw/**',
    '!*_out',
    '!*out/**',
    '!.*',
    '!.*/**',
    '!node_modules',
    '!node_modules/**',
    '!out',
    '!raw',
    '!raw/**',
    '!~*',
    '!~*/**',
    '!待修正屏蔽字.txt',
    '!英語.txt',
];
exports.defaultPatterns = [
    '**/*.txt',
    ...exports.defaultPatternsExclude,
];
exports.defaultOptions = {
    //absolute: false,
    useDefaultPatternsExclude: true,
    disableAutoHandle: false,
    disableSort: false,
    throwEmpty: true,
    sortCallback: sort_1.defaultSortCallback,
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
function getOptions2(patterns, options = {}) {
    let ret = getOptions(patterns, options);
    ret.options = getOptionsRuntime(ret.options);
    return ret;
}
exports.getOptions2 = getOptions2;
function getOptionsRuntime(options) {
    options.sortCallback = options.sortCallback || exports.defaultOptions.sortCallback;
    options.padNum = options.padNum || 5;
    options.cwd = options.cwd || process.cwd();
    return options;
}
exports.getOptionsRuntime = getOptionsRuntime;
exports.default = exports;
//# sourceMappingURL=options.js.map