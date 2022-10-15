'use strict';

var util = require('@lazy-glob/util');
var upath2 = require('upath2');

function globToTree(data) {
  return data.reduce(function (a, b) {
    b = upath2.normalize(b);
    let dirname = upath2.dirname(b);
    let basename = upath2.basename(b);
    const isdir = b.slice(-1) === upath2.sep;
    if (isdir) {
      basename += upath2.sep;
    }
    if (dirname === '.') {
      const f = a;
      f[basename] = isdir ? null : basename;
    } else {
      const c = dirname.split(upath2.sep);
      if (c[0] === '.') {
        c.shift();
      }
      let f = a;
      c.forEach(function (e) {
        e += upath2.sep;
        f[e] = f[e] || {};
        f = f[e];
      });
      f[basename] = isdir ? f[basename] || {} : basename;
      if (isdir) {
        f[basename][util.SymGlobTree] = true;
      }
    }
    return a;
  }, {});
}
function treeToGlob(a, d = []) {
  return Object.entries(a).reduce(function (a, b) {
    if (b[1] === null || typeof b[1] === 'string') {
      const k = b[1] === null ? b[0] : b[1];
      if (d.length) {
        a.push(upath2.join(...d, k));
      } else {
        a.push(k);
      }
    } else {
      const ls = treeToGlob(b[1], d.concat(b[0]));
      if (b[1][util.SymGlobTree]) {
        let k = b[0];
        if (d.length) {
          a.push(upath2.join(...d, k));
        } else {
          a.push(k);
        }
      }
      a = a.concat(ls);
    }
    return a;
  }, []);
}
{
  Object.defineProperty(globToTree, "__esModule", {
    value: true
  });
  Object.defineProperty(globToTree, "globToTree", {
    value: globToTree
  });
  Object.defineProperty(globToTree, "treeToGlob", {
    value: treeToGlob
  });
  Object.defineProperty(globToTree, "default", {
    value: globToTree
  });
}

// @ts-ignore
module.exports = globToTree;
//# sourceMappingURL=index.cjs.development.cjs.map
