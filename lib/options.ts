/**
 * Created by user on 2018/3/30/030.
 */

import {
	IReturnList2,
	IReturnRow,
} from './index';
import libSort from './sort';
import * as Promise from 'bluebird';
import { IOptions as IGlobOptions } from 'glob';

export const defaultPatternsExclude: string[] = [
	'!*.raw.*',
	'!*.new.*',
	'!*.out.*',
	'!out',
	'!raw',
	'!*_out',
	'!待修正屏蔽字.txt',
	'!英語.txt',
	'!node_modules',
	'!node_modules/**',
	'!*.raw',
	'!*.raw/**',
	'!~*',
	'!.*',
	'!~*/**',
	'!.*/**',
];

export const defaultPatterns: string[] = [
	'**/*.txt',
	...defaultPatternsExclude,
];

export const defaultOptions: IOptions = {
	//absolute: false,
	useDefaultPatternsExclude: true,
	disableAutoHandle: false,
	disableSort: false,

	throwEmpty: true,

	sortCallback: libSort.defaultSortCallback,
};

export type IOptions = IGlobOptions & {
	cwd?: string,
	absolute?: boolean,

	useDefaultPatternsExclude?: boolean,

	disableAutoHandle?: boolean,
	disableSort?: boolean,

	libPromise?: Promise,

	onListRow?: (a: IReturnList2, row: IReturnRow, options: IOptions) => IReturnRow,

	throwEmpty?: boolean,

	sortCallback?(a, b): number,

	sortFn?<T>(arr: T): T,

	padNum?: number,

	checkRoman?: boolean,
}

export interface IReturnOptionsArray
{
	0: string[];
	1: IOptions;
}

export interface IReturnOptionsObject
{
	patterns: string[];
	options: IOptions;
}

export interface IReturnOptions extends IReturnOptionsArray, IReturnOptionsObject
{
	[Symbol.iterator]()
}

export function getOptions(options: IOptions): IReturnOptions
export function getOptions(patterns?: string[], options?: IOptions): IReturnOptions
export function getOptions(patterns?, options: IOptions = {}): IReturnOptions
{
	if (!Array.isArray(patterns) && typeof patterns == 'object')
	{
		[patterns, options] = [undefined, patterns];
	}

	if (patterns === null || typeof patterns == 'undefined')
	{
		patterns = defaultPatterns;
	}

	let ret: IReturnOptionsObject = {
		patterns: patterns.slice(),
		options: Object.assign({}, defaultOptions, options),
	};

	ret[Symbol.iterator] = function* ()
	{
		yield this.patterns;
		yield this.options;
	};

	if (ret.options.useDefaultPatternsExclude)
	{
		ret.patterns = ret.patterns.concat(defaultPatternsExclude);
	}

	ret.options.sortCallback = ret.options.sortCallback || defaultOptions.sortCallback;

	return ret as IReturnOptions;
}

import * as self from './options';
export default self;
