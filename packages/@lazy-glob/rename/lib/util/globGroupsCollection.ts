import { deconstruct } from './deconstruct';
import { convertToRegExWithCaptureGroups } from './convertToRegExWithCaptureGroups';
import { EnumWildcard, IQuestionMark, IAsterisk, IPartsAst, IPartsPattern, EnumPartsAstType, ILiteral } from '../types';
import { isQuestionMark, isAsterisk } from './ast';

export class globGroupsCollectionInterface
{
	/**
	 * array of 'match' objects (see method buildGroups) for all groups of the glob
	 */
	_groups: (Error | IPartsAst)[]

	/**
	 * array of 'match' objects for groups representing * wildcard in the glob
	 */
	_asterisk: IAsterisk[]

	/**
	 * array of 'match' objects for groups representing ? wildcard in the glob
	 */
	_questionMark: IQuestionMark[]

	/**
	 * Produce an array of all parts of the glob pattern
	 */
	_regexWithCapture: RegExp

	_globPartsArray: IPartsPattern[]

	/**
	 * Initializes the globGroupsCollection.
	 * @method initGroups
	 * @param glob {String} Glob pattern
	 * @param [text] {String} The text to attempt to match with the glob pattern.
	 * @return {Boolean} true: init completed; false: init aborted
	 */
	initGroups(glob: string, text?: string)
	{
		if (this._groups)
		{
			// Do nothing if groups already built
			// Allowing initialization after groups have already been built would risk making
			// the internally saved regex and glob inconsistent with the groups' stored content.
			return false;
		}

		if (typeof glob !== 'string')
		{
			return false;
		}

		this._groups = null;
		this._asterisk = null;
		this._questionMark = null;
		this._regexWithCapture = convertToRegExWithCaptureGroups(glob);
		this._globPartsArray = deconstruct(glob, { collapse: true });

		if (text)
		{
			this.buildGroups(text);
		}

		return true;
	}

	/**
	 * @method getGroups
	 * @return {Object[] | null} Array of match object for each part of the glob pattern; empty if no match; null if collection not built.
	 *                           Example of match object: {type: 'literal', pattern: 'h', match: 'h'}
	 */
	getGroups(): (Error | IPartsAst)[]
	{
		return this._groups;
	}

	/**
	 * Builds an array of objects for each group (or parts) of the glob pattern.
	 * @method buildGroups
	 * @param text {String} The text to attempt to match with the glob pattern.
	 * @param [glob] {String} Glob pattern
	 * @return {Object[]} - If the glob matches the given text, then each element of the array is a 'match' object
	 *                      corresponding to each part of the glob pattern.
	 *                      Example with glob 'h*':
	 *                              match object #1: {type: 'literal', pattern: 'h', match: 'h'}
	 *                              match object #2: {type: 'wildcard', pattern: '*', match: 'omer.js'}
	 *                 - If there is no match, then array is empty;
	 *                 - If there's an error, array contains an Error object.
	 */
	buildGroups(text: string, glob?: string)
	{
		if (typeof text !== 'string')
		{
			this._groups = [new TypeError('Invalid type! Expects a string.')];
			return this._groups;
		}

		if (glob)
		{
			this.initGroups(glob);
		}

		if (!Array.isArray(this._globPartsArray) || !this._regexWithCapture)
		{
			this._groups = [new Error('Build failed! Object not initialized.')];
			return this._groups;
		}

		let matches = text.match(this._regexWithCapture);
		if (!matches)
		{
			this._groups = [];
			return this._groups;
		}

		// String.match() returns the entire match *and* the capture group matches;
		// so its array length must necessarily be > than the length of the glob parts array;
		// otherwise, we have something wrong and won't be able to proceed building the groups.
		if (matches.length <= this._globPartsArray.length)
		{
			this._groups = [new Error(`Error: length mismatch! matches: ${matches.length}, groups: ${this._globPartsArray.length}`)];
			return this._groups;
		}

		// Resets properties
		this._groups = [];
		this._questionMark = null;
		this._asterisk = null;

		// Build the groups, i.e. an array of 'match' objects.
		this._globPartsArray.forEach((g: IPartsPattern, idx) =>
		{
			// Use matches[idx + 1] because whole match is at index 0 of the array of matches
			if (g === EnumWildcard.Asterisk || g === EnumWildcard.QuestionMark)
			{
				this._groups.push(Object.freeze({
					type: EnumPartsAstType.wildcard,
					pattern: g,
					match: matches[idx + 1],
				}));
			}
			else
			{
				this._groups.push(Object.freeze({
					type: EnumPartsAstType.literal,
					pattern: g,
					match: matches[idx + 1],
				}) as ILiteral);
			}
		});

		return this._groups;
	}

	/**
	 * Whether the glob matches the text
	 * @method hasMatch
	 * @return {boolean}
	 */
	hasMatch()
	{
		return (Array.isArray(this._groups) && (this._groups.length !== 0) && !(this._groups[0] instanceof Error));
	}

	/**
	 * @method getAsterisk
	 * @return {Object[] | null} Array of match object for each wildcard '*' of the glob; empty if no match; null if collection not built.
	 *                           Example of match object: {type: 'wildcard', pattern: '*', match: 'txt'}
	 */
	getAsterisk()
	{
		// if _groups initialized (not null)
		if (this._groups !== null)
		{
			// if _asterisk not already built, then build it
			if (!Array.isArray(this._asterisk))
			{
				if (!this.hasMatch())
				{
					this._asterisk = [];
				}
				else
				{
					this._asterisk = this._groups.filter(isAsterisk);
				}
			}
			return this._asterisk;
		}
		else
		{
			return null;
		}
	}

	/**
	 * @method getQuestionMark
	 * @return {Object[] | null} Array of match object for each wildcard '?' of the glob; empty if no match; null if collection not built.
	 *                           Example of match object: {type: 'wildcard', pattern: '?', match: 'd'}
	 */
	getQuestionMark()
	{
		// if _groups initialized (not null)
		if (this._groups !== null)
		{
			// if _questionMark not already built, then built it
			if (!Array.isArray(this._questionMark))
			{
				if (!this.hasMatch())
				{
					this._questionMark = [];
				}
				else
				{
					this._questionMark = this._groups.filter(isQuestionMark);
				}
			}
			return this._questionMark;
		}
		else
		{
			return null;
		}
	}

}

/**
 * Returns a globGroupsCollection object.
 * @method _globGroupsCollectionFactory
 * @private
 * @return {globGroupsCollection} Object implementing the globGroupsCollection interface.
 */
export function globGroupsCollectionFactory()
{
	return new globGroupsCollectionInterface();
}

