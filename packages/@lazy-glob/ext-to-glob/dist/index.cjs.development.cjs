'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var regexpHelperCore = require('regexp-helper-core');

function removeDot(ext) {
  return ext.replace(/^\./, '');
}
function removeDotFromExtensions(arr, fns) {
  return arr.map(input => {
    input = removeDot(input);
    fns === null || fns === void 0 ? void 0 : fns.forEach(fn => {
      input = fn(input);
    });
    return input;
  });
}
function extToGlob(arr) {
  return `.+(${removeDotFromExtensions(arr).join('|')})`;
}
function extToRegexpPattern(arr) {
  return `.(${removeDotFromExtensions(arr, [regexpHelperCore.escapeRegExp]).join('|')})$`;
}

exports["default"] = extToGlob;
exports.extToGlob = extToGlob;
exports.extToRegexpPattern = extToRegexpPattern;
exports.removeDot = removeDot;
exports.removeDotFromExtensions = removeDotFromExtensions;
//# sourceMappingURL=index.cjs.development.cjs.map
