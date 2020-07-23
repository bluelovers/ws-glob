"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isQuestionMark = exports.isAsterisk = void 0;
const types_1 = require("../types");
function isAsterisk(g) {
    return (g.type === 'wildcard' && g.pattern === types_1.EnumWildcard.Asterisk);
}
exports.isAsterisk = isAsterisk;
function isQuestionMark(g) {
    return (g.type === 'wildcard' && g.pattern === types_1.EnumWildcard.QuestionMark);
}
exports.isQuestionMark = isQuestionMark;
//# sourceMappingURL=ast.js.map