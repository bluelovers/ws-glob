import { SymGlobTree as e } from "@lazy-glob/util";

import { normalize as t, dirname as o, basename as n, sep as l, join as r } from "upath2";

function globToTree(r) {
  return r.reduce((function(r, u) {
    u = t(u);
    let c = o(u), i = n(u);
    const f = u.slice(-1) === l;
    if (f && (i += l), "." === c) r[i] = f ? null : i; else {
      const t = c.split(l);
      "." === t[0] && t.shift();
      let o = r;
      t.forEach((function(e) {
        o[e += l] = o[e] || {}, o = o[e];
      })), o[i] = f ? o[i] || {} : i, f && (o[i][e] = !0);
    }
    return r;
  }), {});
}

function treeToGlob(t, o = []) {
  return Object.entries(t).reduce((function(t, n) {
    if (null === n[1] || "string" == typeof n[1]) {
      const e = null === n[1] ? n[0] : n[1];
      t.push(o.length ? r(...o, e) : e);
    } else {
      const l = treeToGlob(n[1], o.concat(n[0]));
      if (n[1][e]) {
        let e = n[0];
        t.push(o.length ? r(...o, e) : e);
      }
      t = t.concat(l);
    }
    return t;
  }), []);
}

export { globToTree as default, globToTree, treeToGlob };
//# sourceMappingURL=index.esm.mjs.map
