/**
 * Created by user on 2020/6/9.
 */
import { ITree } from '@lazy-glob/util/lib/types';
import { ISortEntriesSort } from '@lazy-glob/util/lib/types/entries';
type IEntry<T extends Record<any, any>, K extends keyof T> = [K, T[K]];
type IEntries<T extends ITree = ITree> = IEntry<T, keyof T>[];
export type IEntriesInput = IEntries | ISortEntriesSort;
export declare function entries_sort(entries: IEntriesInput, fn?: (a: string, b: string, cache: any) => number, cache?: any): ISortEntriesSort;
export declare function entries_reduce(entries: IEntriesInput): ITree;
export declare function sort(a: ITree, fn?: (a: string, b: string, cache: any) => number): ITree;
export default sort;
