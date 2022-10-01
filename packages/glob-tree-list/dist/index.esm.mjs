import { SymGlobTree as e } from "@lazy-glob/util";

import { normalize as o, dirname as t, basename as r, sep as l, join as n } from "upath2";

function globToTree(n) {
  return n.reduce((function(n, u) {
    u = o(u);
    let T = t(u), c = r(u);
    const b = u.slice(-1) === l;
    if (b && (c += l), "." === T) n[c] = b ? null : c; else {
      const o = T.split(l);
      "." === o[0] && o.shift();
      let t = n;
      o.forEach((function(e) {
        t[e += l] = t[e] || {}, t = t[e];
      })), t[c] = b ? t[c] || {} : c, b && (t[c][e] = !0);
    }
    return n;
  }), {});
}

function treeToGlob(o, t = []) {
  return Object.entries(o).reduce((function(o, r) {
    if (null === r[1] || "string" == typeof r[1]) {
      const e = null === r[1] ? r[0] : r[1];
      o.push(t.length ? n(...t, e) : e);
    } else {
      const l = treeToGlob(r[1], t.concat(r[0]));
      if (r[1][e]) {
        let e = r[0];
        o.push(t.length ? n(...t, e) : e);
      }
      o = o.concat(l);
    }
    return o;
  }), []);
}

Object.defineProperty(globToTree, "__esModule", {
  value: !0
}), Object.defineProperty(globToTree, "globToTree", {
  value: globToTree
}), Object.defineProperty(globToTree, "treeToGlob", {
  value: treeToGlob
}), Object.defineProperty(globToTree, "default", {
  value: globToTree
});

export { globToTree as default, globToTree, treeToGlob };
//# sourceMappingURL=index.esm.mjs.map
