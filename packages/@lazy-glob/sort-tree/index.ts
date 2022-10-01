/**
 * Created by user on 2020/6/9.
 */

import { defaultSortCallback } from '@node-novel/sort';
// @ts-ignore
import { globToTree, treeToGlob } from 'glob-tree-list';
import { sort } from '@lazy-glob/sort-entries';
import { normalize_val } from '@node-novel/normalize';
import { IOptions } from '@lazy-glob/util/lib/types/glob';

export function sortTree(ls: string[], sortFn = defaultSortCallback, options: IOptions = {}): string[]
{
	const padNum = options.padNum || 5;

	sortFn ??= defaultSortCallback;

	const t = globToTree(ls);

	let _cache = {};
	const t2 = sort(t, function (a: any, b: any, cache: any)
	{
		return sortFn(_c(a, cache), _c(b, cache));
	});

	function _c(k: string, cache: any): string
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

export default sortTree;
