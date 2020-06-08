/**
 * Created by user on 2018/2/14/014.
 */
import path from 'upath2';
import { IOptions, IArrayDeepInterface } from '@lazy-glob/util/lib/types/glob';
import { defaultPatternsExclude, getOptions, getOptionsRuntime, getOptions2 } from './options';
import { normalize_val } from '@node-novel/normalize';
import { pathToListRow } from './list';
import { foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep } from './util';
import { IReturnList2, IReturnList } from './types';
export * from './types';
export { path };
export { defaultPatternsExclude, getOptions, getOptionsRuntime, getOptions2 };
export { normalize_val };
export * from '@lazy-glob/util/lib/types/glob';
export { foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep };
export { pathToListRow };
export declare function createGlobToType<T>(fn: (glob_ls: string[], options?: IOptions) => T): (glob_ls: string[], options?: IOptions) => T;
/**
 * @deprecated
 */
export declare const globToList: (glob_ls: string[], options?: IOptions) => IReturnList2;
export declare const globToListArray: (glob_ls: string[], options?: IOptions) => import("./types").IReturnRow[];
export declare const globToListArrayDeep: (glob_ls: string[], options?: IOptions) => IArrayDeepInterface<import("./types").IReturnRow>;
export declare function glob_to_list(glob_ls: string[], options?: IOptions): IReturnList2;
export declare function p_sort_list(ls: IReturnList2, options?: IOptions): IReturnList;
export declare function sortList2(ls: IReturnList2, options?: IOptions): {};
export * from './options';
declare const _default: typeof import(".");
export default _default;
