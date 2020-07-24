/**
 * Returns the number of elements representing * and ? wildcards.
 * @private
 * @param arr {String[]} The array to search
 * @returns {Object} stars: number of * ; questions: number of ?
 */
import { IPartsPattern } from '../types';
export declare function countWildcards(arr: IPartsPattern[]): Readonly<{
    stars: number;
    questions: number;
}>;
