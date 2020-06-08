/**
 * Created by user on 2020/6/9.
 */
import { ITree } from '@lazy-glob/util/lib/types';
import { ISortEntriesSort } from '@lazy-glob/util/lib/types/entries';
export declare function entries_sort(entries: any, fn?: (a: string, b: string, cache: any) => number, cache?: any): ISortEntriesSort;
export declare function entries_reduce(entries: any): ITree;
export declare function sort(a: ITree, fn?: (a: string, b: string, cache: any) => number): ITree;
export default sort;
