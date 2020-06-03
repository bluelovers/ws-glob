"use strict";
/**
 * Created by user on 2018/3/29/029.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const upath2_1 = require("upath2");
exports.path = upath2_1.default;
function globToTree(data) {
    return data.reduce(function (a, b) {
        b = upath2_1.default.normalize(b);
        let dirname = upath2_1.default.dirname(b);
        let basename = upath2_1.default.basename(b);
        let isdir = b.slice(-1) == upath2_1.default.sep;
        if (isdir) {
            basename += upath2_1.default.sep;
        }
        //console.log([dirname, basename]);
        if (dirname == '.') {
            let f = a;
            f[basename] = isdir ? null : basename;
        }
        else {
            let c = dirname
                .split(upath2_1.default.sep);
            if (c[0] == '.') {
                c.shift();
            }
            let f = a;
            c.forEach(function (e) {
                e += upath2_1.default.sep;
                f[e] = f[e] || {};
                f = f[e];
            });
            f[basename] = isdir ? (f[basename] || {}) : basename;
        }
        return a;
    }, {});
}
exports.globToTree = globToTree;
function treeToGlob(a, d = []) {
    return Object.entries(a).reduce(function (a, b) {
        //console.log(b);
        if (b[1] === null || typeof b[1] == 'string') {
            let k = (b[1] === null ? b[0] : b[1]);
            if (d.length) {
                // @ts-ignore
                a.push(upath2_1.default.join(...d, k));
            }
            else {
                a.push(k);
            }
        }
        else {
            // @ts-ignore
            a = a.concat(treeToGlob(b[1], d.concat(b[0])));
        }
        return a;
    }, []);
}
exports.treeToGlob = treeToGlob;
globToTree.globToTree = globToTree;
globToTree.treeToGlob = treeToGlob;
globToTree.default = globToTree;
exports.default = exports;
//# sourceMappingURL=core.js.map