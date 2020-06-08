/**
 * Created by user on 2020/6/9.
 */
import { ITree } from '@lazy-glob/util/lib/types';
export declare function entries_sort(entries: any, fn?: (a: string, b: string, cache: any) => number, cache?: any): any;
export declare function entries_reduce(entries: any): any;
export declare function sort(a: ITree, fn?: (a: string, b: string, cache: any) => number): any;
export default sort;
