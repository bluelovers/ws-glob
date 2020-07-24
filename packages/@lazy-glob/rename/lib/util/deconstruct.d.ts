import { IPartsPattern } from '../types';
/**
 * Returns the different parts (literals, wildcards) of a glob pattern.
 * @method deconstruct
 * @param glob {String} Glob pattern to extract the parts from
 * @param [options] {Object} options.collapse: whether consecutive * in glob pattern should collapse into a single *;
 *                                             default is false.
 * @return The parts of the glob; empty array if glob is invalid (e.g. empty string)
 *                    Example: For glob 'abc*def' -> [ 'abc', '*', 'def' ]
 */
export declare function deconstruct(glob: string, options?: {
    collapse?: boolean;
}): IPartsPattern[];
