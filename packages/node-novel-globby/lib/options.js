"use strict";
/**
 * Created by user on 2018/3/30/030.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOptionsRuntime = exports.getOptions2 = exports.getOptions = exports.defaultOptions = exports.defaultPatterns = exports.defaultPatternsExclude = void 0;
const tslib_1 = require("tslib");
const sort_1 = require("@node-novel/sort");
tslib_1.__exportStar(require("@lazy-glob/util/lib/types/glob"), exports);
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
    if (!Array.isArray(patterns) && typeof patterns === 'object') {
        [patterns, options] = [undefined, patterns];
    }
    if (patterns === null || typeof patterns === 'undefined') {
        patterns = exports.defaultPatterns;
    }
    let ret = {
        patterns: patterns.slice(),
        options: Object.assign({}, exports.defaultOptions, options),
    };
    // @ts-ignore
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