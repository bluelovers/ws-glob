/**
 * Created by user on 2018/3/29/029.
 */

import { globToTree, treeToGlob, ITree } from 'glob-tree-list';
import { sort } from 'glob-tree-list/lib/util';
import { naturalCompare, defaultSortCallback } from './sort';
import { normalize_val } from './helper';
import { IOptions } from './options';

export function sortTree(ls: string[], sortFn = defaultSortCallback, options: IOptions = {}): string[]
{
	let padNum = options.padNum || 5;

	if (sortFn == null)
	{
		sortFn = defaultSortCallback;
	}

	let t = globToTree(ls);
	let _cache = {};
	let t2 = sort(t, function (a, b, cache)
	{
		return sortFn(_c(a, cache), _c(b, cache));
	});

	function _c(k: string, cache): string
	{
		cache = _cache;

		if (k in cache)
		{
			return cache[k];
		}

		cache[k] = normalize_val(k, padNum, options);

		_cache = cache;

		return cache[k];
	}

	return treeToGlob(t2);
}

/*
let data = `00020_1章.txt
00020_2章/
00020_3章/
00020_3章/3章 8話.txt
00020_3章/3章 10話.txt
00020_3章/3章 11話.txt
00020_3章/3章 12話.txt
00020_3章/3章 13話.txt
00020_3章/3章 9話/3章 9話file.txt
00020_3章/3章 14話.txt
00020_3章/3章 15.5話 特別閑話.txt
00020_3章/3章 16話.txt
00020_3章/3章 15話.txt
00020_3章/3章 17話.txt`.split("\n");

console.log(sortTree(data));
*/
