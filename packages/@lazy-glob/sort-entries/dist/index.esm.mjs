import { naturalCompare as e } from "@bluelovers/string-natural-compare";

import { SymGlobTree as r } from "@lazy-glob/util";

function entries_sort(t, n = e, s = {}) {
  return (t = t.reduce((function(e, t) {
    const s = t[1];
    if (null === s || "string" == typeof s) e.push(t); else {
      const o = Object.entries(s);
      e.push([ t[0], entries_sort(o, n), s[r] ]);
    }
    return e;
  }), [])).sort((function(e, r) {
    return n(e[0], r[0], s);
  })), t;
}

function entries_reduce(e) {
  return e.reduce((function(e, [t, n, s]) {
    return e[t] = null === n || "string" == typeof n ? n : entries_reduce(n), s && (e[t][r] = s), 
    e;
  }), {});
}

function sort(r, t = e) {
  return entries_reduce(entries_sort(Object.entries(r), t));
}

export { sort as default, entries_reduce, entries_sort, sort };
//# sourceMappingURL=index.esm.mjs.map
