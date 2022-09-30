/**
 * Created by user on 2020/6/9.
 */

import { naturalCompare } from '@bluelovers/string-natural-compare';
import { ITree } from '@lazy-glob/util/lib/types';
import { ISortEntriesSort, ISortEntriesSortRow } from '@lazy-glob/util/lib/types/entries';
import { SymGlobTree } from '@lazy-glob/util';

type IEntry<T extends Record<any, any>, K extends keyof T> = [K, T[K]]
type IEntries<T extends ITree = ITree> = IEntry<T, keyof T>[];

export type IEntriesInput = IEntries | ISortEntriesSort;

export function entries_sort(entries: IEntriesInput, fn: (a: string, b: string, cache: any) => number = naturalCompare, cache: any = {}): ISortEntriesSort
{
	entries = (entries as ISortEntriesSort).reduce(function (a: ISortEntriesSort, b: ISortEntriesSortRow)
	{
    const v = b[1];

    if (v === null || typeof v == 'string')
		{
			a.push(b);
		}
		else
		{
      const d = Object.entries(v);
      a.push([b[0], entries_sort(d, fn), (v as any)[SymGlobTree]]);
		}

		return a;
	}, [] as ISortEntriesSort);

	(entries as ISortEntriesSort).sort(function (a, b)
	{
    const r = fn(a[0], b[0], cache);
    return r;
	});

	return entries;
}

export function entries_reduce(entries: IEntriesInput)
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
        // @ts-ignore
				a[k][SymGlobTree] = bool;
			}

			return a;
		}, {} as ITree)
		;
}

export function sort(a: ITree, fn: (a: string, b: string, cache: any) => number = naturalCompare)
{
  const r = Object.entries(a);

  const a1 = entries_sort(r, fn);
  const a2 = entries_reduce(a1);

  return a2
}

export default sort
