/**
 * Created by user on 2018/1/26/026.
 */

import * as Promise from 'bluebird';
import * as path from 'path';
import * as globby from 'globby';
import * as StrUtil from 'str-util';
import { cn2tw, tw2cn } from 'chinese_convert';

import { IOptions as IGlobOptions } from 'glob';

export { globby }

export interface IOptions extends IGlobOptions
{
	cwd?: string,
	absolute?: boolean,

	useDefaultPatternsExclude?: boolean,

	disableAutoHandle?: boolean,
	disableSort?: boolean,

	libPromise?: Promise,

	onListRow?: (a: IReturnList2, row: IReturnRow, options: IOptions) => IReturnRow,

	throwEmpty?: boolean,
}

export const defaultPatternsExclude: string[] = [
	'!**/*.raw.*',
	'!**/*.new.*',
	'!**/*.out.*',
	'!**/out/**/*',
	'!**/raw/**/*',
	'!**/*_out/**/*',
	'!**/待修正屏蔽字.txt',
	'!**/英語.txt',
	'!**/node_modules/**/*',
	'!**/.*/**/*',
	'!**/~*/**/*',
	'!**/~*',
	'!**/.*',
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
};

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

export interface IReturnRow
{
	source_idx: number,
	source_path: string,
	path: string,
	path_dir: string,
	dir: string,
	file: string,
	ext: string,
	volume_title: string,
	chapter_title: string,
	val_file: string,
	val_dir: string,
}

export interface IReturnList
{
	[key: string]: IReturnRow[],
}

export interface IReturnList2
{
	[key: string]: {
		[key: string]: IReturnRow,
	},
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

	return ret as IReturnOptions;
}

export function globbySync(options: IOptions): IReturnList
export function globbySync(patterns?: string[], options?: IOptions): IReturnList
export function globbySync(patterns?, options: IOptions = {}): IReturnList
{
	{
		let ret = getOptions(patterns, options);
		[patterns, options] = [ret.patterns, ret.options];
	}

	let ls = globby.sync(patterns, options);

	return globToList(ls, options);
}

export function globbyASync(options: IOptions): Promise<IReturnList>
export function globbyASync(patterns?: string[], options?: IOptions): Promise<IReturnList>
export function globbyASync(patterns?, options: IOptions = {}): Promise<IReturnList>
{
	{
		let ret = getOptions(patterns, options);
		[patterns, options] = [ret.patterns, ret.options];

		[patterns, options] = getOptions(patterns, options);
	}

	let ls = globby(patterns, options);

	let p: Promise = options.libPromise ? options.libPromise : Promise;

	return p.resolve(ls)
		.then(function (ls)
		{
			if ((!ls || !ls.length) && options.throwEmpty)
			{
				return Promise.reject(new Error(`glob matched list is empty`));
			}

			return globToList(ls, options);
		})
		;
}

export function globToList(glob_ls: string[], options: IOptions = {}): IReturnList
{
	if (!Array.isArray(glob_ls) || !glob_ls.length)
	{
		if (options.throwEmpty)
		{
			throw new Error(`glob matched list is empty`);
		}

		return null;
	}

	return p_sort_list(glob_to_list(glob_ls, options), options);
}

export interface IReturnGlobListOptions
{
	useSourcePath?: boolean,
}

export function returnGlobList(ls: IReturnList, options: IReturnGlobListOptions = {}): string[]
{
	return Object.keys(ls)
		.reduce(function (a: string[], b)
		{
			ls[b].forEach(function (value, index, array)
			{
				a.push(options.useSourcePath ? value.source_path : value.path);
			});

			return a;
		}, [])
		;
}

