/**
 * Perform regex character escaping on provided string.
 * @private
 * @param glob {String} String to escape
 * @return {String} String with characters properly escaped for regex.
 */
export function escapeRegexChars(glob: string) {
	// Note: '\' must not be escaped because it's already escaped within the glob pattern.
	return glob.replace(/[-[\]{}()+.\/^$|]/g, '\\$&');
}
