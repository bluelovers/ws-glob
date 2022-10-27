"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var e = require("regexp-helper-core");

function removeDot(e) {
  return e.replace(/^\./, "");
}

function removeDotFromExtensions(e, o) {
  return e.map((e => (e = removeDot(e), null == o || o.forEach((o => {
    e = o(e);
  })), e)));
}

function extToGlob(e) {
  return `.+(${removeDotFromExtensions(e).join("|")})`;
}

exports.default = extToGlob, exports.extToGlob = extToGlob, exports.extToRegexpPattern = function extToRegexpPattern(o) {
  return `.(${removeDotFromExtensions(o, [ e.escapeRegExp ]).join("|")})$`;
}, exports.removeDot = removeDot, exports.removeDotFromExtensions = removeDotFromExtensions;
//# sourceMappingURL=index.cjs.production.min.cjs.map
