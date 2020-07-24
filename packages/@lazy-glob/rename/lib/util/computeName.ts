import { deconstruct } from './deconstruct';
import { capture } from './capture';
import { countWildcards } from './countWildcards';
import { EnumWildcard, IPartsPattern } from '../types';

/**
 * Builds new names based on provided glob patterns.
 * @param filenames {String[] | string} List of original names, or a single name (string), to compute new names for
 * @param srcGlob {String} Glob pattern used to match the original names
 * @param dstGlob {String} Glob pattern used to contruct new names
 * @return {String[]} List of new names. String is empty if new name could not be computed.
 * @throws {Error} An Error object
 */
export function computeName(filenames: string | string[], srcGlob: string, dstGlob: string)
{
	if ((typeof srcGlob !== 'string' || !srcGlob) || (typeof dstGlob !== 'string' || !dstGlob))
	{
		throw new TypeError('Invalid type for glob pattern! Must be a non-empty string.');
	}
	if (typeof filenames === 'string')
	{
		filenames = [filenames];
	}
	else
	{
		if (Array.isArray(filenames))
		{
			if (!filenames.length)
			{
				throw new TypeError('Invalid names list. Array must be non-empty.');
			}
		} // names is not an array, nor a string
		else
		{
			throw new TypeError('Invalid type for names! Must be a string or an Array of string.');
		}
	}

	// Deconstruct the source glob into literal and wildcard parts
	let srcGlobParts: IPartsPattern[] = deconstruct(srcGlob, { collapse: true });
	if (!srcGlobParts.length)
	{
		throw new Error('Unexpected error while parsing glob.');
	}

	// Deconstruct the destination glob into literal and wildcard parts
	let dstGlobParts: IPartsPattern[] = deconstruct(dstGlob, { collapse: false });
	if (!dstGlobParts.length)
	{
		throw new Error('Unexpected error while parsing glob.');
	}

	let srcWildcardsCount = countWildcards(srcGlobParts);
	let dstWildcardsCount = countWildcards(dstGlobParts);

	// Check if destination glob has more * and/or ? wildcards than source glob does...
	if ((dstWildcardsCount.stars > srcWildcardsCount.stars) || (dstWildcardsCount.questions > srcWildcardsCount.questions))
	{
		throw new Error('Invalid glob pattern. Destination glob contains incorrect number or type of wildcard. (** is treated as * in source glob.)');
	}

	// extract matches for each wildcard (and literal) parts of the source glob
	let srcCaptureGroupsArray = capture(filenames, srcGlob);
	if (!srcCaptureGroupsArray)
	{
		throw new Error('Unexpected error while extracting glob matches.');
	}

	let computedNames = filenames.map(function buildNewName(name, nameIdx)
	{
		// The source glob is required to match the original name in order to proceed building the new name
		if (!srcCaptureGroupsArray[nameIdx].hasMatch())
		{
			return '';
		}

		let newName = '';
		let srcAsteriskList = srcCaptureGroupsArray[nameIdx].getAsterisk();
		let srcAsteriskIterator = srcAsteriskList?.length ? srcAsteriskList.entries() : null;
		let srcQuestionMarkList = srcCaptureGroupsArray[nameIdx].getQuestionMark();
		let srcQuestionMarkIterator = srcQuestionMarkList?.length
			? srcQuestionMarkList.entries()
			: null;

		// Cycle through the parts of the destination glob to build the new name
		for (const destPart of dstGlobParts)
		{
			let srcGroup;
			switch (destPart)
			{
				case EnumWildcard.Asterisk:
					srcGroup = srcAsteriskIterator.next();
					// value[0] is the key, value[1] is the value, e.g. the actual captureGroup object.
					// Append the * match to the new name construction
					newName = newName + srcGroup.value[1].match;
					break;
				case EnumWildcard.QuestionMark:
					srcGroup = srcQuestionMarkIterator.next();
					// value[0] is the key, value[1] is the value, e.g. the actual captureGroup object.
					// Appends the ? match to the new name construction
					newName = newName + srcGroup.value[1].match;
					break;
				default: // For literal parts, simply append them to new name construction
					newName = newName + destPart;
			}
		}
		return newName;
	});

	return computedNames;
}
