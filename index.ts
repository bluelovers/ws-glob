/**
 * Created by user on 2018/1/26/026.
 */

import * as Promise from 'bluebird';
import * as path from 'path';
import * as globby from 'globby';
import * as StrUtil from 'str-util';
import { toCht } from 'zh2cht';

import { IOptions as IGlobOptions } from 'glob';

export interface IOptions extends IGlobOptions
{
	cwd?: string,
	absolute?: boolean,

	useDefaultPatternsExclude?: boolean,

	useAutoHandle?: boolean,
	disableSort?: boolean,

	libPromise?: Promise,
}

export const defaultPatternsExclude: string[] = [
	'!**/*.raw.*',
	'!**/*.new.*',
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
	absolute: false,
	useDefaultPatternsExclude: true,
	useAutoHandle: true,
};

export interface IReturnOptions
{
	patterns: string[];
	options: IOptions;
}

export interface IReturnRow
{
	path_source: string,
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

	let ret: IReturnOptions = {
		patterns: patterns.slice(),
		options: Object.assign({}, defaultOptions, options),
	};

	if (ret.options.useDefaultPatternsExclude)
	{
		ret.patterns = ret.patterns.concat(defaultPatternsExclude);
	}

	//console.log(ret);

	return ret;
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

	return p_sort_list(glob_to_list(ls, options), options);
}

export function globbyASync(options: IOptions): Promise<IReturnList>
export function globbyASync(patterns?: string[], options?: IOptions): Promise<IReturnList>
export function globbyASync(patterns?, options: IOptions = {}): Promise<IReturnList>
{
	{
		let ret = getOptions(patterns, options);
		[patterns, options] = [ret.patterns, ret.options];
	}

	let ls = globby(patterns, options);

	let p: Promise = options.libPromise ? options.libPromise : Promise;

	return p.resolve(ls)
		.then(function (ls)
		{
			return glob_to_list(ls, options);
		})
		.then(function (ls)
		{
			return p_sort_list(ls, options);
		})
	;
}

export interface IReturnGlobListOptions
{
	useSourcePath?: boolean,
}

export function returnGlobList(ls: IReturnList, options: IReturnGlobListOptions = {}): string[]
{
	return Object.keys(ls)
		.reduce(function (a, b)
		{
			ls[b].forEach(function (value, index, array)
			{
				a.push(options.useSourcePath ? value.path_source : value.path);
			});

			return a;
		}, [])
	;
}

export function glob_to_list(glob_ls: string[], options: IOptions = {}): IReturnList2
{
	if (!Array.isArray(glob_ls) || !glob_ls.length)
	{
		throw new Error('glob_to_list');
	}

	//console.log(glob_ls);

	return glob_ls.reduce(function (a, b)
	{
		let dir = path.dirname(b);
		let ext = path.extname(b);
		let file = path.basename(b, ext);

		//console.log(b);

		let row: IReturnRow = {
			path_source: b,

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

		if (options.useAutoHandle)
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
			else if (/^\d{4,5}_(.+)$/.exec(row.chapter_title))
			{
				row.chapter_title = RegExp.$1;
			}
			else if (/^(?:序|プロローグ)/.test(row.chapter_title))
			{
				row.chapter_title = '0_' + row.chapter_title;
			}

			r = /^第?(\d+)[話话]/;
			let s2 = StrUtil.zh2num(row.val_file) as string;

			if (r.test(s2))
			{
				row.val_file = s2.replace(r, '$1')
					.replace(/\d+/g, function ($0)
					{
						return $0.padStart(4, '0');
					})
				;
			}
			else if (/^[^\d]*\d+/.test(s2))
			{
				row.val_file = s2.replace(/\d+/g, function ($0)
				{
					return $0.padStart(4, '0');
				});
			}

			row.val_dir = StrUtil.toHalfNumber(StrUtil.zh2num(row.val_dir).toString());

			row.val_dir = row.val_dir.replace(/\d+/g, function ($0)
			{
				return $0.padStart(4, '0');
			});

			r = /^(web)版(\d+)/;
			if (r.test(row.val_file))
			{
				row.val_file = row.val_file.replace(r, '$1$2');
			}

			row.volume_title = row.volume_title.trim();
			row.chapter_title = row.chapter_title.trim();

			row.val_dir = normalize_val(row.val_dir);
			row.val_file = normalize_val(row.val_file);
		}

		a[row.val_dir] = a[row.val_dir] || {};
		a[row.val_dir][row.val_file] = row;

		return a;
	}, {});
}

export function normalize_val(str: string): string
{
	str = StrUtil.toHalfWidth(str);
	str = StrUtil.trim(str, '　');

	str = str
		.replace(/[―—一－──\-]/g, '_')
		.replace(/\s/g, '_')
	;

	str = StrUtil.zh2jp(toCht(str) as string, {
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

export default globbyASync;
//export default exports;
