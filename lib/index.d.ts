/**
 * Created by user on 2018/2/14/014.
 */
import Bluebird = require('bluebird');
import path = require('upath2');
export { path };
export * from './options';
import { IOptions, defaultPatternsExclude, getOptions, getOptionsRuntime, getOptions2 } from './options';
export { IOptions, defaultPatternsExclude, getOptions, getOptionsRuntime, getOptions2 };
import { normalize_val } from './helper';
export { normalize_val };
import { pathToListRow } from './list';
import { IArrayDeepInterface, IArrayDeep, IForeachArrayDeepCache, IForeachArrayDeepReturn, foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep } from './util';
export { IArrayDeepInterface, IArrayDeep, IForeachArrayDeepCache, IForeachArrayDeepReturn, foreachArrayDeepAsync, eachVolumeTitle, foreachArrayDeep };
export { pathToListRow };
export interface IApi<T> {
    (options: IOptions): T;
    (patterns?: string[], options?: IOptions): T;
}
export declare type IApiSync = IApi<IReturnList>;
export declare type IApiAsync = IApi<Bluebird<IReturnList>>;
export interface IApiWithReturnGlob<T> {
    (options: IOptionsWithReturnGlobList): T;
    (patterns?: string[], options?: IOptionsWithReturnGlobList): T;
}
export declare type IApiWithReturnGlobSync = IApiWithReturnGlob<IReturnGlob>;
export declare type IApiWithReturnGlobAsync = IApiWithReturnGlob<Bluebird<IReturnGlob>>;
export declare type IOptionsWithReturnGlobList = IOptions & IReturnGlobListOptions;
export declare type IReturnGlob = string[];
export interface IReturnRow {
    source_idx: number;
    source_path: string;
    path: string;
    path_dir: string;
    dir: string;
    file: string;
    ext: string;
    volume_title: string;
    chapter_title: string;
    val_file: string;
    val_dir: string;
}
export interface IReturnList {
    [index: number]: IReturnRow[];
    [key: string]: IReturnRow[];
}
export interface IReturnList2 {
    [key: string]: IReturnRow[];
    [index: number]: IReturnRow[];
}
export declare function createGlobToType<T>(fn: (glob_ls: string[], options?: IOptions) => T): (glob_ls: string[], options?: IOptions) => T;
/**
 * @deprecated
 */
export declare const globToList: (glob_ls: string[], options?: IOptions) => IReturnList2;
export declare const globToListArray: (glob_ls: string[], options?: IOptions) => IReturnRow[];
export declare const globToListArrayDeep: (glob_ls: string[], options?: IOptions) => IArrayDeepInterface<IReturnRow>;
export interface IReturnGlobListOptions {
    useSourcePath?: boolean;
}
export declare function returnGlobList(ls: IReturnList, options?: IReturnGlobListOptions & IOptions): string[];
export declare function glob_to_list(glob_ls: string[], options?: IOptions): IReturnList2;
export declare function p_sort_list(ls: IReturnList2, options?: IOptions): IReturnList;
export declare function sortList2(ls: IReturnList2, options?: IOptions): {};
declare const _default: typeof import(".");
export default _default;
