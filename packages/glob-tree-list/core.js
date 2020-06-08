"use strict";
/**
 * Created by user on 2018/3/29/029.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeToGlob = exports.globToTree = exports.path = void 0;
//export * from './lib/types'
const util_1 = require("@lazy-glob/util");
__exportStar(require("@lazy-glob/util/lib/types"), exports);
const upath2_1 = __importDefault(require("upath2"));
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
            if (isdir) {
                f[basename][util_1.SymGlobTree] = true;
                //console.dir({ b, basename, f })
            }
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
            let ls = treeToGlob(b[1], d.concat(b[0]));
            if (b[1][util_1.SymGlobTree]) {
                let k = b[0];
                if (d.length) {
                    // @ts-ignore
                    a.push(upath2_1.default.join(...d, k));
                }
                else {
                    a.push(k);
                }
            }
            a = a.concat(ls);
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