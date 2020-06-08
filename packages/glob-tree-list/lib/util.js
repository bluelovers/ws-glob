"use strict";
/**
 * Created by user on 2018/3/30/030.
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
exports.naturalCompare = void 0;
const core_1 = __importDefault(require("@bluelovers/string-natural-compare/core"));
exports.naturalCompare = core_1.default;
__exportStar(require("@lazy-glob/sort-entries"), exports);
exports.default = exports;
//# sourceMappingURL=util.js.map