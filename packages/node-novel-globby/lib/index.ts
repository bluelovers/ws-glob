/**
 * Created by user on 2018/2/14/014.
 */

// @ts-ignore
import path from 'upath2';
import {
	IOptions,
} from '@lazy-glob/util/lib/types/glob';
import {
	defaultPatternsExclude,
	getOptions,
	getOptionsRuntime,
	getOptions2,
} from './options';
import { defaultSortCallback as libSortDefaultSortCallback } from '@node-novel/sort';

import { normalize_val } from '@node-novel/normalize';
import { glob_to_list_array, glob_to_list_array_deep, pathToListRow } from './list';
import { foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep } from './util';
import sortTree from '@lazy-glob/sort-tree';
import { IReturnList2, IReturnList } from './types';
export * from './types';

export { path }
export { defaultPatternsExclude, getOptions, getOptionsRuntime, getOptions2 }

export { normalize_val }

export * from '@lazy-glob/util/lib/types/glob';

export { foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep }

export { pathToListRow }

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

		let comp = options.sortCallback || libSortDefaultSortCallback;

		let ls = sortTree(glob_ls, comp as any, options);

		return fn(ls, options);
	};
}

/**
 * @deprecated
 */
export const globToList = createGlobToType<IReturnList2>(glob_to_list);

export const globToListArray = createGlobToType(glob_to_list_array);

export const globToListArrayDeep = createGlobToType(glob_to_list_array_deep);

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

	return glob_ls.reduce(function (a: IReturnList2, b: string, source_idx: number, arr)
	{
		let row = pathToListRow(b, source_idx, options, arr.length);

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
	let comp = options.sortCallback || libSortDefaultSortCallback;

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
      // @ts-ignore
			a[dir + '.dir'] = ls;

			return a;
		}, {})
	;
}

export * from './options';

export default exports as typeof import('./index');
