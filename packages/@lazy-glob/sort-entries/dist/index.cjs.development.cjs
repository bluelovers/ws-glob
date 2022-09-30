'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stringNaturalCompare = require('@bluelovers/string-natural-compare');
var util = require('@lazy-glob/util');

function entries_sort(entries, fn = stringNaturalCompare.naturalCompare, cache = {}) {
  entries = entries.reduce(function (a, b) {
    const v = b[1];

    if (v === null || typeof v == 'string') {
      a.push(b);
    } else {
      const d = Object.entries(v);
      a.push([b[0], entries_sort(d, fn), v[util.SymGlobTree]]);
    }

    return a;
  }, []);
  entries.sort(function (a, b) {
    const r = fn(a[0], b[0], cache);
    return r;
  });
  return entries;
}
function entries_reduce(entries) {
  return entries.reduce(function (a, [k, v, bool]) {
    if (v === null || typeof v == 'string') {
      a[k] = v;
    } else {
      a[k] = entries_reduce(v);
    }

    if (bool) {
      a[k][util.SymGlobTree] = bool;
    }

    return a;
  }, {});
}
function sort(a, fn = stringNaturalCompare.naturalCompare) {
  const r = Object.entries(a);
  const a1 = entries_sort(r, fn);
  const a2 = entries_reduce(a1);
  return a2;
}

exports["default"] = sort;
exports.entries_reduce = entries_reduce;
exports.entries_sort = entries_sort;
exports.sort = sort;
//# sourceMappingURL=index.cjs.development.cjs.map
