/**
 * Created by user on 2018/3/30/030.
 */

import {
	IReturnList2,
	IReturnRow,
} from './index';
import libSort from './sort';
import Bluebird from 'bluebird';
import { IOptions as IGlobOptions } from 'glob';
import { GlobbyOptions } from 'globby';

export const defaultPatternsExclude: string[] = [
	'!*.new.*',
	'!*.out.*',
	'!*.raw',
	'!*.raw.*',
	'!*.raw/**',
	'!*_out',
	'!*out/**',
	'!.*',
	'!.*/**',
	'!node_modules',
	'!node_modules/**',
	'!out',
	'!raw',
	'!raw/**',
	'!~*',
	'!~*/**',
	'!待修正屏蔽字.txt',
	'!英語.txt',
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

export type IOptions = GlobbyOptions & {
	cwd?: string,
	absolute?: boolean,

	useDefaultPatternsExclude?: boolean,

	disableAutoHandle?: boolean,
	disableSort?: boolean,

	libPromise?: Bluebird<unknown>,

	onListRow?<T>(a: T, row: IReturnRow, options: IOptions): IReturnRow,

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

export function getOptions2(options: IOptions): IReturnOptions
export function getOptions2(patterns?: string[], options?: IOptions): IReturnOptions
export function getOptions2(patterns?, options: IOptions = {}): IReturnOptions
{
	let ret = getOptions(patterns, options)

	ret.options = getOptionsRuntime(ret.options);

	return ret;
}

export function getOptionsRuntime(options: IOptions | IReturnOptions["options"]): IReturnOptions["options"]
{
	options.sortCallback = options.sortCallback || defaultOptions.sortCallback;

	options.padNum = options.padNum || 5;
	options.cwd = options.cwd || process.cwd();

	return options;
}

export default exports as typeof import('./options');
