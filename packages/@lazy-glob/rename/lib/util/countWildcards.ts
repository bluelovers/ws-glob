/**
 * Returns the number of elements representing * and ? wildcards.
 * @private
 * @param arr {String[]} The array to search
 * @returns {Object} stars: number of * ; questions: number of ?
 */
import { IPartsPattern } from '../types';

export function countWildcards(arr: IPartsPattern[])
{
	const numStars = arr.filter((str) => str === '*').length;
	const numQuestions = arr.filter((str) => str === '?').length;

	return Object.freeze({
		stars: numStars,
		questions: numQuestions,
	});
}
