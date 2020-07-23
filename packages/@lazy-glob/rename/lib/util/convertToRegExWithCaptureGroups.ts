/**
 * Convert glob into regex with capture groups.
 * Example: abc?123.*DEF --> /(abc)(.)(123\.)(.*)(DEF)/
 * @private
 * @param glob {String} The glob pattern to convert
 * @return {RegExp} Regular expression with capture groups added to the various parts
 */
import { deconstruct } from './deconstruct';
import { escapeRegexChars } from './escapeRegexChars';

export function convertToRegExWithCaptureGroups(glob: string) {
	let parts = deconstruct(glob, {collapse: true});

	let partsWithCaptureGroups = parts.map(function processPart(p) {
		if (typeof p === 'string') {
			switch (p) {
				case '*':
					return '(.*)';
					break;
				case '?':
					return '(.)';
					break;
				default:
					p = escapeRegexChars(p);
					return `(${p})`;
			}
		}
		else {
			return '';
		}
	});

	// Add regex anchors
	partsWithCaptureGroups.unshift('^');
	partsWithCaptureGroups.push('$');

	return new RegExp(partsWithCaptureGroups.join(''));
}
