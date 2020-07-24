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
export function deconstruct(glob: string, options?: {
	collapse?: boolean
}): IPartsPattern[]
{
	const groups: IPartsPattern[] = [];
	// if not a string or empty string, return empty array
	if (typeof glob !== 'string' || !glob.length)
	{
		return [];
	}

	if (options?.collapse)
	{
		// Any multiple consecutive * is equivalent to a single *
		glob = glob.replace(/\*{2,}/g, '*');
	}

	let marker = glob.search(/[*|?]/g);
	while (marker !== -1)
	{
		// If marker is not at first position, everything before the marker is a group
		// Example: abc*def -> groups [abc][*][def]
		if (marker !== 0)
		{
			groups.push(glob.slice(0, marker));
		}
		// character at marker position is a group on its own
		groups.push(glob.charAt(marker));
		// Truncate the portion already processed and continue with the remainder
		glob = glob.substr(marker + 1);
		marker = glob.search(/[*|?]/g);
	}

	// Push remaining part of the glob, if not empty
	if (glob)
	{
		groups.push(glob);
	}

	return groups;
}
