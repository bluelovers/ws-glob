/**
 * Builds new names based on provided glob patterns.
 * @param filenames {String[] | string} List of original names, or a single name (string), to compute new names for
 * @param srcGlob {String} Glob pattern used to match the original names
 * @param dstGlob {String} Glob pattern used to contruct new names
 * @return {String[]} List of new names. String is empty if new name could not be computed.
 * @throws {Error} An Error object
 */
export declare function computeName(filenames: string | string[], srcGlob: string, dstGlob: string): string[];
