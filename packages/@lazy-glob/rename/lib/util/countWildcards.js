"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countWildcards = void 0;
function countWildcards(arr) {
    const numStars = arr.filter((str) => str === '*').length;
    const numQuestions = arr.filter((str) => str === '?').length;
    return Object.freeze({
        stars: numStars,
        questions: numQuestions,
    });
}
exports.countWildcards = countWildcards;
//# sourceMappingURL=countWildcards.js.map