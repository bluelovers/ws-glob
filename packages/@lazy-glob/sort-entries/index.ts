/**
 * Created by user on 2020/6/9.
 */

import naturalCompare from '@bluelovers/string-natural-compare';
import { ITree } from '@lazy-glob/util/lib/types';

export function entries_sort(entries, fn: (a: string, b: string, cache) => number = naturalCompare, cache: any = {})
{
	entries = entries.reduce(function (a, b)
	{
		if (b[1] === null || typeof b[1] == 'string')
		{
			a.push(b);
		}
		else
		{
			let d = Object.entries(b[1]);
			a.push([b[0], entries_sort(d, fn)]);
		}

		return a;
	}, []);

	entries.sort(function (a, b)
	{
		let r = fn(a[0], b[0], cache);
		return r;
	});

	return entries;
}

export function entries_reduce(entries)
{
	return entries
		.reduce(function (a, b)
		{
			if (b[1] === null || typeof b[1] == 'string')
			{
				a[b[0]] = b[1];
			}
			else
			{
				a[b[0]] = entries_reduce(b[1]);
			}

			return a;
		}, {})
		;
}

export function sort(a: ITree, fn: (a: string, b: string, cache) => number = naturalCompare)
{
	let r = Object.entries(a);

	return entries_reduce(entries_sort(r, fn))
}

export default sort
