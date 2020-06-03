/**
 * Created by user on 2018/3/30/030.
 */
import naturalCompare from 'string-natural-compare';
export { naturalCompare };
import { ITree } from '../core';
export declare function entries_sort(entries: any, fn?: (a: string, b: string, cache: any) => number, cache?: any): any;
export declare function entries_reduce(entries: any): any;
export declare function sort(a: ITree, fn?: (a: string, b: string, cache: any) => number): any;
declare const _default: typeof import("./util");
export default _default;
