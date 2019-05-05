/**
 * Created by user on 2018/2/14/014.
 */

import Promise = require('bluebird');
// @ts-ignore
import path = require('upath2');
export { path }

import StrUtil = require('str-util');
export * from './options';
import { IOptions, defaultPatternsExclude, getOptions, getOptionsRuntime } from './options';
export { IOptions, defaultPatternsExclude, getOptions }

import libSort = require('./sort');

import { normalize_strip, normalize_val } from './helper';

export { normalize_val }

import * as globby from 'globby';
import { sortTree } from './glob-sort';

import { sort as globTreeListUtilSort } from 'glob-tree-list/lib/util';
import { glob_to_list_array, glob_to_list_array_deep, pathToListRow } from './list';
import { IArrayDeepInterface, IArrayDeep, IForeachArrayDeepCache, IForeachArrayDeepReturn, foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep } from './util';
export { IArrayDeepInterface, IArrayDeep, IForeachArrayDeepCache, IForeachArrayDeepReturn, foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep }

export { pathToListRow }

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

export function createGlobToType<T>(fn: (glob_ls: string[], options?: IOptions) => T)
{
	return function (glob_ls: string[], options: IOptions = {})
	{
		if (!Array.isArray(glob_ls) || !glob_ls.length)
		{
			if (options.throwEmpty)
			{
				throw new Error(`glob matched list is empty`);
			}

			return null;
		}

		let comp = options.sortCallback || libSort.defaultSortCallback;

		let ls = sortTree(glob_ls, comp as any, options);

		return fn(ls, options);
	};
}

export const globToList = createGlobToType<IReturnList2>(glob_to_list);

export const globToListArray = createGlobToType(glob_to_list_array);

export const globToListArrayDeep = createGlobToType(glob_to_list_array_deep);

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

	options = getOptionsRuntime({
		...options,
	});

	//console.log(glob_ls);

	return glob_ls.reduce(function (a: IReturnList2, b: string, source_idx: number)
	{
		let row = pathToListRow(b, source_idx, options);

		if (options.onListRow)
		{
			row = options.onListRow<IReturnList2>(a, row, options);

			if (!row)
			{
				throw new Error('onListRow');
			}
		}

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
