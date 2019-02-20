/**
 * Created by user on 2018/2/14/014.
 */

import Promise = require('bluebird');
// @ts-ignore
import path = require('upath2');
export { path }

import StrUtil = require('str-util');
export * from './options';
import { IOptions, defaultPatternsExclude, getOptions } from './options';
export { IOptions, defaultPatternsExclude, getOptions }

import libSort = require('./sort');

import { normalize_strip, normalize_val } from './helper';

export { normalize_val }

import * as globby from 'globby';
import { sortTree } from './glob-sort';

import { sort as globTreeListUtilSort } from 'glob-tree-list/lib/util';

export interface IApi<T>
{
	(options: IOptions): T

	(patterns?: string[], options?: IOptions): T
}

export type IApiSync = IApi<IReturnList>;
export type IApiAsync = IApi<Promise<IReturnList>>;

export interface IApiWithReturnGlob<T>
{
	(options: IOptionsWithReturnGlobList): T

	(patterns?: string[], options?: IOptionsWithReturnGlobList): T
}

export type IApiWithReturnGlobSync = IApiWithReturnGlob<IReturnGlob>;
export type IApiWithReturnGlobAsync = IApiWithReturnGlob<Promise<IReturnGlob>>;

export type IOptionsWithReturnGlobList = IOptions & IReturnGlobListOptions;

export type IReturnGlob = string[];

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
	[index: number]: IReturnRow[],
	[key: string]: IReturnRow[],
}

export interface IReturnList2
{
	/*
	[key: string]: {
		[index: number]: IReturnRow,
		[key: string]: IReturnRow,
	},
	*/
	[key: string]: IReturnRow[],
	[index: number]: IReturnRow[],
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

	//return p_sort_list(glob_to_list(glob_ls, options), options);
//	return sortList2(glob_to_list(glob_ls, options), options);

	let comp = options.sortCallback || libSort.defaultSortCallback;

	return glob_to_list(sortTree(glob_ls, comp as any, options), options);
	//return glob_to_list(glob_ls.sort(comp), options);
}

export interface IReturnGlobListOptions
{
	useSourcePath?: boolean,
}

export function returnGlobList(ls: IReturnList, options: IReturnGlobListOptions & IOptions = {}): string[]
{
	let useSourcePath = (options.useSourcePath === true || options.useSourcePath === false)
		? options.useSourcePath
		: !options.absolute;

	if (!ls)
	{
		return [];
	}

	return Object.values(ls)
		.reduce(function (a: string[], b)
		{
			Object.values(b)
				.forEach(function (value, index, array)
				{
					a.push(useSourcePath ? value.source_path : value.path);
				})
			;

			return a;
		}, [])
		;

	/*
	return Object.keys(ls)
		.reduce(function (a: string[], b)
		{
			ls[b].forEach(function (value, index, array)
			{
				a.push(useSourcePath ? value.source_path : value.path);
			});

			return a;
		}, [])
		;
	*/
}

export function glob_to_list(glob_ls: string[], options: IOptions = {}): IReturnList2
{
	if (!Array.isArray(glob_ls) || !glob_ls.length)
	{
		throw new Error(`glob matched list is empty`);
	}

	let padNum = options.padNum || 5;

	let CWD = options.cwd || process.cwd();

	//console.log(glob_ls);

	return glob_ls.reduce(function (a: IReturnList2, b: string, source_idx: number)
	{
		let dir = path.dirname(b);
		let ext = path.extname(b);
		let file = path.basename(b, ext);

		if (options.absolute)
		{
			// fix bug when absolute: true
			dir = path.relative(CWD, dir);
		}

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
			//row.val_file = StrUtil.toHalfWidth(row.val_file);
			//row.val_dir = StrUtil.toHalfWidth(row.val_dir);

			/*

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

			*/

			/*
			if (/^(?:序|プロローグ)/.test(row.val_file))
			{
				row.val_file = '0_' + row.val_file;
			}

			let s2 = StrUtil.zh2num(row.val_file).toString();

			r = /^第?(\d+)[話话章卷]/;
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
			*/

			//row.val_dir = StrUtil.toHalfNumber(StrUtil.zh2num(row.val_dir).toString());

			/*
			r = /^(web)版(\d+)/i;
			if (r.test(row.val_file))
			{
				row.val_file = row.val_file.replace(r, '$1$2');
			}
			*/

			//row.volume_title = StrUtil.trim(row.volume_title, '　');
			//row.chapter_title = StrUtil.trim(row.chapter_title, '　');

			//row.val_dir = StrUtil.zh2num(row.val_dir).toString();

			row.volume_title = normalize_strip(row.volume_title, true);
			row.chapter_title = normalize_strip(row.chapter_title);

			row.val_dir = normalize_val(row.val_dir, padNum, options);
			row.val_file = normalize_val(row.val_file, padNum, options);
		}

		if (options.onListRow)
		{
			row = options.onListRow(a, row, options);

			if (!row)
			{
				throw new Error('onListRow');
			}
		}

		/*
		a[row.val_dir] = a[row.val_dir] || {};
		a[row.val_dir][row.val_file] = row;
		*/

		// 防止純數字的資料夾名稱導致排序失敗
		let key = row.val_dir + '.dir';

		a[key] = a[key] || [];
		a[key].push(row);

		return a;
	}, {} as IReturnList2);
}

/*
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

	if (options && options.sortFn)
	{
		ks2 = options.sortFn(ks2);
	}
	else if (!options || !options.disableSort)
	{
		ks2.sort(options && options.sortCallback);
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

		if (options && options.sortFn)
		{
			a = options.sortFn(a);
		}
		else if (!options || !options.disableSort)
		{
			a.sort(options && options.sortCallback);
		}

		ls[dir] = Object.values(a.reduce(function (a, b)
		{
			a[b] = ls[dir][b];

			return a;
		}, {}));
	}

	return ls;
}
*/

export function p_sort_list(ls: IReturnList2, options: IOptions = {}): IReturnList
{
	/*
	let ret = _p_sort_list1(ls, options);

	return _p_sort_list2(ret, options);
	*/
	return sortList2(ls, options);
}

export function sortList2(ls: IReturnList2, options: IOptions = {})
{
	let comp = options.sortCallback || libSort.defaultSortCallback;

	let ls2 = Object.entries(ls);

	if (options && options.sortFn)
	{
		ls2 = options.sortFn(ls2);
	}
	else if (!options || !options.disableSort)
	{
		ls2.sort(function (a, b)
		{
			return comp(a[0], b[0]);
		});
	}

	return ls2
		/*
		.sort(function (a, b)
		{
			return comp(a[0], b[0]);
		})
		*/
		.reduce(function (a, entries)
		{
			let dir: string;

			let ls2 = Object.values(entries[1])
				.sort(function (a, b)
				{
					//console.log(a.val_file, b.val_file);

					return comp(a.val_file, b.val_file);
				})
				;

			//console.log(ls2);

			let ls = ls2
				.reduce(function (a, row)
				{
					dir = row.dir;

					//a[row.file.toString()] = row;
					a.push(row);

					return a;
				}, [])
			;

			// 防止純數字的資料夾名稱導致排序失敗
			a[dir + '.dir'] = ls;

			return a;
		}, {})
	;
}

export default exports as typeof import('./index');
