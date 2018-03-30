import * as naturalCompare from 'string-natural-compare';
export { naturalCompare };
import { ITree } from '../core';
export declare function entries_sort(entries: any, fn?: (a: string, b: string, cache) => number, cache?: any): any;
export declare function entries_reduce(entries: any): any;
export declare function sort(a: ITree, fn?: (a: string, b: string, cache) => number): any;
import * as self from './util';
export default self;
