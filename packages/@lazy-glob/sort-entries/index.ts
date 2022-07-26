/**
 * Created by user on 2020/6/9.
 */

import { naturalCompare } from '@bluelovers/string-natural-compare';
import { ITree } from '@lazy-glob/util/lib/types';
import { ISortEntriesSort, ISortEntriesSortRow } from '@lazy-glob/util/lib/types/entries';
import { SymGlobTree } from '@lazy-glob/util';

export function entries_sort(entries, fn: (a: string, b: string, cache) => number = naturalCompare, cache: any = {}): ISortEntriesSort
{
	entries = entries.reduce(function (a: ISortEntriesSort, b: ISortEntriesSortRow)
	{
		let v = b[1];

		if (v === null || typeof v == 'string')
		{
			a.push(b);
		}
		else
		{
			let d = Object.entries(v);
			a.push([b[0], entries_sort(d, fn), v[SymGlobTree]]);
		}

		return a;
	}, [] as ISortEntriesSort);

	(entries as ISortEntriesSort).sort(function (a, b)
	{
		let r = fn(a[0], b[0], cache);
		return r;
	});

	return entries;
}

export function entries_reduce(entries)
{
	return (entries as ISortEntriesSort)
		.reduce(function (a, [k, v, bool]: ISortEntriesSortRow)
		{
			if (v === null || typeof v == 'string')
			{
				a[k] = v as string;
			}
			else
			{
				a[k] = entries_reduce(v);
			}

			if (bool)
			{
				a[k][SymGlobTree] = bool;
			}

			return a;
		}, {} as ITree)
		;
}

export function sort(a: ITree, fn: (a: string, b: string, cache) => number = naturalCompare)
{
	let r = Object.entries(a);

	let a1 = entries_sort(r, fn);
	let a2 = entries_reduce(a1);

	return a2
}

export default sort
