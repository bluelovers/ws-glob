"use strict";

var e = require("@lazy-glob/util"), o = require("upath2");

function globToTree(r) {
  return r.reduce((function(r, t) {
    t = o.normalize(t);
    let l = o.dirname(t), n = o.basename(t);
    const u = t.slice(-1) === o.sep;
    if (u && (n += o.sep), "." === l) r[n] = u ? null : n; else {
      const t = l.split(o.sep);
      "." === t[0] && t.shift();
      let i = r;
      t.forEach((function(e) {
        i[e += o.sep] = i[e] || {}, i = i[e];
      })), i[n] = u ? i[n] || {} : n, u && (i[n][e.SymGlobTree] = !0);
    }
    return r;
  }), {});
}

Object.defineProperty(globToTree, "__esModule", {
  value: !0
}), Object.defineProperty(globToTree, "globToTree", {
  value: globToTree
}), Object.defineProperty(globToTree, "treeToGlob", {
  value: function treeToGlob(r, t = []) {
    return Object.entries(r).reduce((function(r, l) {
      if (null === l[1] || "string" == typeof l[1]) {
        const e = null === l[1] ? l[0] : l[1];
        r.push(t.length ? o.join(...t, e) : e);
      } else {
        const n = treeToGlob(l[1], t.concat(l[0]));
        if (l[1][e.SymGlobTree]) {
          let e = l[0];
          r.push(t.length ? o.join(...t, e) : e);
        }
        r = r.concat(n);
      }
      return r;
    }), []);
  }
}), Object.defineProperty(globToTree, "default", {
  value: globToTree
}), module.exports = globToTree;
//# sourceMappingURL=index.cjs.production.min.cjs.map