export function glob_to_list(glob_ls: string[], options: IOptions = {}): IReturnList2
{
	if (!Array.isArray(glob_ls) || !glob_ls.length)
	{
		throw new Error(`glob matched list is empty`);
	}

	let padNum = 4;

	//console.log(glob_ls);

	return glob_ls.reduce(function (a: IReturnList2, b: string, source_idx: number)
	{
		let dir = path.dirname(b);
		let ext = path.extname(b);
		let file = path.basename(b, ext);

		//console.log(b);

		let row: IReturnRow = {
			source_path: b,

			source_idx,

			path: options.cwd && !path.isAbsolute(b) ? path.join(options.cwd, b) : b,
			path_dir: options.cwd && !path.isAbsolute(dir) ? path.join(options.cwd, dir) : dir,

			dir: dir,
			file: file,
			ext: ext,

			volume_title: dir.trim(),
			chapter_title: file.trim(),

			val_file: file.trim(),
			val_dir: dir.trim(),
		};

		if (!options.disableAutoHandle)
		{
			row.val_file = StrUtil.toHalfWidth(row.val_file);
			row.val_dir = StrUtil.toHalfWidth(row.val_dir);

			let r: RegExp;

			if (/^\d+[\s_](.+)(_\(\d+\))$/.exec(row.volume_title))
			{
				row.volume_title = RegExp.$1;
			}
			else if (/^\d+[\s_](.+)(_\(\d+\))?$/.exec(row.volume_title))
			{
				row.volume_title = RegExp.$1;
			}

			if (/^\d+_(.+)\.\d+$/.exec(row.chapter_title))
			{
				row.chapter_title = RegExp.$1;
			}
			else if (/^\d{4,}_(.+)$/.exec(row.chapter_title))
			{
				row.chapter_title = RegExp.$1;
			}

			if (/^(?:序|プロローグ)/.test(row.val_file))
			{
				row.val_file = '0_' + row.val_file;
			}

			let s2 = StrUtil.zh2num(row.val_file) as string;

			r = /^第?(\d+)[話话]/;
			if (r.test(s2))
			{
				row.val_file = s2.replace(r, '$1')
					.replace(/\d+/g, function ($0)
					{
						return $0.padStart(padNum, '0');
					})
				;
			}
			else if (/^[^\d]*\d+/.test(s2))
			{
				row.val_file = s2.replace(/\d+/g, function ($0)
				{
					return $0.padStart(padNum, '0');
				});
			}

			//row.val_dir = StrUtil.toHalfNumber(StrUtil.zh2num(row.val_dir).toString());

			r = /^(web)版(\d+)/;
			if (r.test(row.val_file))
			{
				row.val_file = row.val_file.replace(r, '$1$2');
			}

			row.volume_title = row.volume_title.trim();
			row.chapter_title = row.chapter_title.trim();

			row.val_dir = normalize_val(row.val_dir, padNum);
			row.val_file = normalize_val(row.val_file, padNum);
		}

		if (options.onListRow)
		{
			row = options.onListRow(a, row, options);

			if (!row)
			{
				throw new Error('onListRow');
			}
		}

		a[row.val_dir] = a[row.val_dir] || {};
		a[row.val_dir][row.val_file] = row;

		return a;
	}, {});
}

export function normalize_val(str: string, padNum: number = 4): string
{
	str = StrUtil.toHalfWidth(str);
	str = StrUtil.trim(str, '　');

	str = StrUtil.zh2num(str).toString();

	str = str.replace(/\d+/g, function ($0)
	{
		return $0.padStart(padNum, '0');
	});

	str = str
		.replace(/\./g, '_')
		.replace(/[―—一－──\-]/g, '_')
		.replace(/\s/g, '_')
	;

	str = StrUtil.zh2jp(cn2tw(str) as string, {
		safe: false,
	});

	return str;
}

export function _p_sort_list1(ls: IReturnList2, options: IOptions = {})
{
	let ks = Object.keys(ls)
		.reduce(function (a, b)
		{
			a[StrUtil.zh2num(b)] = b;

			return a;
		}, {})
	;

	let ks2 = Object.keys(ks);

	if (!options || !options.disableSort)
	{
		ks2.sort();
	}

	let ks3 = ks2.reduce(function (a, b)
	{
		let key = ks[b];

		a[key] = ls[key];

		return a;
	}, {});

	return ks3;
}

export function _p_sort_list2(ls, options: IOptions = {}): IReturnList
{
	for (let dir in ls)
	{
		let a = Object.keys(ls[dir]);

		if (!options || !options.disableSort)
		{
			a.sort();
		}

		ls[dir] = Object.values(a.reduce(function (a, b)
		{
			a[b] = ls[dir][b];

			return a;
		}, {}));
	}

	return ls;
}

export function p_sort_list(ls: IReturnList2, options: IOptions = {}): IReturnList
{
	let ret = _p_sort_list1(ls, options);

	return _p_sort_list2(ret, options);
}

import * as self from './index';

export default self;
//export default exports;
